import { Note, useNotes } from "@/hooks";
import AllNotes from "./AllNotes";
import axios from "axios";
import Error from "./Error";
import { BACKEND_URL } from "@/config";

export default function NotesMain() {
  const { loading, notes, error } = useNotes();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500"></div>
        <p className="mt-2 text-sm">Loading...</p>
      </div>
    );
  }

  function onDelete(id: string) {
    console.log(id);
    axios
      .delete(`${BACKEND_URL}/notes/${id}/delete`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  }

  function onSave(editedData: Note) {
    // console.log(editedData);
    const id = editedData._id;
    axios
      .put(`${BACKEND_URL}/notes/${id}`, editedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((e) => console.log(e));
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
      <AllNotes notes={notes} onDelete={onDelete} onSave={onSave} />
      {/* <AddNotes /> */}
    </div>
  );
}
