import { useNotes } from "@/context/NotesContext";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import AllNotes from "./notes/AllNotes";
import AddNotes from "./notes/AddNotes";
import { Note } from "@/types/schema";
import { toast } from 'sonner';
import { useSetNoteTags } from "./utils/useSetNoteTags";
import Footer from "./layout/Footer";
const NotesController = () => {
    const { loading, notes, error, setNotes } = useNotes();

    async function onDelete(id: string) {
        try {
            await axios.delete(`${BACKEND_URL}/notes/${id}/delete`, {
                withCredentials: true,
            });
            const filteredNotes = notes.filter((note) => note._id !== id);
            setNotes(filteredNotes);
        } catch (e) {
            console.error("Failed to delete note:", e);
        }
    }

    const setNoteTags = useSetNoteTags();
    async function onSave(editedData: Note) {
        const id = editedData._id;
        if (!id) return;

        try {
            const response = await axios.put(`${BACKEND_URL}/notes/${id}`, editedData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            const updatedNotes = notes.map((note) =>
                note._id === id ? { ...note, ...response.data.data } : note
            );
            setNotes(updatedNotes);

            setTimeout(() => {
                setNoteTags(response.data.data._id);
            }, 10000);
        } catch (error) {
            console.error("Error saving the note:", error);
        }
    }

    async function onShare(noteId: string) {
        try {
            const response = await axios.post(`${BACKEND_URL}/notes/${noteId}/share`, { expireInHour: "24" }, {
                withCredentials: true,
            });
            console.log(response.data)
            setNotes((prev) => {
                const updatedNotes = prev.map((note) => {
                    if (note._id === noteId) {
                        return { ...note, shareId: response.data.shareId, visibility: response.data.visibility, sharedUntil: response.data.sharedUntil };
                    }
                    return note;
                })
                return updatedNotes;
            })
            toast.success("Share link generated!", {
                description: "Your note is now publicly accessible.",
            });

            console.log(notes);
        } catch (e) {
            toast.error("Something went wrong", {
                description: "Please try again or check your internet connection.",
            });
            console.error(e);
        }
    }

    async function summarize(id: string) {
        const response = await axios.get(`${BACKEND_URL}/notes/${id}/summarize`, { withCredentials: true });
        const { updatedAt, createdAt, summary } = response.data;
        setNotes((prev) => {
            const updatedNotes = prev.map((note) => {
                if (note._id === id) {
                    return { ...note, aiData: { ...note.aiData, updatedAt: updatedAt, createdAt: createdAt, summary: summary } };
                }
                return note;
            });
            return updatedNotes;
        });
        console.log(response.data.summary);
    }

    // if (loading) return <NotesLoader />;
    // if (error) return <Error />;
    // if (!notes || notes.length === 0) return (<> <AddNotes /> <NotesEmpty /> </>);
    async function onShareRemove(noteId: string) {
        try {
            const response = await axios.patch(`${BACKEND_URL}/notes/${noteId}/share/remove`, {}, {
                withCredentials: true,
            });
            console.log(response.data)
            setNotes((prev) => {
                const updatedNotes = prev.map((note) => {
                    if (note._id === noteId) {
                        return { ...note, visibility: response.data.visibility };
                    }
                    return note;
                })
                return updatedNotes;
            })
            toast.success("Share link removed!", {
                description: "Your note is no longer publicly accessible.",
            });

            console.log(notes);
        } catch (e) {
            toast.error("Something went wrong", {
                description: "Please try again or check your internet connection.",
            });
            console.error(e);
        }
    }

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
                />
            </main>
            <Footer />
        </>


    );
};

export default NotesController;
