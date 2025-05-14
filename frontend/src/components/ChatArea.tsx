import { useEffect, useRef, useState } from "react";


interface ChatMsg {
    userId: string;
    username: string;
    message: string;
}
interface ChatAreaProps {
    username: string;
    messages: ChatMsg[];
    emitMessageUpdate: (message: string) => void;
}

export function ChatArea({ username, emitMessageUpdate, messages }: ChatAreaProps) {
    //   const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        emitMessageUpdate(input);
        setInput("");
    };

    return (
        <div className="bg-muted rounded-lg p-3 max-h-48 overflow-y-auto mb-2 border">
            <div className="space-y-1">
                {messages.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                        <span className="font-semibold">{msg.username === username ? "You" : msg.username}:</span>{" "}
                        <span>{msg.message}</span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-2">
                <input
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                    Send
                </button>
            </form>
        </div>
    );
}