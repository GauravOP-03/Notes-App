import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

import { Note } from "@/hooks";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (updatedNote: Note) => void; // Function to save changes
}

export const NoteModal = ({
  isOpen,
  onClose,
  note,
  onSave,
}: NoteModalProps) => {
  if (!note || !isOpen) return null;

  // State to hold edited data
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedNote, setEditedNote] = useState<Note>(note);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedNote((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setEditedNote((prev) => ({
        ...prev,
        file: files[0],
      }));
    }
  };

  const handleSave = () => {
    onSave(editedNote);
    console.log(editedNote);
    onClose();
  };

  return (
    <>
      {/* Dimmed background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={`fixed inset-0 flex justify-center items-center p-4 z-50 transition-all transform overflow-y-auto ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full transition-transform transform">
          {/* Modal Header */}
          <h2 className="text-3xl font-semibold text-gray-800">
            <input
              type="text"
              name="heading"
              value={editedNote.heading}
              onChange={handleChange}
              className="w-full text-3xl font-semibold text-gray-800 bg-transparent border-none outline-none"
            />
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {new Date(editedNote.date).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          {/* Modal Body */}
          <textarea
            name="noteBody"
            value={editedNote.noteBody}
            onChange={handleChange}
            className="mt-6 w-full text-lg text-gray-700 p-4 border rounded-lg resize-none"
            rows={6}
          />
          {/* Voice area */}
          {editedNote.audioFile && (
            <div className="mt-6">
              <p className="font-semibold text-gray-800">Audio:</p>
              <audio controls className="w-full mt-2">
                <source src={editedNote.audioFile} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Transcribed Text Section */}
          {editedNote.transcribedText && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold text-gray-800">Transcribed Text:</p>
              <p className="text-gray-700 mt-2">{editedNote.transcribedText}</p>
            </div>
          )}

          {/* Images Section */}
          {editedNote.image && editedNote.image.length > 0 && (
            <div className="mt-6">
              <p className="font-semibold text-gray-800">Images:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {editedNote.image.map(
                  (img, idx) =>
                    img && (
                      <div key={idx} className="w-full group">
                        <a href={img} target="_blank" rel="noopener noreferrer">
                          <img
                            src={img}
                            alt={`Image ${idx}`}
                            className="w-full h-auto rounded-xl shadow-lg object-cover transition-transform transform group-hover:scale-105"
                          />
                        </a>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block font-semibold text-gray-800">
              Upload File:
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="mt-2 w-full text-sm text-gray-700 p-2 border rounded-lg"
            />
          </div>

          {/* Footer with close and save options */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              className="px-6 py-2 transition-colors hover:bg-gray-100"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="px-6 py-2 flex items-center gap-2 transition-colors hover:bg-gray-100"
              onClick={handleSave} // Save changes when clicked
            >
              <Pencil className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
