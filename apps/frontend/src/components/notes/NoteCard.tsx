import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
    ImageIcon,
    MicIcon,
    Trash2,
    Share2,
    CalendarDays,
    Clock,
    LinkIcon,
    Tag as TagIcon,
    X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Note } from "@/types/schema";
import { toast } from "sonner";
// import { useState } from "react";

interface Props {
    note: Note;
    onDelete: (id: string) => Promise<void>;
    onClick: () => void;
    onShare: (noteId: string) => Promise<void>;
    onShareRemove: (noteId: string) => Promise<void>;
}

export default function NoteCard({ note, onDelete, onClick, onShare, onShareRemove }: Props) {
    // const [showSharedBox, setShowSharedBox] = useState(true);
    const validImages = note.image?.filter(Boolean) || [];
    const hasImages = validImages.length > 0;

    const shareUrl = note.shareId
        ? `${window.location.origin}/shared/${note.shareId}`
        : null;

    const isShared = note.visibility == "public" && note.shareId &&
        note.sharedUntil &&
        new Date(note.sharedUntil) > new Date();

    function handleCopy(e: React.MouseEvent) {
        e.stopPropagation();
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied!", {
                description: "The shareable link was copied to your clipboard.",
            });
        }
    }

    return (
        <Card
            onClick={onClick}
            className="group relative bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 cursor-pointer break-inside-avoid overflow-hidden"
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-transparent to-gray-50/10 pointer-events-none" />

            {/* Premium border accent */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <CardHeader className="relative px-4 pt-4 pb-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(note.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-2 leading-snug">
                    {note.heading}
                </h3>
            </CardHeader>

            <CardContent className="relative px-4 pb-3">
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
                    {note.noteBody}
                </p>

                {note.aiData?.tags && note.aiData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {note.aiData.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-50 to-violet-100/50 text-violet-700 border border-violet-200/50"
                            >
                                <TagIcon className="w-2.5 h-2.5" />
                                {tag}
                            </span>
                        ))}
                        {note.aiData.tags.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                +{note.aiData.tags.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="relative px-4 pb-4 space-y-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        {hasImages && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 text-gray-600">
                                <ImageIcon className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">{validImages.length}</span>
                            </div>
                        )}
                        {note.audioFile && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 text-gray-600">
                                <MicIcon className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Audio</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(note._id);
                            }}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(note._id);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {isShared && (
                    <div className="w-full bg-gradient-to-r from-violet-50 to-violet-100/50 text-violet-800 rounded-lg border border-violet-200/50 p-3">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                                <div className="font-medium flex items-center gap-2 text-sm mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                    Shared
                                </div>
                                <div className="text-xs text-violet-600 mb-2">
                                    Expires: {note.sharedUntil && new Date(note.sharedUntil).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                                <Button
                                    onClick={handleCopy}
                                    variant="ghost"
                                    className="text-violet-700 hover:text-violet-900 hover:bg-violet-200/50 text-xs px-2 py-1 h-6 rounded-md font-medium transition-colors"
                                >
                                    <LinkIcon className="h-3 w-3 mr-1" />
                                    Copy
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-violet-400 hover:text-violet-600 hover:bg-violet-200/50 rounded-md transition-colors flex-shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShareRemove(note._id)
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}