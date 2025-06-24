import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Note } from "@/types/schema";
import axios from "axios";
// import { BACKEND_URL } from "@/config";

export function useNoteModalState(
  note: Note | null,
  onSave: (updatedNote: Note) => Promise<void>,
  summarize: (id: string) => Promise<void>,
  onClose: () => void
) {
  // Editable note state
  const [editedNote, setEditedNote] = useState<Note | null>(note);

  // Track loading state for save and summarization
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  // Summary to display in UI
  const [displayedSummary, setDisplayedSummary] = useState("");

  // Track deletions (image and audio)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [deleteAudio, setDeleteAudio] = useState(false);

  // Ref to keep latest editedNote without causing re-renders
  const editedNoteRef = useRef<Note | null>(note);

  const originalNoteRef = useRef<Note | null>(note);

  // Update internal state and ref when a new note is passed in
  useEffect(() => {
    if (note) {
      setEditedNote(note);
      editedNoteRef.current = note;
      originalNoteRef.current = note; // Track pristine copy for comparison
    }
  }, [note]);

  // Update the ref every time editedNote changes
  useEffect(() => {
    editedNoteRef.current = editedNote;
  }, [editedNote]);

  // Update displayed summary when AI-generated summary changes
  useEffect(() => {
    if (
      !summarizing &&
      editedNote?.aiData?.summary &&
      editedNote.aiData.summary !== displayedSummary
    ) {
      setDisplayedSummary(editedNote.aiData.summary);
    }
  }, [editedNote?.aiData?.summary, summarizing, displayedSummary]);

  // Handle input or textarea change for text fields like title, noteBody, etc.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditedNote((prev) => prev && { ...prev, [name]: value });
    },
    []
  );

  const isNoteDirty = useMemo(() => {
    const original = originalNoteRef.current;
    const edited = editedNote;

    if (!original || !edited) return false;

    // Add any fields you want to track for changes
    return (
      original.heading !== edited.heading ||
      original.noteBody !== edited.noteBody ||
      original.transcribedText !== edited.transcribedText ||
      original.audioFile !== edited.audioFile ||
      JSON.stringify(original.image || []) !==
        JSON.stringify(edited.image || []) ||
      edited.file !== undefined // new file uploaded
    );
  }, [editedNote]);

  // Handle file selection (for image/audio upload)
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.length) {
        setEditedNote((prev) => prev && { ...prev, file: files[0] });
      }
    },
    []
  );

  // Save the note, including deleting images/audio if needed
  const handleSave = useCallback(async () => {
    const currentNote = editedNoteRef.current;
    if (!currentNote) return;

    setLoading(true);
    try {
      // Delete selected images
      await Promise.all([
        ...imagesToDelete.map((img) =>
          axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/notes/${currentNote._id}/image`,
            {
              data: { img },
              withCredentials: true,
            }
          )
        ),
        // Delete audio if flagged
        deleteAudio && note?.audioFile
          ? axios.delete(
              `${import.meta.env.BACKEND_URL}/notes/${currentNote._id}/voice`,
              {
                data: { voice: note.audioFile },
                withCredentials: true,
              }
            )
          : null,
      ]);

      // Save updated note
      await onSave(currentNote);
      onClose();
    } catch (e) {
      console.error("Error saving note:", e);
    } finally {
      setLoading(false);
      setDeleteAudio(false);
      setImagesToDelete([]);
    }
  }, [imagesToDelete, deleteAudio, note?.audioFile, onSave, onClose]);

  // Trigger AI summarization
  const summarizeText = useCallback(async () => {
    const currentNote = editedNoteRef.current;
    if (!currentNote) return;

    setSummarizing(true);
    try {
      await summarize(currentNote._id);
    } catch (e) {
      console.error("Error summarizing note:", e);
    } finally {
      setSummarizing(false);
    }
  }, [summarize]);

  // Mark an image for deletion and update state
  const markImageForDeletion = useCallback((img: string) => {
    setEditedNote(
      (prev) => prev && { ...prev, image: prev.image?.filter((i) => i !== img) }
    );
    setImagesToDelete((prev) => [...prev, img]);
  }, []);

  // Mark the audio file for deletion
  const markAudioForDeletion = useCallback(() => {
    setEditedNote((prev) => prev && { ...prev, audioFile: null });
    setDeleteAudio(true);
  }, []);

  // Compute whether the modal is ready (i.e., a note is loaded)
  const ready = useMemo(() => !!editedNote, [editedNote]);

  // Return state and actions for use in the modal
  return {
    ready,
    isNoteDirty,
    editedNote,
    setEditedNote,
    loading,
    summarizing,
    displayedSummary,
    handleChange,
    handleFileChange,
    handleSave,
    summarizeText,
    markImageForDeletion,
    markAudioForDeletion,
    deleteAudio,
    imagesToDelete,
    onClose,
  };
}
