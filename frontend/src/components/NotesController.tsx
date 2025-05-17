import { useNotes } from "@/context/NotesContext";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import AllNotes from "./notes/AllNotes";
import AddNotes from "./notes/AddNotes";
import { Note } from "@/types/schema";

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

            console.log(notes);
        } catch (e) {
            console.error(e);
        }
    }

    // if (loading) return <NotesLoader />;
    // if (error) return <Error />;
    // if (!notes || notes.length === 0) return (<> <AddNotes /> <NotesEmpty /> </>);

    return (
        <>
            <AddNotes />
            <AllNotes onDelete={onDelete} onSave={onSave} onShare={onShare} />
        </>
    );
};

export default NotesController;
