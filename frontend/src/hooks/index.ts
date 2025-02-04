import { BACKEND_URL } from "@/config";
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

export interface UserProp {
  _id: string;
  username: string;
  email: string;
}

export const useNotes = () => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<UserProp | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/notes`, {
          headers: { Authorization: token },
        });

        if (response.data?.data?.length > 0) {
          setNotes(response.data.data);
          setUser(response.data.data[0]?.owner || null);
        } else {
          setNotes([]);
          setUser(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const message = err.response?.data?.message || "Error fetching notes";
        console.error(message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return { loading, notes, user, error };
};
