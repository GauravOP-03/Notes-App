// components/AddNotes/NoteVoiceRecorder.tsx
import { Mic } from "lucide-react";
import VoiceRecorder from "../VoiceRecorder";
import { memo } from "react";

interface NoteVoiceRecorderProp {
    voiceData: { transcribedText: string; audioFile: File | null };
    handleVoiceChange: (data: { transcribedText: string, audioFile: File | null }) => void;
}
const NoteVoiceRecorder = ({
    voiceData,
    handleVoiceChange
}: NoteVoiceRecorderProp) => {
    return (
        <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <Mic className="w-4 h-4 mr-2 text-violet-600" />
                Voice Recording
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border">
                <VoiceRecorder onDataChange={handleVoiceChange} />
                {voiceData.transcribedText && (
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600 mb-1">Transcribed text:</p>
                        <p className="text-sm text-gray-800">{voiceData.transcribedText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(NoteVoiceRecorder);
