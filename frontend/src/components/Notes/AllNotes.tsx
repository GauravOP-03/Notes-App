import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ImageIcon, MicIcon, Search, Trash2, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { NoteModal } from "./NoteModal";
import { useState } from "react";
import { Note } from "@/types/schema";
import { useNotes } from "@/context/NotesContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react"


interface AllNotesProps {
  onDelete: (id: string) => Promise<void>;
  onSave: (updatedNote: Note) => Promise<void>;
}
export default function AllNotes({ onDelete, onSave }: AllNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { notes } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  // console.log(notes);
  // filtering notes on search
  const filteredNotes = notes.filter(
    (note) =>
      note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.noteBody.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true); // Open the modal on card click
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedNote(null); // Clear the selected note
  };
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <>
      <div className="relative flex flex-col min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 text-gray-800 font-sans transition-all duration-500">

        {/* Navbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/60 shadow-sm">
          <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-800">
              ✨ All Notes
            </h1>

            {/* Avatar Dropdown */}
            <div className="relative group">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm cursor-pointer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold shadow-md cursor-pointer">
                  {user?.username?.[0]}
                </div>
              )}

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white/90 border border-gray-200 hidden group-hover:block">
                <div className="flex flex-col p-2">
                  <button className="hover:bg-gray-100 text-left px-4 py-2 rounded-md">Profile</button>
                  <button onClick={logout} className="hover:bg-gray-100 text-left px-4 py-2 rounded-md">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Search + Sort */}
        <section className="max-w-6xl mx-auto w-full px-6 mt-10 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search your notes..."
                className="pl-12 py-3 rounded-full border-gray-300 shadow-md focus:ring-2 focus:ring-purple-300 bg-white/70 backdrop-blur-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-3 rounded-full border border-gray-300 shadow-md bg-white/70 backdrop-blur-md text-gray-700 focus:ring-2 focus:ring-purple-300">
                <option value="latest">Sort: Latest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="title">Sort: Title</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

          </div>
        </section>

        {/* Notes */}
        <main className="flex-1 px-6 pb-20">
          <div className="grid gap-8 max-w-6xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Card
                  className="group relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-purple-300"
                  onClick={() => handleCardClick(note)}
                >
                  <CardHeader className="flex flex-col gap-2">
                    <p className="text-xs text-gray-400">
                      {new Date(note.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="text-lg font-semibold leading-tight line-clamp-1">
                      {note.heading}
                    </h3>
                  </CardHeader>

                  <CardContent className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {note.noteBody}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between text-xs text-gray-400 mt-4">
                    {note.image?.filter(Boolean).length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        {note.image.filter(Boolean).length}
                      </span>
                    )}
                    {note.audioFile && <MicIcon className="h-4 w-4" />}
                  </CardFooter>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note._id);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Floating Real Time Notes Button (Mobile) */}
        {user && (
          <div className="md:hidden fixed bottom-24 left-4 right-4 z-20">
            <Link
              to={`/${user._id}/notes`}
              target="_blank"
              className="block w-full text-center px-4 py-3 rounded-2xl text-md font-semibold bg-white/70 backdrop-blur-lg hover:bg-black hover:text-white border border-gray-300 shadow-md transition"
            >
              Real Time Notes
            </Link>
          </div>
        )}

        {/* Floating Dark Mode Button */}
        <div className="fixed bottom-6 right-6 z-30">
          <button className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md border border-gray-300 hover:bg-black hover:text-white transition">
            🌓
          </button>
        </div>

        {/* Modal */}
        <NoteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          note={selectedNote}
          onSave={onSave}
        />
      </div>
    </>

  );
}
