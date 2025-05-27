import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Share2, Loader2, Lock, Unlock } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useCollaborativeSocket } from "@/hooks/useCollaborativeSocket";
import { CursorOverlay } from "@/components/CursorOverlay";
import { BACKEND_URL } from "@/config";
import { useNotes } from "@/context/NotesContext";
import { ChatArea } from "@/components/ChatArea";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";

export default function RealTimeTextEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const { setNotes } = useNotes();
  const userId = user?._id || "";
  const username = user?.username || "Anonymous";

  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    text,
    setText,
    cursors,
    emitTextUpdate,
    emitCursorUpdate,
    allUser,
    emitMessageUpdate,
    messages,
    typingStatus,
    typingUsers,
    lockNotes,
    locked,
    host,
    error,
  } = useCollaborativeSocket(id || "", userId, username);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    typingStatus();
    emitTextUpdate(newText);
    emitCursorUpdate(e.target.selectionStart);
  };

  const handleCursorMove = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    emitCursorUpdate(e.target.selectionStart);
  };

  const handleSaveNote = async () => {
    if (!text.trim() || !title.trim()) {
      toast.error("Please provide a title and some content.");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/notes`,
        {
          heading: title,
          noteBody: text,
          image: [],
          audioFile: null,
        },
        { withCredentials: true }
      );
      setNotes((prevNotes) => [...prevNotes, res.data.data]);
      toast.success("Note saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.error("Copy failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-7xl rounded-3xl shadow-lg border bg-white flex flex-col md:flex-row overflow-hidden">
          {/* Left side: Editor */}
          <div className="flex flex-col flex-1 p-6 md:p-8 gap-4 h-[80vh] md:h-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                Collaborative Note Editing
              </h2>
              <Input
                placeholder="Title your shared note..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg rounded-xl"
                disabled={saving}
              />
            </div>

            <div className="relative flex-1 rounded-xl border shadow-sm overflow-hidden">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onSelect={handleCursorMove}
                placeholder="Type collaboratively with others..."
                className="w-full h-full p-4 resize-none text-base bg-white"
                disabled={(host !== userId && locked) || saving}
                rows={10}
              />
              <CursorOverlay
                cursors={cursors}
                textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                currentUserId={userId}
              />
            </div>

            {error && (
              <div className="text-sm px-3 py-2 rounded bg-red-100 text-red-700">
                {error}
              </div>
            )}

            {/* Toolbar with buttons and user badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border rounded-xl px-5 py-3 shadow-sm">
              {/* User badges */}
              <div className="flex flex-wrap gap-2 text-sm text-blue-800">
                {allUser.map(({ uid, username }) => (
                  <span
                    key={uid}
                    className="px-3 py-1 bg-blue-100 rounded-full font-medium select-none"
                  >
                    {uid === userId ? "You" : username}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
                  onClick={handleCopyLink}
                  disabled={saving}
                >
                  <Share2 className="w-5 h-5" /> Share
                </Button>

                <Button
                  className="rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
                  onClick={handleSaveNote}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "Saving..." : "Save Note"}
                </Button>

                {host === userId && (
                  <Button
                    variant={locked ? "default" : "destructive"}
                    className="rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
                    onClick={lockNotes}
                  >
                    {locked ? (
                      <Unlock className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    {locked ? "Unlock" : "Lock"}
                  </Button>
                )}
              </div>
            </div>

            {/* Typing users indicator */}
            {typingUsers.length > 0 && (
              <div className="text-sm italic text-gray-500 mt-2">
                {typingUsers.map(({ uid, username }) => (
                  <p key={uid + username}>{username} is typing...</p>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Chat */}
          <div className="w-full md:w-96 border-l border-gray-200 p-6 overflow-y-auto h-[80vh] flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Chat</h3>
            <ChatArea
              username={username}
              emitMessageUpdate={emitMessageUpdate}
              messages={messages}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
