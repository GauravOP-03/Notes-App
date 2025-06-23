import { Note } from "@/types/schema";
import { NoteModalHeader } from "./NoteModalHeader";
import { NoteModalBody } from "./NoteModalBody";
import { NoteModalFooter } from "./NoteModalFooter";
import { useNoteModalState } from "./useModalState";
import { memo, useEffect } from "react";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (updatedNote: Note) => Promise<void>;
  summarize: (id: string) => Promise<void>;
}

export const NoteModal = memo(
  ({ isOpen, onClose, note, onSave, summarize }: NoteModalProps) => {
    const state = useNoteModalState(note, onSave, summarize, onClose);

    // Optional: Close modal on Escape key press
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      if (isOpen) {
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
      }
    }, [isOpen, onClose]);

    // Early return if modal shouldn't show
    if (!isOpen || !state.ready || !state.editedNote) return null;

    const { editedNote, handleChange } = state;

    return (
      <>
        {/* Backdrop layer - closes modal on click */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={onClose}
        />

        {/* Modal container centered on screen */}
        <div className="fixed inset-4 md:inset-6 lg:inset-8 xl:inset-12 z-50 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <NoteModalHeader
              updatedAt={editedNote.updatedAt}
              heading={editedNote.heading}
              onClose={onClose}
              onChange={handleChange}
            />

            {/* Body */}
            <NoteModalBody
              noteBody={editedNote.noteBody}
              transcribedText={editedNote.transcribedText || ""}
              audioFile={editedNote.audioFile ?? null}
              image={editedNote.image || []}
              tags={editedNote.aiData?.tags || []}
              file={editedNote.file ?? undefined}
              displayedSummary={state.displayedSummary}
              summarizing={state.summarizing}
              summarizeText={state.summarizeText}
              handleChange={state.handleChange}
              handleFileChange={state.handleFileChange}
              markAudioForDeletion={state.markAudioForDeletion}
              markImageForDeletion={state.markImageForDeletion}
              imagesToDelete={state.imagesToDelete}
              deleteAudio={state.deleteAudio}
            />

            {/* Footer */}
            <NoteModalFooter loading={state.loading} onClose={state.onClose} handleSave={state.handleSave} isNoteDirty={state.isNoteDirty} />
          </div>
        </div>
      </>
    );
  }
);
