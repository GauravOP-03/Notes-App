import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Clock, Volume2, Image as ImageIcon, FileText, LogIn } from "lucide-react";
import { Note } from "@/types/schema";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Navbar from "../layout/Navbar";

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
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
                    <div className="flex items-center justify-center min-h-[80vh]">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 mx-auto border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                            <p className="text-gray-600 font-medium text-lg">Loading your note...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!note) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
                    <div className="flex items-center justify-center min-h-[80vh]">
                        <div className="text-center space-y-6 max-w-md mx-auto px-6">
                            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                <FileText className="w-10 h-10 text-red-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">Note Not Found</h2>
                                <p className="text-gray-600">
                                    This note may have been removed, the link has expired, or you don't have permission to access it.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 pt-20">
                {/* Hero Section with Title */}
                <div className="bg-white border-b border-gray-200/60 shadow-sm">
                    <div className="max-w-5xl mx-auto px-6 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="space-y-3 flex-1">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {note.heading}
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        Updated {new Date(note.updatedAt).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                {!user && (
                                    <Button
                                        variant="outline"
                                        className="rounded-full px-6 py-2.5 text-sm border-gray-300 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200"
                                        onClick={() => navigate("/login")}
                                    >
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </Button>
                                )}
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 transform hover:scale-105"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    {saving ? "Saving..." : "Save to My Notes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Note Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Note Body */}
                            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/60 overflow-hidden">
                                <div className="p-8">
                                    <div className="prose prose-gray max-w-none">
                                        <div className="text-gray-800 text-[16px] leading-relaxed whitespace-pre-wrap font-medium">
                                            {note.noteBody}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transcribed Text */}
                            {note.transcribedText && note.transcribedText !== "null" && (
                                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/60 overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-4 border-b border-gray-200/60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">Transcribed Audio</h3>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                                            {note.transcribedText}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar with Media */}
                        <div className="space-y-6">
                            {/* Audio Section */}
                            {note.audioFile && (
                                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/60 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Volume2 className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">Audio Recording</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60">
                                            <audio controls className="w-full">
                                                <source src={note.audioFile} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Images Section */}
                            {note.image && note.image.filter(Boolean).length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/60 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">
                                                Images ({note.image.filter(Boolean).length})
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid gap-4">
                                            {note.image.map(
                                                (img, idx) =>
                                                    img && (
                                                        <a
                                                            key={idx}
                                                            href={img}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group block rounded-xl overflow-hidden border border-gray-200/60 aspect-[4/3] hover:shadow-xl hover:shadow-gray-300/30 transition-all duration-300 transform hover:scale-[1.02]"
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`Note image ${idx + 1}`}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </a>
                                                    )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}