import { Mic, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface AudioBoxProps {
    audioFile: string | null;
    onDelete: () => void;
}

export const AudioBox = ({ audioFile, onDelete }: AudioBoxProps) => {
    if (!audioFile) return null;

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center text-sm font-medium text-gray-700">
                    <Mic className="w-4 h-4 mr-2 text-violet-600" />
                    Audio
                </h3>
                <Button
                    onClick={onDelete}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
            <audio controls className="w-full rounded-lg">
                <source src={audioFile} type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};
