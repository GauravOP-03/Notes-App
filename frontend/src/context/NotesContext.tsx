import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { Note } from "@/types/schema";
import { UserProp } from "@/types/schema";
import { useAuth } from "./AuthContext";


interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: boolean;
  user: UserProp | null;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // setLoading(false);
      setNotes([]);
      return;
    }
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/notes`, { withCredentials: true });
        // console.log(response)
        if (response.data?.data?.length > 0) {
          setNotes(response.data.data);
          console.log(notes);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  return (
    <NotesContext.Provider value={{ notes, loading, error, user, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
