import { useEffect, useState } from "react";
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

    useEffect(() => {
        const socketInstance = io("http://localhost:3000");
        setSocket(socketInstance);
        socketInstance.emit("joinRoom", { roomId, uid: userId, username });
        socketInstance.on("userJoined", (userData) => {
            setAllUser((prev) => [...prev, userData]);
            console.log(userData);
        })

        socketInstance.on("updateText", (payload: { text: string }) => {
            setText(payload.text);
        });

        socketInstance.on("cursorPosition", (cursor: CursorData) => {
            console.log(cursor)
            setCursors((prev) => ({ ...prev, [cursor.userId]: cursor }));
            // console.log(cursors)
        });

        socketInstance.on("chatMessage", (msg: ChatMsg) => {
            console.log(msg);
            setMessages((prev) => [...prev, msg]);

        });

        return () => {
            socketInstance.off("updateText");
            socketInstance.off("cursorPosition");
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


    return { text, setText, cursors, emitTextUpdate, emitCursorUpdate, allUser, messages, emitMessageUpdate };
}
