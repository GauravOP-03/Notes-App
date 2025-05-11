import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface CursorData {
    userId: string;
    position: number;
    username: string;
}

export function useCollaborativeSocket(roomId: string, userId: string, username: string) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [text, setText] = useState("");
    const [cursors, setCursors] = useState<Record<string, CursorData>>({});

    useEffect(() => {
        const socketInstance = io("http://localhost:3000");
        setSocket(socketInstance);
        socketInstance.emit("joinRoom", roomId);

        socketInstance.on("updateText", (payload: { text: string }) => {
            setText(payload.text);
        });

        socketInstance.on("cursorPosition", (cursor: CursorData) => {
            console.log(cursor)
            setCursors((prev) => ({ ...prev, [cursor.userId]: cursor }));
            // console.log(cursors)
        });

        return () => {
            socketInstance.off("updateText");
            socketInstance.off("cursorPosition");
            socketInstance.disconnect();
        };
    }, [roomId]);

    const emitTextUpdate = (text: string) => {
        socket?.emit("updateText", { text });
    };

    const emitCursorUpdate = (position: number) => {
        socket?.emit("updateCursor", { userId, position, username });
    };

    return { text, setText, cursors, emitTextUpdate, emitCursorUpdate };
}
