import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ImageIcon, MicIcon, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { NoteModal } from "./NoteModal";
import { useState } from "react";
import { Note, useNotes } from "@/hooks";

import { Link, useNavigate } from "react-router-dom";

interface AllNotesProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onSave: (updatedNote: Note) => void;
}
export default function AllNotes({ notes, onDelete, onSave }: AllNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useNotes();
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
      <div className="flex flex-col h-screen">
        {/* Top Heading - Always Visible on Large Screens */}
        <div className="hidden md:block w-full bg-gray-100 p-4 shadow-md text-center font-bold text-lg sticky top-0 z-20">
          ALL NOTES
        </div>

        {/* Mobile Top Bar (Username & Logout) */}
        <div className="md:hidden flex justify-between items-center w-full bg-gray-100 p-4 shadow-md">
          <span className="font-semibold">{user?.username}</span>
          <Button onClick={logout} className="text-sm">
            Logout
          </Button>
        </div>

        <div className="flex flex-1">
          {/* Sidebar - Visible on Large Screens */}
          <div className="hidden md:flex w-64 bg-gray-100 p-4 flex-col items-center shadow-md fixed h-full">
            <Card className="w-full text-center mt-20 mb-4">
              <CardHeader className="flex flex-col items-center gap-2">
                {user && (
                  <div>
                    <div className="text-lg font-semibold">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Button onClick={logout} className="w-full mt-4">
                  Logout
                </Button>
              </CardContent>
            </Card>
            {/* Real Time Notes Link in Sidebar */}
            {user && (
              <Link
                to={`/${user?._id}/notes`}
                target="_blank"
                className="px-8 py-6 rounded-md text-md font-medium shadow-2xl bg-white/95 backdrop-blur-lg 
                       hover:scale-110 hover:text-white/95 transition-all border border-gray-400 text-gray-900 hover:bg-black mt-4"
              >
                Real Time Notes
              </Link>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:ml-64">
            {/* Search Bar */}
            <header className="border-b p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto w-full">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </header>

            {/* Notes Section */}
            <main className="flex-1 overflow-auto p-4">
              <div className="grid gap-4 max-w-4xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note, idx) => (
                  <Card
                    key={idx}
                    className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCardClick(note)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {new Date(note.date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                        <h3 className="font-medium leading-none">
                          {note.heading}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent modal from opening
                          onDelete(note._id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {note.noteBody}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      {note.image?.filter(Boolean).length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <ImageIcon className="w-4 h-4" />
                          {note.image.filter(Boolean).length} Image
                        </span>
                      )}

                      {note.audioFile && (
                        <MicIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </div>

        {/* Real Time Notes Link at the Bottom for Mobile */}
        {user && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 shadow-md text-center mb-1  translate-x-3">
            <Link
              to={`/${user?._id}/notes`}
              target="_blank"
              className="px-4 py-2 rounded-md text-md font-medium shadow-2xl bg-white/95 backdrop-blur-lg 
                     hover:scale-110 hover:text-white/95 transition-all border border-gray-400 text-gray-900 hover:bg-black"
            >
              Real Time Notes
            </Link>
          </div>
        )}

        {/* User Info at Bottom - Visible on Large Screens */}
        <div className="hidden md:block w-full bg-gray-100 p-4 shadow-md text-center">
          {user && (
            <div>
              <div className="text-sm font-semibold">{user.username}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          )}
        </div>

        {/* Modal Component */}
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
