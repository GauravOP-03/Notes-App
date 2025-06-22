import { useEffect, useState, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";

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
        // socketInstance.on("userJoined", (userData) => {
        //     setAllUser((prev) => {
        //         // Only add if user is not already present
        //         if (prev.some(user => user.uid === userData.uid)) return prev;
        //         return [...prev, userData];
        //     });
        //     console.log(allUser)
        // })

        socketInstance.on("userList", (users) => {
            setAllUser(users);
            console.log(users)
        });

        // socketInstance.on("userList", (users) => {
        //     setAllUser((prev) => {
        //         const same =
        //             users.length === prev.length &&
        //             users.every((u: { uid: string; username: string; }, i: number) => u.uid === prev[i]?.uid && u.username === prev[i]?.username);

        //         return same ? prev : users;
        //     });
        // });
        socketInstance.on("userLeft", ({ uid }) => {
            setAllUser((prev) => prev.filter(user => user.uid !== uid));
        });

        socketInstance.on("updateText", (payload: { text: string, userId: string }) => {
            if (payload.userId !== userId) {
                setText(payload.text);
            }
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
            toast.info("Notes have been locked by the host.");

            setLocked(true);
        })

        socketInstance.on("unlock", () => {
            // console.log("unlocked", locked);
            toast.info("Notes have been unlocked by the host.");
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

    const emitTextUpdate = useCallback((text: string) => {
        socket?.emit("updateText", { text });
    }, [socket]);

    const emitCursorUpdate = useCallback((position: number) => {
        socket?.emit("updateCursor", { userId, position, username });
    }, [socket, userId, username]);

    const emitMessageUpdate = useCallback((message: string) => {
        socket?.emit("chatMessage", {
            userId,
            username,
            message: message
        });
    }, [socket, userId, username]);

    const typingStatus = useCallback(() => {
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
    }, [isTyping, socket, userId, username])


    const lockNotes = useCallback(() => {
        console.log("locknotes", locked)
        if (!locked) {
            socket?.emit("locked", { uid: userId });
        } else {
            socket?.emit("unlock", { uid: userId, });
        }
    }, [locked, socket, userId])


    return { text, setText, cursors, emitTextUpdate, emitCursorUpdate, allUser, messages, emitMessageUpdate, typingStatus, typingUsers, host, lockNotes, locked, error };
}