import { memo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useCollaborativeSocket } from "@/hooks/useCollaborativeSocket";
// import { BACKEND_URL } from "@/config";
import { useNotes } from "@/context/NotesContext";
import ChatArea from "@/components/ChatArea";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";
import Editor from "./Editor";
import Toolbar from "./Toolbar";
// import Heading from "./Heading";

function RealTimeTextEditor() {
    const { id } = useParams();
    const { user } = useAuth();
    const { setNotes } = useNotes();
    const userId = user?._id || "";
    const username = user?.username || "Anonymous";

    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);

    const {
        text,
        setText,
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
        cursors
    } = useCollaborativeSocket(id || "", userId, username);


    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        typingStatus();
        emitTextUpdate(newText);
        emitCursorUpdate(e.target.selectionStart);
    }, [emitCursorUpdate, emitTextUpdate, setText, typingStatus]);

    const handleCursorMove = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        emitCursorUpdate(e.target.selectionStart);
    }, [emitCursorUpdate]);

    const handleSaveNote = useCallback(async () => {
        if (!text.trim() || !title.trim()) {
            toast.error("Please provide a title and some content.");
            return;
        }
        setSaving(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/notes`,
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
    }, []);

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Share link copied to clipboard!");
        } catch (error) {
            console.error(error);
            toast.error("Copy failed");
        }
    }, []);

    const handleTitle = useCallback((value: string) => {
        setTitle(value);
        // Update the title in the collaborative context
    }, [])

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-muted px-4 py-8 flex flex-col items-center">
                <Card className="w-full max-w-7xl rounded-3xl shadow-lg border bg-white flex flex-col md:flex-row overflow-hidden">
                    <div className="flex flex-col flex-1 p-6 md:p-8 gap-4 h-[80vh] md:h-auto">
                        {/* <div className="flex flex-col flex-1 gap-4"> */}
                        {/* <Heading title={title} saving={saving} onChange={setTitle} /> */}
                        <Editor
                            title={title}
                            text={text}
                            saving={saving}
                            locked={locked}
                            userId={userId}
                            host={host}
                            onTitleChange={handleTitle}
                            onTextChange={handleTextChange}
                            onCursorMove={handleCursorMove}
                            cursors={cursors} />
                        {/* </div> */}
                        {error && (
                            <div className="text-sm px-3 py-2 rounded bg-red-100 text-red-700">
                                {error}
                            </div>
                        )}

                        <Toolbar
                            saving={saving}
                            locked={locked}
                            host={host}
                            userId={userId}
                            allUser={allUser}
                            onSave={handleSaveNote}
                            onShare={handleCopyLink}
                            onLock={lockNotes}
                        />

                        {typingUsers.length > 0 && (
                            <div className="text-sm italic text-gray-500 mt-2">
                                {typingUsers.map(({ uid, username }) => (
                                    <p key={uid + username}>{username} is typing...</p>
                                ))}
                            </div>
                        )}
                    </div>

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

export default memo(RealTimeTextEditor);