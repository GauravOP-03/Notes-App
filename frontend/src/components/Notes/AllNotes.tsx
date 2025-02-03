import { Note, useNotes } from "@/hooks";
import NotesCards from "./NotesCards";
import axios from "axios";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";

export default function AllNotes() {
  const navigate = useNavigate();
  const { loading, notes, user } = useNotes();
  if (loading) {
    return <div>loading..</div>;
  }

  function onDelete(id: string) {
    console.log(id);
    axios
      .delete(`http://localhost:3000/api/notes/${id}/delete`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((data) => {
        console.log(data);
      });

    window.location.reload();
  }

  function onSave(editedData: Note) {
    console.log(editedData);
    const id = editedData._id;
    axios
      .put(`http://localhost:3000/api/notes/${id}`, editedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((data) => {
        console.log(data);
      });

    window.location.reload();
  }

  if (!notes || !notes.length) {
    return <div>No notes yet...</div>;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <div>
      <NotesCards notes={notes} onDelete={onDelete} onSave={onSave} />

      <SideBar user={user} onLogout={logout} />
    </div>
  );
}
