import { Mic } from "lucide-react";
import { memo } from "react";
// import { Note } from "@/types/schema";

interface TranscriptionBoxProps {
  transcribedText: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TranscriptionBox = memo(({ transcribedText, onChange }: TranscriptionBoxProps) => {
  if (!transcribedText || transcribedText === "null") return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
        <Mic className="w-4 h-4 mr-2 text-violet-600" />
        Transcription
      </h3>
      <textarea
        name="transcribedText"
        value={transcribedText}
        onChange={onChange}
        placeholder="Transcribed text..."
        className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200"
      />
    </div>
  );
});
