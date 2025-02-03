import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";

const AddNotes = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [voiceData, setVoiceData] = useState({
    transcribedText: "",
    audioFile: null as File | null,
  });

  const handleVoiceChange = (data: {
    transcribedText: string;
    audioFile: File | null;
  }) => {
    setVoiceData({
      transcribedText: data.transcribedText,
      audioFile: data.audioFile,
    });
  };

  const [formData, setFormData] = useState({
    heading: "",
    noteBody: "",
    image: null as File | null, // File input
  });

  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // Handle input change for text fields
  // Handle input change for text fields
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    setIsPending(true);

    console.log(voiceData);
    const handleData = async () => {
      const data = new FormData();
      data.append("heading", formData.heading);
      data.append("noteBody", formData.noteBody);
      if (formData.image) {
        data.append("image", formData.image);
      }
      if (voiceData.transcribedText.length) {
        data.append("voiceData", voiceData.transcribedText);
      }
      if (voiceData.audioFile) {
        data.append("audioFile", voiceData.audioFile);
      }

      axios
        .post("http://localhost:3000/api/notes", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((data) => {
          console.log("Success:", data);
          setIsOpen(false); // Close modal on success
          setFormData({ heading: "", noteBody: "", image: null }); // Reset form
          setVoiceData({ transcribedText: "", audioFile: null });
          setIsPending(false);
          window.location.reload();
        })
        .catch((error) => {
          setIsPending(false);
          console.error("Error:", error);
          setError(error.message || "Failed to submit note.");
        });
    };
    handleData();
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="px-4 py-2">
        Add Notes
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-white">
            <CardHeader className="relative">
              <CardTitle>Add Notes</CardTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Note Heading */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Note Heading
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter notes heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Note Body */}
                <div>
                  <label className="block text-sm font-medium mb-1">Note</label>
                  <Textarea
                    placeholder="Type note.."
                    name="noteBody"
                    value={formData.noteBody}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload Image
                  </label>
                  <Input type="file" name="image" onChange={handleFileChange} />
                  {formData.image && (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Voice
                  </label>
                  <VoiceRecorder onDataChange={handleVoiceChange} />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>

              {/* Error Message */}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AddNotes;
