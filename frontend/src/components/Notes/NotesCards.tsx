import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ImageIcon, MicIcon, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { NoteModal } from "./NoteModal";
import { useState } from "react";
import { Note } from "@/hooks";
interface NotesCardsProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onSave: (updatedNote: Note) => void;
}
export default function NotesCards({
  notes,
  onDelete,
  onSave,
}: NotesCardsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(notes);
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

  return (
    <>
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4">
          <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">Sort</Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="grid gap-4 max-w-4xl mx-auto md:grid-cols-2">
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
                    <h3 className="font-medium leading-none">{note.heading}</h3>
                  </div>

                  <Button
                    variant="ghost"
                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
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
                  {(() => {
                    let n = 0;
                    if (note.image !== null) {
                      note.image.forEach((d) => {
                        if (d !== null) {
                          n += 1;
                        }
                      });
                    }
                    return (
                      n !== 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <ImageIcon className="w-4 h-4" />
                          {n} Image
                        </span>
                      )
                    );
                  })()}
                  {note.audioFile && (
                    <MicIcon className="w-4 h-4 text-gray-500 cursor-pointer " />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Modal component */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        note={selectedNote}
        onSave={onSave}
      />
    </>
  );
}
