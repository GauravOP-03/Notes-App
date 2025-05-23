import axios from "axios";
import { useNotes } from "../../context/NotesContext";
import { Note } from "../../types/schema";
import { BACKEND_URL } from "@/config";

export const useSetNoteTags = () => {
  const { setNotes } = useNotes();

  const setNoteTags = async (noteId: string) => {
    try {
      // Get tags from API
      const response = await axios.get(`${BACKEND_URL}/notes/${noteId}/tags`, {
        withCredentials: true,
      });
      const tags = response.data;

      // Update notes state with new tags
      setNotes((prev: Note[]) =>
        prev.map((note) =>
          note._id === noteId
            ? {
                ...note,
                aiData: {
                  ...note.aiData,
                  tags: tags,
                },
              }
            : note
        )
      );

      return tags;
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  return setNoteTags;
};
