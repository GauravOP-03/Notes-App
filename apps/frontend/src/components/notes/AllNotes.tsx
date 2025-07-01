import { useState, useMemo, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import { motion } from "motion/react";
import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/schema";
import { NoteModal } from "@/components/modals/NoteModal";
import NoteCard from "@/components/notes/NoteCard";
import NotesSearchSort from "@/components/notes/NotesSearchSort";
import Navbar from "@/components/layout/Navbar";
import NotesLoader from "../NotesLoader";
import NotesEmpty from "../NotesEmpty";

interface AllNotesProps {
  onDelete: (id: string) => Promise<void>;
  onSave: (updatedNote: Note) => Promise<void>;
  onShare: (noteId: string) => Promise<void>;
  summarize: (id: string) => Promise<void>;
  onShareRemove: (noteId: string) => Promise<void>;
  summarizeImage: (url: string, id: string) => Promise<void>;
  pinnedNotes: (id: string) => Promise<void>;
}

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export default function AllNotes({
  onDelete,
  onSave,
  onShare,
  summarize,
  onShareRemove,
  summarizeImage,
  pinnedNotes

}: AllNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { notes, loading } = useNotes();

  const handleSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCardClick = useCallback((note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNote(null);
  }, []);

  const filteredNotes = useMemo(() => {
    const visibleNotes = notes.filter(
      (note) =>
        !note.archived && (
          note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.noteBody.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const sorted = [...visibleNotes].sort((a, b) => {
      // Always show pinned notes on top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "title":
          aValue = a.heading.toLowerCase();
          bValue = b.heading.toLowerCase();
          break;
        case "created":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "updated":
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [notes, searchQuery, sortField, sortOrder]);


  useEffect(() => {
    if (!selectedNote) return;
    const latest = notes.find((n) => n._id === selectedNote._id);
    if (latest) setSelectedNote(latest);
  }, [notes, selectedNote]);


  const handleSortField = useCallback((field: string) => {
    setSortField(field);
  }, []);

  const handleSortOrder = useCallback((order: "asc" | "desc") => {
    setSortOrder(order);
  }, []);



  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 text-gray-800">
      <Navbar />

      {notes.length > 0 && (
        <section className="max-w-6xl mx-auto w-full px-6 mt-10 mb-8">
          <NotesSearchSort
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQuery}
            sortField={sortField}
            setSortField={handleSortField}
            sortOrder={sortOrder}
            setSortOrder={handleSortOrder}
          />


        </section>
      )}

      <main className="flex-1 px-6 pb-20">
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
            {filteredNotes.map((note, idx) => {
              const handleClick = () => handleCardClick(note);

              return (
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
                    onClick={handleClick}
                    onShare={onShare}
                    onShareRemove={onShareRemove}
                    pinnedNotes={pinnedNotes}
                  />
                </motion.div>
              );
            })}

          </Masonry>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        note={selectedNote}
        onSave={onSave}
        summarize={summarize}
        summarizeImage={summarizeImage}
      />
    </div>
  );
}
