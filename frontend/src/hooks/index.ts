import axios from "axios";
import { useEffect, useState } from "react";

export interface Note {
  file?: File | null;
  _id: string;
  date: string;
  heading: string;
  noteBody: string;
  image: string[];
  transcribedText?: string;
  audioFile?: string;
}

export interface userProp {
  _id: string;
  username: string;
  email: string;
}
export const useNotes = () => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>();
  const [user, setUser] = useState<userProp>();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/notes", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((data) => {
        // console.log(data.data.data[0].owner);
        setNotes(data.data.data);
        setUser(data.data.data[0].owner);
        setLoading(false);
      });
  }, []);
  return {
    loading,
    notes,
    user,
  };
};
