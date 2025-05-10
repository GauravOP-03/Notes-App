import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ImageIcon, MicIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Note } from "@/types/schema";

interface Props {
    note: Note;
    onDelete: (id: string) => Promise<void>;
    onClick: () => void;
}

export default function NoteCard({ note, onDelete, onClick }: Props) {
    const hasImages = note.image?.filter(Boolean).length > 0;

    return (
        <Card
            className="group relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-purple-300"
            onClick={onClick}
        >
            <CardHeader className="flex flex-col gap-2">
                <p className="text-xs text-gray-400">
                    {new Date(note.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </p>
                <h3 className="text-lg font-semibold leading-tight line-clamp-1">
                    {note.heading}
                </h3>
            </CardHeader>

            <CardContent className="mt-2">
                <p className="text-sm text-gray-600 line-clamp-3">{note.noteBody}</p>
            </CardContent>

            <CardFooter className="flex items-center justify-between text-xs text-gray-400 mt-4">
                {hasImages && (
                    <span className="inline-flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        {note.image.filter(Boolean).length}
                    </span>
                )}
                {note.audioFile && <MicIcon className="h-4 w-4" />}
            </CardFooter>

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note._id);
                }}
            >
                <Trash2 className="h-5 w-5" />
            </Button>
        </Card>
    );
}
