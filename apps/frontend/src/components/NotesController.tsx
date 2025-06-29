import { memo, useCallback } from "react";
import { useNotes } from "@/context/NotesContext";
// import axios from "axios";
// import { BACKEND_URL } from "@/config";
import AllNotes from "./notes/AllNotes";
import AddNotes from "./notes/AddNotes/AddNotes";
import { Note } from "@/types/schema";
import { toast } from "sonner";
import { useSetNoteTags } from "./utils/useSetNoteTags";
import Footer from "./layout/Footer";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";

const NotesController = () => {
    const { setNotes } = useNotes();
    const setNoteTags = useSetNoteTags();
    // const { userFetchingError, loading } = useAuth();

    // const navigate = useNavigate()
    // useEffect(() => {
    //     if (error) {
    //         toast.error("Session expired. Please login again.", {
    //             description: "You will be redirected to the login page.",
    //         });

    //         navigate("/login");

    //     }
    // }, [error, navigate]);

    const showError = useCallback((message = "Something went wrong") => {
        toast.error(message, {
            description: "Please try again or check your internet connection.",
        });
    }, []);

    const onDelete = useCallback(async (id: string) => {
        try {
            await axiosInstance.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}/delete`);

            setNotes((prev) => prev.filter((note) => note._id !== id));
        } catch (error) {
            console.error("Failed to delete note:", error);
            showError("Failed to delete note.");
        }
    }, [setNotes, showError]);

    const onSave = useCallback(async (editedData: Note) => {
        const id = editedData._id;
        if (!id) return;

        try {
            const response = await axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`, editedData, {
                headers: { "Content-Type": "multipart/form-data" },
                // withCredentials: true,
            });

            const updatedNote = response.data.data;

            setNotes((prev) =>
                prev.map((note) => (note._id === id ? { ...note, ...updatedNote } : note))
            );

            setTimeout(() => setNoteTags(updatedNote._id), 10000);
        } catch (error) {
            console.error("Error saving the note:", error);
            showError("Failed to save the note.");
        }
    }, [setNotes, setNoteTags, showError]);

    const onShare = useCallback(async (noteId: string) => {
        try {
            const { data } = await axiosInstance.post(
                `${import.meta.env.VITE_BACKEND_URL}/notes/${noteId}/share`,
                { expireInHour: "24" },
                // { withCredentials: true }
            );

            setNotes((prev) =>
                prev.map((note) =>
                    note._id === noteId
                        ? {
                            ...note,
                            shareId: data.shareId,
                            visibility: data.visibility,
                            sharedUntil: data.sharedUntil,
                        }
                        : note
                )
            );

            toast.success("Share link generated!", {
                description: "Your note is now publicly accessible.",
            });
        } catch (error) {
            console.error("Share error:", error);
            showError("Failed to share the note.");
        }
    }, [setNotes, showError]);

    const onShareRemove = useCallback(async (noteId: string) => {
        try {
            const { data } = await axiosInstance.patch(
                `${import.meta.env.VITE_BACKEND_URL}/notes/${noteId}/share/remove`,
                {},
                // { withCredentials: true }
            );

            setNotes((prev) =>
                prev.map((note) =>
                    note._id === noteId
                        ? { ...note, visibility: data.visibility }
                        : note
                )
            );

            toast.success("Share link removed!", {
                description: "Your note is no longer publicly accessible.",
            });
        } catch (error) {
            console.error("Remove share error:", error);
            showError("Failed to remove share link.");
        }
    }, [setNotes, showError]);

    const summarize = useCallback(async (id: string) => {
        try {
            const { data } = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}/summarize`, {
                // withCredentials: true,
            });

            setNotes((prev) =>
                prev.map((note) =>
                    note._id === id
                        ? {
                            ...note,
                            aiData: {
                                ...note.aiData,
                                updatedAt: data.updatedAt,
                                createdAt: data.createdAt,
                                summary: data.summary,
                            },
                        }
                        : note
                )
            );
        } catch (error) {
            console.error("Summarization failed:", error);
            showError("Failed to summarize the note.");
        }
    }, [setNotes, showError]);

    const summarizeImage = useCallback(async (url: string, id: string) => {
        try {
            const { data } = await axiosInstance.post(
                `${import.meta.env.VITE_BACKEND_URL}/notes/${id}/imageSummarize`,
                { url }
            );
            // console.log(data.data)

            // Get the exact image that was summarized
            const images = data.data
            const matchedImage = images.find((img: Record<string, string>) => img.url === url);
            if (!matchedImage) {
                console.warn("Image summary not found in response");
                return;
            }

            setNotes((prev) =>
                prev.map((note) => {
                    if (note._id !== id) return note;

                    const existingImages = note.aiData?.images || [];

                    const filteredImages = existingImages.filter((img) => img.url !== url);

                    return {
                        ...note,
                        aiData: {
                            ...note.aiData,
                            summary: note.aiData?.summary ?? "",
                            tags: note.aiData?.tags ?? [],
                            createdAt: note.aiData?.createdAt ?? new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            images: [...filteredImages, matchedImage],
                        },
                    };
                })
            );
        } catch (e) {
            console.error("Error summarizing image:", e);
            showError("Failed to summarize the image.");
        }
    }, [setNotes, showError]);





    return (
        <>
            <main>
                <AddNotes />
                <AllNotes
                    onDelete={onDelete}
                    onSave={onSave}
                    onShare={onShare}
                    summarize={summarize}
                    onShareRemove={onShareRemove}
                    summarizeImage={summarizeImage}
                />
            </main>
            <Footer />
        </>
    );
};

export default memo(NotesController);
