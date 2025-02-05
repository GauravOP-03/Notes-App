import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Share } from "lucide-react";

export default function RealTimeTextUI() {
  const [text, setText] = useState("");
  const [receivedText, setReceivedText] = useState("");

  const { id } = useParams();

  const [socket, setSocket] = useState<Socket | null>(null); // Track the socket instance

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    // Listen for incoming words
    socketInstance.emit("joinRoom", id);

    socketInstance.on("receiveWord", (word) => {
      setReceivedText(word);
    });

    return () => {
      socketInstance.disconnect(); // Cleanup on unmount
    };
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (socket) {
      socket.emit("sendWord", newText);
    }
  };

  const handleCopyLink = async () => {
    try {
      // Copy the current URL to the clipboard
      await navigator.clipboard.writeText(window.location.href);
      // Optionally, provide user feedback
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy the link: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Real-time Word Sharing</h2>
          <Textarea
            placeholder="Type something..."
            value={text}
            onChange={handleChange}
            className="w-full h-40"
          />
          <div className="p-2 bg-gray-200 rounded-lg min-h-[100px]">
            {receivedText || "Shared words will appear here..."}
          </div>
        </CardContent>

        <Button
          onClick={handleCopyLink}
          className="text-sm font-medium  shadow-2xl bg-white/95 backdrop-blur-lg 
      hover:scale-110 hover:text-white/95 transition-all border border-gray-400 text-gray-900"
        >
          <Share size={24} />
          <span>Share</span>
        </Button>
      </Card>
    </div>
  );
}
