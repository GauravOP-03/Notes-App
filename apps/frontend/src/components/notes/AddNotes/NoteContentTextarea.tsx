// components/AddNotes/NoteContentTextarea.tsx
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";

interface NoteContentTextareaProp {
    noteBody: string;
    handleOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const NoteContentTextarea = ({
    noteBody,
    handleOnChange
}: NoteContentTextareaProp) => {
    const wordCount = noteBody.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-violet-600" />
                Note Content
            </label>
            <Textarea
                placeholder="Start writing your note here..."
                name="noteBody"
                value={noteBody}
                onChange={handleOnChange}
                required
                className="min-h-[400px] lg:min-h-[500px] p-4 resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
                {noteBody.length > 0 && `${wordCount} words`}
            </div>
        </div>
    );
};

export default memo(NoteContentTextarea);
