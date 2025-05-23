import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import Masonry from 'react-masonry-css';
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
  summarize: (id: string) => Promise<void>;
  onShareRemove: (noteId:string) =>Promise<void>;
}


const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1
};

export default function AllNotes({ onDelete, onSave, onShare, summarize, onShareRemove }: AllNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { notes, loading } = useNotes();
  const { user } = useAuth();

  const filteredNotes = useMemo(() => {
    // Filter
    const filtered = notes.filter(
      (note) =>
        note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.noteBody.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";
      if (sortField === "title") {
        aValue = a.heading.toLowerCase();
        bValue = b.heading.toLowerCase();
      } else if (sortField === "created") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortField === "updated") {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [notes, searchQuery, sortField, sortOrder]);

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
    // console.log(note)
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  function handleSearchQuery(query: string): void {
    setSearchQuery(query);
  }

  useEffect(() => {
    if (selectedNote) {
      const updated = notes.find(n => n._id === selectedNote._id);
      if (updated) setSelectedNote(updated);
    }
  }, [notes]);


  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 text-gray-800">
      <Navbar />

      {notes.length > 0 && (
        <section className="max-w-6xl mx-auto w-full px-6 mt-10 mb-8">
          <NotesSearchSort
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQuery}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </section>
      )}

      <main className="flex-1 px-6 pb-20">
        {/* <Toaster /> */}
        {loading ? (
          <NotesLoader />
        ) : filteredNotes.length === 0 ? (
          <NotesEmpty />
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto max-w-6xl mx-auto"
            columnClassName="pl-8 bg-clip-padding"
          >
            {filteredNotes.map((note, idx) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="mb-8"
              >
                <NoteCard
                  note={note}
                  onDelete={onDelete}
                  onClick={() => handleCardClick(note)}
                  onShare={onShare}
                  onShareRemove={onShareRemove}
                />
              </motion.div>
            ))}
          </Masonry>
        )}
      </main>

      {user && <FloatingActions userId={user._id} />}

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        note={selectedNote}
        onSave={onSave}
        summarize={summarize}
      />
    </div>
  );
}
