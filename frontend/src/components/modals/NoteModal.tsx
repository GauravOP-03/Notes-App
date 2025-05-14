/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

import { Note } from "@/types/schema";
import axios from "axios";
import { BACKEND_URL } from "@/config";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (updatedNote: Note) => Promise<void>; // Function to save changes
  //  // Loading state
}

export const NoteModal = ({
  isOpen,
  onClose,
  note,
  onSave
}: NoteModalProps) => {

  if (!note || !isOpen) return null;


  // console.log(note)
  const [editedNote, setEditedNote] = useState<Note>(note);
  // console.log("edited note:", editedNote)
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedNote((prev) => ({ ...prev, [name]: value }));
    // console.log(editedNote)
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

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [deleteAudio, setDeleteAudio] = useState<boolean>(false);


  const handleSave = async () => {
    setLoading(true)
    try {

      for (const img of imagesToDelete) {
        await axios.delete(`${BACKEND_URL}/notes/${editedNote._id}/image`, {
          headers: { Authorization: localStorage.getItem("token") },
          data: { img }
        });
      }

      if (deleteAudio && note.audioFile) {
        await axios.delete(`${BACKEND_URL}/notes/${editedNote._id}/voice`, {
          headers: { Authorization: localStorage.getItem("token") },
          data: { voice: note.audioFile }
        });
      }

      await onSave(editedNote);
      console.log(editedNote);
      onClose();
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      setDeleteAudio(false);
      setImagesToDelete([]);
    }
  };

  // const deleteImage = async (img: string, id: string) => {
  //   try {

  //     const response = await axios.delete(`${BACKEND_URL}/notes/${id}/image`, {
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //       },
  //       data: { img }
  //     })
  //     console.log(response)
  //     const updatedImages = response.data.data.image
  //     console.log(updatedImages)
  //     setEditedNote((prev) => ({ ...prev, image: updatedImages }))
  //     await onSave(editedNote);
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  const markImageForDeletion = (img: string) => {
    setEditedNote(prev => ({
      ...prev,
      image: prev.image?.filter(i => i !== img)
    }));
    setImagesToDelete(prev => [...prev, img]);
  };

  const markAudioForDeletion = () => {
    setEditedNote(prev => ({ ...prev, audioFile: null }));
    setDeleteAudio(true);
    // console.log("maked audio")
  };


  // const deleteVoice = async (voice: string, id: string) => {
  //   try {
  //     await axios.delete(`${BACKEND_URL}/notes/${id}/voice`, {
  //       headers: {
  //         Authorization: localStorage.getItem("token") || "",
  //       },
  //       data: { voice },
  //     });
  //     const updatedNote = { ...editedNote, audioFile: null };
  //     setEditedNote(updatedNote);
  //     await onSave(updatedNote);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };


  return (
    <>
      {/* Dimmed background */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-8/12 md:w-6/12 lg:w-5/12 max-h-[90vh] overflow-y-auto z-50 bg-white rounded-xl shadow-2xl transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        {/* Modal content */}
        <div className="p-8 space-y-6">
          {/* Modal Header */}
          <div className="space-y-1">
            <input
              type="text"
              name="heading"
              value={editedNote.heading}
              onChange={handleChange}
              placeholder="Note Heading..."
              className="w-full text-3xl font-semibold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
            />
            <div className="flex justify-between">

              {/* <p className="text-xs text-gray-500">
                Created At-
                {new Date(editedNote.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p> */}
              <p className="text-xs text-gray-500">

                {new Date(editedNote.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <textarea
            name="noteBody"
            value={editedNote.noteBody}
            onChange={handleChange}
            placeholder="Write your note here..."
            className="w-full h-40 p-4 border rounded-lg text-gray-700 text-base resize-none focus:ring-2 focus:ring-gray-300 focus:outline-none"
          />

          {/* Voice Section */}
          {editedNote.audioFile && !deleteAudio && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-800">Audio:</p>
              <audio controls className="w-full">
                <source src={editedNote.audioFile} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
              <Button onClick={editedNote.audioFile ? markAudioForDeletion : undefined}>Delete</Button>
            </div>
          )}

          {/* Transcribed Text Section */}
          {editedNote.transcribedText && editedNote.transcribedText !== "null" && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold text-gray-800 mb-2">
                Transcribed Text:
              </p>
              <textarea className="w-full h-40 p-4 border rounded-lg text-gray-700 text-base resize-none focus:ring-2 focus:ring-gray-300 focus:outline-none" value={editedNote.transcribedText} onChange={handleChange} name="transcribedText" placeholder="write null to delete permanently.."></textarea>
            </div>
          )}

          {/* Images Section */}
          {editedNote.image &&
            editedNote.image.length > 0 &&
            editedNote.image.filter(Boolean).length > 0 && (
              <div className="space-y-3">
                <p className="font-semibold text-gray-800">Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {editedNote.image.map(
                    (img, idx) =>
                      img && (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden shadow-lg group aspect-[4/3] border-2 ${imagesToDelete.includes(img)
                            ? "border-red-500 opacity-60"
                            : "border-transparent"
                            }`}
                        >
                          <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-full"
                          >
                            <img
                              src={img}
                              alt={`Image ${idx}`}
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105`}
                            />
                          </a>
                          {/* Overlay for deleted images */}
                          {imagesToDelete.includes(img) && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center text-white text-sm font-semibold pointer-events-none">
                              Marked for Deletion
                            </div>
                          )}
                          {/* Delete Button */}
                          <button
                            onClick={() => markImageForDeletion(img)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Image"
                          >
                            ✕
                          </button>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}


          {/* Upload Section */}
          <div>
            <label className="block font-semibold text-gray-800 mb-2">
              Upload File:
            </label>
            <input
              type="file"
              name="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 p-2 border rounded-lg cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t">
            <Button
              variant="outline"
              className="px-6 py-2 transition hover:bg-gray-100"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              className="px-6 py-2 flex items-center gap-2 transition hover:bg-gray-800 hover:text-white"
              onClick={handleSave}
              disabled={loading}
            >
              <Pencil className="h-4 w-4" /> {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
