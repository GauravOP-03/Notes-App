import Heading from "./Heading";
import { memo, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
import { CursorOverlay } from "./CursorOverlay";

interface CursorData {
    userId: string;
    position: number;
    username: string;
}
interface EditorProps {
    title: string;
    text: string;
    saving: boolean;
    locked: boolean;
    userId: string;
    host: string | null;
    cursors: Record<string, CursorData>;
    onTitleChange: (value: string) => void;
    onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCursorMove: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function Editor({
    title,
    text,
    saving,
    locked,
    userId,
    host,
    onTitleChange,
    onTextChange,
    onCursorMove,
    cursors
}: EditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="flex flex-col flex-1 gap-4">
            <Heading title={title} saving={saving} onChange={onTitleChange} />
            <div className="relative flex-1 rounded-xl border shadow-sm overflow-hidden">
                <Textarea
                    ref={textareaRef}
                    value={text}
                    onChange={onTextChange}
                    onSelect={onCursorMove}
                    placeholder="Type collaboratively with others..."
                    className="w-full h-full p-4 resize-none text-base bg-white"
                    disabled={(host !== userId && locked) || saving}
                    rows={10}
                />
                <CursorOverlay
                    cursors={cursors}
                    textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                    currentUserId={userId}
                />
            </div>
        </div>
    );
}


export default memo(Editor);