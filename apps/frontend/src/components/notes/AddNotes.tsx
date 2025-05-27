import { Plus, X, FileText, Image, Mic, Upload, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";
import { BACKEND_URL } from "@/config";
import { useNotes } from "@/context/NotesContext";
import { useSetNoteTags } from "../utils/useSetNoteTags";

const AddNotes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setNotes } = useNotes();
  const setNoteTags = useSetNoteTags();
  const [voiceData, setVoiceData] = useState({
    transcribedText: "",
    audioFile: null as File | null,
  });
  const [formData, setFormData] = useState({
    heading: "",
    noteBody: "",
    image: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleVoiceChange = (data: { transcribedText: string; audioFile: File | null }) => {
    setVoiceData(data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const data = new FormData();
      data.append("heading", formData.heading);
      data.append("noteBody", formData.noteBody);
      if (formData.image) data.append("image", formData.image);
      if (voiceData.transcribedText.length) data.append("transcribedText", voiceData.transcribedText);
      if (voiceData.audioFile) data.append("audioFile", voiceData.audioFile);

      const res = await axios.post(`${BACKEND_URL}/notes`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setNotes((prevNotes) => [...prevNotes, res.data.data]);
      setFormData({ heading: "", noteBody: "", image: null });
      setVoiceData({ transcribedText: "", audioFile: null });
      setError(null);
      setIsOpen(false);
      setIsPending(false);

      setTimeout(() => {
        setNoteTags(res.data.data._id);
      }, 4000);
    } catch (error) {
      setIsPending(false);
      setError(error.message || "Failed to submit note.");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 p-0 rounded-full shadow-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-7 h-7 text-white" />
          </motion.div>
          <div className="absolute inset-0 rounded-full bg-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-20 z-50 flex items-center justify-center"
          >
            <Card className="w-full h-full bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">Create New Note</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5">Capture your thoughts and ideas</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="overflow-y-auto p-6 flex-1">
                <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Note Heading */}
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FileText className="w-4 h-4 mr-2 text-violet-600" />
                          Note Title
                        </label>
                        <Input
                          type="text"
                          placeholder="Give your note a memorable title..."
                          name="heading"
                          value={formData.heading}
                          onChange={handleInputChange}
                          required
                          className="h-12 px-4 bg-white border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 focus:ring-2 transition-all duration-200 rounded-lg"
                        />
                      </motion.div>

                      {/* Image Upload */}
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Image className="w-4 h-4 mr-2 text-violet-600" />
                          Add Image
                        </label>
                        <div className="relative">
                          <Input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-gray-100 transition-all duration-200 group"
                          >
                            <div className="text-center">
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-violet-500 transition-colors duration-200" />
                              <p className="text-sm text-gray-500 group-hover:text-violet-600 transition-colors duration-200">
                                Click to upload image
                              </p>
                            </div>
                          </label>
                        </div>
                        <AnimatePresence>
                          {formData.image && (
                            <motion.div
                              className="relative group"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                            >
                              <img
                                src={URL.createObjectURL(formData.image)}
                                alt="Preview"
                                className="w-full max-h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                              />
                              <Button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: null })}
                                className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                <X className="w-4 h-4 text-white" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Voice Recorder */}
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Mic className="w-4 h-4 mr-2 text-violet-600" />
                          Voice Recording
                        </label>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <VoiceRecorder onDataChange={handleVoiceChange} />
                          <AnimatePresence>
                            {voiceData.transcribedText && (
                              <motion.div
                                className="mt-3 p-3 bg-white rounded-lg border border-gray-200"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <p className="text-sm text-gray-600 mb-1">Transcribed text:</p>
                                <p className="text-sm text-gray-800">{voiceData.transcribedText}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Column - Note Content */}
                    <motion.div
                      className="space-y-2 lg:row-span-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FileText className="w-4 h-4 mr-2 text-violet-600" />
                        Note Content
                      </label>
                      <Textarea
                        placeholder="Start writing your note here... You can write as much as you need - the space will adjust to your content."
                        name="noteBody"
                        value={formData.noteBody}
                        onChange={handleInputChange}
                        required
                        className="min-h-[400px] lg:min-h-[500px] p-4 bg-white border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 focus:ring-2 transition-all duration-200 rounded-lg resize-none"
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {formData.noteBody.length > 0 && `${formData.noteBody.split(' ').filter(word => word.length > 0).length} words`}
                      </div>
                    </motion.div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="p-3 bg-red-50 border border-red-200 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <p className="text-red-600 text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex justify-end space-x-3 pt-6 border-t border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-6 h-11 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="px-6 h-11 rounded-lg bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Edit3 className="w-4 h-4" />
                          <span>Create Note</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddNotes;