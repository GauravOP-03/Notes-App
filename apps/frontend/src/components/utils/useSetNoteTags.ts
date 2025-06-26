// import axios from "axios";
import { useNotes } from "../../context/NotesContext";
import { Note } from "../../types/schema";
import axiosInstance from "@/lib/axiosInstance";
// import { BACKEND_URL } from "@/config";

export const useSetNoteTags = () => {
  const { setNotes } = useNotes();

  const setNoteTags = async (noteId: string) => {
    try {
      // Get tags from API
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/notes/${noteId}/tags`,
        {
          withCredentials: true,
        }
      );
      const tags = response.data;

      // Update notes state with new tags
      setNotes((prev: Note[]) =>
        prev.map((note) => {
          if (note._id !== noteId) return note;

          if (!note.aiData) return note; // or throw an error, depending on your logic

          return {
            ...note,
            aiData: {
              ...note.aiData,
              tags, // safely assign tags without touching createdAt/updatedAt
            },
          };
        })
      );

      return tags;
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  return setNoteTags;
};
