/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef } from "react";
import { Pencil, X, Image, Mic, FileText, Sparkles, Trash2, ZoomIn } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "motion/react";

import { Note } from "@/types/schema";
import axios from "axios";
import { BACKEND_URL } from "@/config";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (updatedNote: Note) => Promise<void>; // Function to save changes
  summarize: (id: string) => Promise<void>;
}

export const NoteModal = ({
  isOpen,
  onClose,
  note,
  onSave,
  summarize
}: NoteModalProps) => {
  if (!note || !isOpen) return null;

  const [editedNote, setEditedNote] = useState<Note>(note);
  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState<string>("");
  const summaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animate summary word by word
  useEffect(() => {
    if (
      !summarizing &&
      editedNote.aiData?.summary &&
      editedNote.aiData.summary !== displayedSummary
    ) {
      if (summaryTimeoutRef.current) clearTimeout(summaryTimeoutRef.current);

      const words = editedNote.aiData.summary.split(" ");
      let idx = 0;
      setDisplayedSummary("");

      function showNextWord() {
        setDisplayedSummary((prev) =>
          prev ? prev + " " + words[idx] : words[idx]
        );
        idx++;
        if (idx < words.length) {
          summaryTimeoutRef.current = setTimeout(showNextWord, 40);
        }
      }
      showNextWord();

      return () => {
        if (summaryTimeoutRef.current) clearTimeout(summaryTimeoutRef.current);
      };
    }
  }, [editedNote.aiData?.summary, summarizing]);

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

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [deleteAudio, setDeleteAudio] = useState<boolean>(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const img of imagesToDelete) {
        await axios.delete(`${BACKEND_URL}/notes/${editedNote._id}/image`, {
          data: { img },
          withCredentials: true
        });
      }

      if (deleteAudio && note.audioFile) {
        await axios.delete(`${BACKEND_URL}/notes/${editedNote._id}/voice`, {
          data: { voice: note.audioFile },
          withCredentials: true
        });
      }

      await onSave(editedNote);
      console.log(editedNote);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setDeleteAudio(false);
      setImagesToDelete([]);
    }
  };

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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-4 md:inset-6 lg:inset-8 xl:inset-12 z-50 flex items-center justify-center"
          >
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">

              {/* Header */}
              <motion.div
                className="border-b border-gray-100 px-6 py-5 bg-gray-50/50 sticky top-0 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Edit Note</h2>
                      <p className="text-xs text-gray-500">
                        Last edited: {new Date(editedNote.updatedAt).toLocaleString("en-US", {
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
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
                <input
                  type="text"
                  name="heading"
                  value={editedNote.heading}
                  onChange={handleChange}
                  placeholder="Note Title..."
                  className="w-full text-2xl font-semibold text-gray-900 bg-transparent outline-none placeholder-gray-400 border-b border-transparent focus:border-violet-400 transition-colors duration-200 pb-2"
                />
              </motion.div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto bg-white">
                <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-full">

                  {/* Main Content - Note Text */}
                  <motion.div
                    className="xl:col-span-3 space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FileText className="w-4 h-4 mr-2 text-violet-600" />
                        Note Content
                      </label>
                      <textarea
                        name="noteBody"
                        value={editedNote.noteBody}
                        onChange={handleChange}
                        placeholder="Start writing your note here..."
                        className="w-full h-[500px] xl:h-[600px] p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 text-base resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:outline-none leading-relaxed tracking-wide transition-all duration-200"
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {editedNote.noteBody.length > 0 && `${editedNote.noteBody.split(' ').filter(word => word.length > 0).length} words`}
                      </div>
                    </div>
                  </motion.div>

                  {/* Sidebar */}
                  <motion.div
                    className="xl:col-span-1 space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >

                    {/* AI Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="flex items-center text-sm font-medium text-gray-700">
                          <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
                          AI Summary
                        </h3>
                        <Button
                          onClick={() => summarizeText(editedNote._id)}
                          disabled={summarizing}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-2"
                        >
                          {summarizing ? "..." : "Generate"}
                        </Button>
                      </div>

                      <AnimatePresence mode="wait">
                        {summarizing ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                          >
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"
                                style={{ width: `${80 + Math.random() * 20}%` }}
                              />
                            ))}
                          </motion.div>
                        ) : editedNote.aiData?.summary ? (
                          <motion.p
                            className="text-sm text-gray-700 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {displayedSummary}
                          </motion.p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No summary yet.</p>
                        )}
                      </AnimatePresence>

                      {/* Tags */}
                      <AnimatePresence>
                        {editedNote.aiData?.tags && editedNote.aiData.tags.length > 0 && (
                          <motion.div
                            className="mt-3 flex flex-wrap gap-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {editedNote.aiData.tags.map((tag, index) => (
                              <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-full"
                              >
                                #{tag}
                              </motion.span>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Transcription */}
                    <AnimatePresence>
                      {editedNote.transcribedText && editedNote.transcribedText !== "null" && (
                        <motion.div
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                            <Mic className="w-4 h-4 mr-2 text-violet-600" />
                            Transcription
                          </h3>
                          <textarea
                            name="transcribedText"
                            value={editedNote.transcribedText}
                            onChange={handleChange}
                            placeholder="Transcribed text..."
                            className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Audio */}
                    <AnimatePresence>
                      {editedNote.audioFile && !deleteAudio && (
                        <motion.div
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="flex items-center text-sm font-medium text-gray-700">
                              <Mic className="w-4 h-4 mr-2 text-violet-600" />
                              Audio
                            </h3>
                            <Button
                              onClick={markAudioForDeletion}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <audio controls className="w-full rounded-lg">
                            <source src={editedNote.audioFile} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Images */}
                    <AnimatePresence>
                      {editedNote.image?.filter(Boolean).length > 0 && (
                        <motion.div
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                            <Image className="w-4 h-4 mr-2 text-violet-600" />
                            Images ({editedNote.image?.filter(Boolean).length})
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {editedNote.image.map(
                              (img, idx) =>
                                img && (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative rounded-lg overflow-hidden group aspect-video border-2 transition-all duration-300 ${imagesToDelete.includes(img)
                                      ? "border-red-300 opacity-50"
                                      : "border-gray-200 hover:border-violet-300"
                                      }`}
                                  >
                                    <img
                                      src={img}
                                      alt={`Note image ${idx + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />

                                    {imagesToDelete.includes(img) && (
                                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                        <span className="text-red-700 text-xs font-medium bg-white px-2 py-1 rounded">
                                          Marked for deletion
                                        </span>
                                      </div>
                                    )}

                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(img, '_blank');
                                        }}
                                        className="w-7 h-7 bg-gray-900/80 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors duration-200"
                                        title="View full size"
                                      >
                                        <ZoomIn className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markImageForDeletion(img);
                                        }}
                                        className="w-7 h-7 bg-red-600/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                                        title="Mark for deletion"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </motion.div>
                                )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Upload Section */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                        <Image className="w-4 h-4 mr-2 text-violet-600" />
                        Add Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload-edit"
                        />
                        <label
                          htmlFor="image-upload-edit"
                          className="flex items-center justify-center h-16 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 group"
                        >
                          <div className="text-center">
                            <div className="w-6 h-6 text-gray-400 mx-auto mb-1 group-hover:text-violet-500 transition-colors duration-200">
                              <Image className="w-full h-full" />
                            </div>
                            <p className="text-xs text-gray-500 group-hover:text-violet-600 transition-colors duration-200">
                              Click to upload
                            </p>
                          </div>
                        </label>
                      </div>
                      {
                        editedNote.file && (
                          <img height={400} width={400} src={URL.createObjectURL(editedNote.file)} alt="Preview" className="mt-3 rounded-lg" />
                        )
                      }
                    </div>

                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <motion.div
                className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 h-10 border-gray-300 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 h-10 bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Pencil className="w-4 h-4" />
                      <span>Save Changes</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};