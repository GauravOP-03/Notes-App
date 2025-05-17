import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Note } from "@/types/schema";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function SharedNotePage() {
    const { sharedId } = useParams();
    const { user } = useAuth();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchNote() {
            try {
                const res = await axios.get(`${BACKEND_URL}/notes/shared/${sharedId}`);
                setNote(res.data.sharedNotes);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    toast.error(err.response?.data?.message || "Failed to load note.");
                } else {
                    toast.error("Failed to load note.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchNote();
    }, [sharedId]);

    const handleSave = async () => {
        if (!user) return toast.error("Login to save note.");

        setSaving(true);
        try {
            await axios.post(
                `${BACKEND_URL}/notes`,
                {
                    heading: note?.heading,
                    noteBody: note?.noteBody,
                    audioFile: note?.audioFile || "",
                    image: note?.image || [],
                    transcribedText: note?.transcribedText || null,
                },
                { withCredentials: true }
            );
            toast.success("Note saved successfully.");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Could not save note.");
            } else {
                toast.error("Could not save note.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
                Loading note...
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-semibold">
                Note not found or link expired.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans px-4 sm:px-6 pb-20">
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
                <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[70%]">
                    {note.heading}
                </h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-full px-5 py-2 text-sm bg-black text-white hover:bg-gray-900 transition"
                    >
                        <Pencil className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save"}
                    </Button>
                    {!user && (
                        <Button
                            variant="outline"
                            className="rounded-full px-5 py-2 text-sm"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>
            {/* Content */}
            <main className="max-w-3xl mx-auto mt-10 space-y-10">
                <section className="space-y-2">
                    <p className="text-sm text-gray-500">
                        Updated:{" "}
                        {new Date(note.updatedAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-[15px] leading-relaxed whitespace-pre-wrap">
                        {note.noteBody}
                    </div>
                </section>

                {note.transcribedText && note.transcribedText !== "null" && (
                    <section className="border border-gray-200 bg-gray-50 p-6 rounded-xl">
                        <h2 className="text-sm font-medium text-gray-500 mb-2">Transcribed Text</h2>
                        <p className="whitespace-pre-wrap text-[15px] text-gray-800 leading-relaxed">
                            {note.transcribedText}
                        </p>
                    </section>
                )}

                {note.audioFile && (
                    <section className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Audio</p>
                        <div className="border rounded-lg overflow-hidden">
                            <audio controls className="w-full">
                                <source src={note.audioFile} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </section>
                )}

                {note.image && note.image.filter(Boolean).length > 0 && (
                    <section className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Images</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {note.image.map(
                                (img, idx) =>
                                    img && (
                                        <a
                                            key={idx}
                                            href={img}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg overflow-hidden border aspect-[4/3] hover:shadow-lg transition-transform hover:scale-[1.03]"
                                        >
                                            <img
                                                src={img}
                                                alt={`Note image ${idx}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    )
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
