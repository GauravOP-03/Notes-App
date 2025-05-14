import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface CursorData {
    userId: string;
    position: number;
    username: string;
}

interface ChatMsg {
    userId: string;
    username: string;
    message: string;
}

export function useCollaborativeSocket(roomId: string, userId: string, username: string) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [text, setText] = useState("");
    const [cursors, setCursors] = useState<Record<string, CursorData>>({});
    const [allUser, setAllUser] = useState<{ uid: string; username: string }[]>([]);
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [typingUsers, setTypingUsers] = useState<{ uid: string, username: string }[]>([])
    const [host, setHost] = useState<string | null>(null);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:3000");
        setSocket(socketInstance);
        socketInstance.emit("joinRoom", { roomId, uid: userId, username });
        socketInstance.on("userJoined", (userData) => {
            // console.log("userdata", userData)
            setAllUser((prev) => {
                return [...prev, userData];
            });
            // setAllUser((prev) => { return [...prev, userData] });
            // console.log(allUser);
        })

        socketInstance.on("userLeft", ({ uid }) => {
            setAllUser((prev) => prev.filter(user => user.uid !== uid));
        });

        socketInstance.on("updateText", (payload: { text: string }) => {
            setText(payload.text);
        });

        socketInstance.on("cursorPosition", (cursor: CursorData) => {
            console.log(cursor)
            setCursors((prev) => ({ ...prev, [cursor.userId]: cursor }));
            // console.log(cursors)
        });

        socketInstance.on("chatMessage", (msg: ChatMsg) => {
            // console.log(msg);
            setMessages((prev) => [...prev, msg]);

        });

        socketInstance.on("show_typing", ({ uid, username }) => {
            // console.log(uid)
            setTypingUsers((prev) => {
                if (prev.some(user => user.uid == uid)) return prev;
                return [...prev, { uid, username }]
            })
            // console.log(uid);
            // console.log(typingUsers)
        })

        socketInstance.on("hide_typing", (uid) => {
            setTypingUsers((prev) => prev.filter(obj => obj.uid == uid))
            // console.log(uid);
            // console.log(typingUsers)
        })

        socketInstance.on("hostInfo", (hostUid) => {
            console.log(hostUid)
            setHost(hostUid.hostUid);
        })

        socketInstance.on("locked", () => {
            // console.log("locked", locked)
            setLocked(true);
        })

        socketInstance.on("unlock", () => {
            // console.log("unlocked", locked);
            setLocked(false);
        })

        socketInstance.on("error", ({ message }) => {
            setError(message)
        })


        return () => {
            socketInstance.off("userLeft");
            socketInstance.off("updateText");
            socketInstance.off("cursorPosition");
            socketInstance.off("chatMessage");
            socketInstance.off("show_typing");
            socketInstance.off("hide_typing");
            socketInstance.disconnect();
        };
    }, [roomId, userId, username]);

    const emitTextUpdate = (text: string) => {
        socket?.emit("updateText", { text });
    };

    const emitCursorUpdate = (position: number) => {
        socket?.emit("updateCursor", { userId, position, username });
    };

    const emitMessageUpdate = (message: string) => {
        socket?.emit("chatMessage", {
            userId,
            username,
            message: message
        });
    };

    const typingStatus = () => {
        if (!isTyping) {
            socket?.emit("typing", { uid: userId, username })
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket?.emit("stop_typing", { uid: userId })
        }, 1000)
    }


    const lockNotes = () => {
        console.log("locknotes", locked)
        if (!locked) {
            socket?.emit("locked", { uid: userId });
        } else {
            socket?.emit("unlock", { uid: userId, });
        }
    }


    return { text, setText, cursors, emitTextUpdate, emitCursorUpdate, allUser, messages, emitMessageUpdate, typingStatus, typingUsers, host, lockNotes, locked, error };
}
