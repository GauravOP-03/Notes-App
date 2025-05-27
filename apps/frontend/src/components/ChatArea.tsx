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
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        emitMessageUpdate(input.trim());
        setInput("");
    };

    return (
        <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col max-h-[30rem]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {messages.map((msg, idx) => {
                    const isSelf = msg.username === username;
                    return (
                        <div
                            key={idx}
                            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isSelf
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                <span className="block font-medium mb-0.5">
                                    {isSelf ? "You" : msg.username}
                                </span>
                                <span>{msg.message}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={sendMessage}
                className="mt-3 flex items-center gap-2 border-t pt-3"
            >
                <input
                    className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
