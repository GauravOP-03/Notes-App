import { Note } from "@/types/schema";
import AllNotes from "./AllNotes";
import axios from "axios";
import Error from "./Error";
import { BACKEND_URL } from "@/config";
import { useNotes } from "@/context/NotesContext";
export default function NotesMain() {
  const { loading, notes, error, setNotes } = useNotes();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500"></div>
        <p className="mt-2 text-sm">Loading...</p>
      </div>
    );
  }



  async function onDelete(id: string) {
    console.log(id);
    try {
      const token = localStorage.getItem("token");
      const data = await axios.delete(`${BACKEND_URL}/notes/${id}/delete`, {
        headers: {
          Authorization: token,
        },
      })
      console.log(data);
      // window.location.reload();
      const filteredNotes = notes.filter((note) => note._id !== id);
      // console.log(filteredNotes);
      setNotes(filteredNotes);
    } catch (e) {
      console.log(e)
    }
  }


  async function onSave(editedData: Note) {
    console.log("Edited data:", editedData);
    const id = editedData._id;

    if (!id) {
      console.error("Note ID is missing.");
      return;
    }

    const token = localStorage.getItem("token");
    try {


      const response = await axios.put(`${BACKEND_URL}/notes/${id}`, editedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      if (response.data) {
        console.log("Response data:", response.data.data);
        console.log("updated prev Notes", notes)
        const updatedNotes = notes.map((note) =>
          note._id === id ? { ...note, ...response.data.data } : note
        );

        console.log("Updated notes:", updatedNotes);
        setNotes(updatedNotes);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error saving the note:", error);
    }
  }


  if (error) {
    return <Error />;
  }

  if (!notes || !notes.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 p-6">
        <div className="text-2xl font-semibold">No Notes Available</div>
        <p className="mt-2 text-sm">Start adding notes to see them here.</p>
      </div>
    );
  }

  return (
    <div>
      <AllNotes onDelete={onDelete} onSave={onSave} />
      {/* <AddNotes /> */}
    </div>
  );
}
