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
  summarize: (id: string) => Promise<void>;
  //  // Loading state
}

export const NoteModal = ({
  isOpen,
  onClose,
  note,
  onSave,
  summarize
}: NoteModalProps) => {

  if (!note || !isOpen) return null;


  // console.log(note)
  const [editedNote, setEditedNote] = useState<Note>(note);
  // console.log("edited note:", editedNote)
  const [loading, setLoading] = useState(false)
  const [summarizing, setSummarizing] = useState(false);

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

  async function summarizeText(id: string) {
    setSummarizing(true);
    try {
      await summarize(id);
    } finally {
      setSummarizing(false);
    }
  }
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
      {/* Dimmed Background */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* Sticky Header */}
          <div className="border-b px-6 py-4 bg-white sticky top-0 z-10 shadow-sm">
            <input
              type="text"
              name="heading"
              value={editedNote.heading}
              onChange={handleChange}
              placeholder="Note Title..."
              className="w-full text-3xl font-semibold tracking-tight text-gray-900 bg-transparent outline-none placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              Last edited:{" "}
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">

            {/* Note Text */}
            <div className="lg:col-span-2">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Note Body
              </label>
              <textarea
                name="noteBody"
                value={editedNote.noteBody}
                onChange={handleChange}
                placeholder="Write your note here..."
                className="w-full h-[300px] lg:h-[500px] p-4 bg-white rounded-lg border border-gray-300 text-gray-800 text-base resize-none focus:ring-2 focus:ring-gray-400 focus:outline-none leading-relaxed tracking-wide shadow-sm"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* AI Summary */}
              {editedNote.aiData?.summary && (
                <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    AI Summary
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {editedNote.aiData.summary}
                  </p>
                  {editedNote.aiData.tags && editedNote.aiData.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {editedNote.aiData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Transcription */}
              {editedNote.transcribedText && editedNote.transcribedText !== "null" && (
                <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Transcription</p>
                  <textarea
                    name="transcribedText"
                    value={editedNote.transcribedText}
                    onChange={handleChange}
                    placeholder="Write 'null' to delete..."
                    className="w-full h-32 p-3 border rounded-md text-sm text-gray-700 resize-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              )}

              {/* Audio */}
              {editedNote.audioFile && !deleteAudio && (
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Audio</p>
                  <audio controls className="w-full rounded">
                    <source src={editedNote.audioFile} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                  <Button onClick={markAudioForDeletion}>Delete Audio</Button>
                </div>
              )}

              {/* Images */}
              {editedNote.image?.filter(Boolean).length > 0 && (
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Images</p>
                  <div className="grid grid-cols-2 gap-4">
                    {editedNote.image.map(
                      (img, idx) =>
                        img && (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden group aspect-[4/3] border transition-all duration-300 ${imagesToDelete.includes(img)
                              ? "border-red-500 opacity-60"
                              : "border-gray-200 hover:shadow-lg"
                              }`}
                          >
                            <img
                              src={img}
                              alt={`Note image ${idx}`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            {imagesToDelete.includes(img) && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center text-white text-sm font-bold">
                                Marked
                              </div>
                            )}
                            <button
                              onClick={() => markImageForDeletion(img)}
                              title="Mark for deletion"
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
                            >
                              ✕
                            </button>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Upload */}
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700 border rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-gray-200 bg-white sticky bottom-0 shadow-sm z-10">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => summarizeText(editedNote?._id)}
              disabled={summarizing}
            >
              {summarizing ? "Summarizing..." : "Summarize"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </>


  );
};
