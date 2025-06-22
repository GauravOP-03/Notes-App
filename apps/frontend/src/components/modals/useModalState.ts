import { useState, useEffect, useCallback } from "react";
import { Note } from "@/types/schema";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export function useNoteModalState(
  note: Note | null,
  onSave: (updatedNote: Note) => Promise<void>,
  summarize: (id: string) => Promise<void>,
  onClose: () => void
) {
  const [editedNote, setEditedNote] = useState<Note | null>(note);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState<string>("");
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [deleteAudio, setDeleteAudio] = useState(false);

  useEffect(() => {
    if (note) setEditedNote(note);
  }, [note]);

  useEffect(() => {
    if (
      !summarizing &&
      editedNote?.aiData?.summary &&
      editedNote.aiData.summary !== displayedSummary
    ) {
      setDisplayedSummary(editedNote.aiData.summary);
    }
  }, [displayedSummary, editedNote?.aiData?.summary, summarizing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!editedNote) return;
    setEditedNote((prev) => ({ ...prev!, [name]: value }));
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && editedNote) {
        setEditedNote((prev) => ({
          ...prev!,
          file: files[0],
        }));
      }
    },
    [editedNote]
  );

  const handleSave = useCallback(async () => {
    if (!editedNote) return;

    setLoading(true);
    try {
      for (const img of imagesToDelete) {
        await axios.delete(`${BACKEND_URL}/notes/${editedNote._id}/image`, {
          data: { img },
          withCredentials: true,
        });
      }

      if (deleteAudio && note?.audioFile) {
        await axios.delete(`${BACKEND_URL}/notes/${editedNote._id}/voice`, {
          data: { voice: note.audioFile },
          withCredentials: true,
        });
      }

      await onSave(editedNote);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setDeleteAudio(false);
      setImagesToDelete([]);
    }
  }, [
    editedNote,
    deleteAudio,
    imagesToDelete,
    note?.audioFile,
    onSave,
    onClose,
  ]);

  const summarizeText = useCallback(async () => {
    if (!editedNote) return;
    setSummarizing(true);
    try {
      await summarize(editedNote._id);
    } finally {
      setSummarizing(false);
    }
  }, [editedNote, summarize]);

  const markImageForDeletion = useCallback(
    (img: string) => {
      if (!editedNote) return;
      setEditedNote((prev) => ({
        ...prev!,
        image: prev!.image?.filter((i) => i !== img),
      }));
      setImagesToDelete((prev) => [...prev, img]);
    },
    [editedNote]
  );

  const markAudioForDeletion = useCallback(() => {
    if (!editedNote) return;
    setEditedNote((prev) => ({ ...prev!, audioFile: null }));
    setDeleteAudio(true);
  }, [editedNote]);

  return {
    ready: !!editedNote,
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
