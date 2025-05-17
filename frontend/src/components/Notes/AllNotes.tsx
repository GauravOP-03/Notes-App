import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useNotes } from "@/context/NotesContext";
import { useAuth } from "@/context/AuthContext";
import { Note } from "@/types/schema";
import { NoteModal } from "@/components/modals/NoteModal";
import NoteCard from "@/components/notes/NoteCard";
import NotesSearchSort from "@/components/notes/NotesSearchSort";
import FloatingActions from "@/components/layout/FloatingActions";
import Navbar from "@/components/layout/Navbar";
import NotesLoader from "../NotesLoader";
import NotesEmpty from "../NotesEmpty";
// import { Toaster } from "../ui/sonner";

interface AllNotesProps {
  onDelete: (id: string) => Promise<void>;
  onSave: (updatedNote: Note) => Promise<void>;
  onShare: (noteId: string) => Promise<void>;
}

export default function AllNotes({ onDelete, onSave, onShare }: AllNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { notes, loading } = useNotes();
  const { user } = useAuth();

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.noteBody.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  function handleSearchQuery(query: string): void {
    setSearchQuery(query);
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 text-gray-800">
      <Navbar />

      {notes.length > 0 && (
        <section className="max-w-6xl mx-auto w-full px-6 mt-10 mb-8">
          <NotesSearchSort searchQuery={searchQuery} setSearchQuery={handleSearchQuery} />
        </section>
      )}


      <main className="flex-1 px-6 pb-20">
        {/* <Toaster /> */}
        {loading ? (
          <NotesLoader />
        ) : filteredNotes.length === 0 ? (
          <NotesEmpty />
        ) : (
          <div className="grid gap-8 max-w-6xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note, idx) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <NoteCard
                  note={note}
                  onDelete={onDelete}
                  onClick={() => handleCardClick(note)}
                  onShare={onShare}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {user && <FloatingActions userId={user._id} />}

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        note={selectedNote}
        onSave={onSave}
      />
    </div>
  );
}
