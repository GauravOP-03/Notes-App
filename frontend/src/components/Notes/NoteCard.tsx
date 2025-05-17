import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
    ImageIcon,
    MicIcon,
    Trash2,
    Share2,
    CalendarDays,
    Clock,
    LinkIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Note } from "@/types/schema";
import { toast } from "sonner"
// import { Toaster } from "../ui/sonner";

interface Props {
    note: Note;
    onDelete: (id: string) => Promise<void>;
    onClick: () => void;
    onShare: (noteId: string) => Promise<void>;
}

export default function NoteCard({ note, onDelete, onClick, onShare }: Props) {
    const validImages = note.image?.filter(Boolean) || [];
    const hasImages = validImages.length > 0;

    const shareUrl = note.shareId
        ? `${window.location.origin}/shared/${note.shareId}`
        : null;

    function handleCopy(e: React.MouseEvent) {
        e.stopPropagation();
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
        }
        // alert("copied")
        toast("Share link copied!");
    }

    return (
        <Card
            className="group relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            {/* <Toaster /> */}
            {/* Header */}
            <CardHeader className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
                    <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                    <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                        <Clock className="h-4 w-4" />
                        {new Date(note.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                </div>
                <h3 className="text-lg font-semibold leading-tight line-clamp-1">
                    {note.heading}
                </h3>
            </CardHeader>

            {/* Body */}
            <CardContent className="mt-1">
                <p className="text-sm text-gray-700 line-clamp-3">{note.noteBody}</p>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex flex-col gap-2 mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        {hasImages && (
                            <span className="inline-flex items-center gap-1">
                                <ImageIcon className="h-4 w-4" />
                                {validImages.length}
                            </span>
                        )}
                        {note.audioFile && (
                            <span className="inline-flex items-center gap-1">
                                <MicIcon className="h-4 w-4" />
                                Audio
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(note._id);
                            }}
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(note._id);
                            }}
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Shared Info */}
                {note.shareId && note.sharedUntil && new Date(note.sharedUntil) > new Date() && (
                    <div className="w-full mt-2 bg-green-50 text-green-800 text-xs px-3 py-2 rounded-xl border border-green-200 flex justify-between items-center">
                        <div>
                            <div className="font-medium">Shared</div>
                            <div className="text-[10px]">
                                Expires on:{" "}
                                {new Date(note.sharedUntil ?? "").toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </div>
                        </div>
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            className="text-green-700 hover:text-green-900 text-xs px-2"
                        >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Copy Link
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
