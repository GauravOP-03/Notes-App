import { X, FileText } from "lucide-react";
import { Button } from "../ui/button";
// import { Note } from "@/types/schema";
import { memo } from "react";

interface NoteModalHeaderProps {
    // editedNote: Note;
    updatedAt: string;
    heading: string;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NoteModalHeader = memo(({ updatedAt, heading, onClose, onChange }: NoteModalHeaderProps) => {
    console.log("component rerender")
    return (
        <div className="border-b border-gray-100 px-6 py-5 bg-gray-50/50 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Edit Note</h2>
                        <p className="text-xs text-gray-500">
                            Last edited:{" "}
                            {new Date(updatedAt).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-gray-100"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </Button>
            </div>

            <input
                type="text"
                name="heading"
                value={heading}
                onChange={onChange}
                placeholder="Note Title..."
                className="w-full text-2xl font-semibold text-gray-900 bg-transparent outline-none placeholder-gray-400 border-b border-transparent focus:border-violet-400 transition-colors duration-200 pb-2"
            />
        </div>
    );
});
