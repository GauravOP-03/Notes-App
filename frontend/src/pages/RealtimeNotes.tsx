import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Share2, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useCollaborativeSocket } from "@/hooks/useCollaborativeSocket";
import { CursorOverlay } from "@/components/CursorOverlay";
import { BACKEND_URL } from "@/config";
import { useNotes } from "@/context/NotesContext";

export default function RealTimeTextEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const { setNotes } = useNotes();
  const userId = user?._id || "";
  const username = user?.username || "Anonymous";

  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    text,
    setText,
    cursors,
    emitTextUpdate,
    emitCursorUpdate,
  } = useCollaborativeSocket(id || "", userId, username);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    emitTextUpdate(newText);
    emitCursorUpdate(e.target.selectionStart);
  };

  const handleCursorMove = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    emitCursorUpdate(e.target.selectionStart);
  };

  const handleSaveNote = async () => {
    if (!text.trim() || !title.trim()) {
      setMessage({ type: "error", text: "Please provide a title and some content." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/notes`, {
        heading: title,
        noteBody: text,
        image: [],
        audioFile: null,
      }, { withCredentials: true });
      setNotes((prevNotes) => [...prevNotes, res.data.data]);
      setMessage({ type: "success", text: "Note saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save note" });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage({ type: "success", text: "Share link copied to clipboard!" });
    } catch (error) {
      setMessage({ type: "error", text: "Copy failed" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-muted">
      <Card className="w-full max-w-3xl shadow-xl border rounded-2xl">
        <CardContent className="p-6 space-y-5 relative">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Collaborative Note Editing
            </h2>
            <Input
              placeholder="Title your shared note..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
              disabled={saving}
            />
          </div>

          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onSelect={handleCursorMove}
              placeholder="Type collaboratively with others..."
              className="h-64 text-base"
              disabled={saving}
            />
            <CursorOverlay
              cursors={cursors}
              textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
              currentUserId={userId}
            />
          </div>

          {message && (
            <div
              className={`text-sm px-3 py-2 rounded ${message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleCopyLink}
              disabled={saving}
            >
              <Share2 size={18} />
              Share
            </Button>
            <Button className="gap-2" onClick={handleSaveNote} disabled={saving}>
              {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}