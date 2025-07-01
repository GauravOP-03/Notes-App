import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useNotes } from "@/context/NotesContext";
import { useMemo } from "react";

interface ArchiveSheetProps {
    onDelete: (id: string) => Promise<void>;
    onUnarchive: (noteId: string) => Promise<void>;
}

export default function ArchiveSheet({ onDelete, onUnarchive }: ArchiveSheetProps) {
    const { notes } = useNotes();

    const archivedNotes = useMemo(() => {
        return notes.filter((note) => note.archived);
    }, [notes]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Archived</Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Archived Notes</SheetTitle>
                    <SheetDescription>
                        View and manage your archived notes. You can unarchive or delete them.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 grid gap-4">
                    {archivedNotes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No archived notes.</p>
                    ) : (
                        archivedNotes.map((note) => (
                            <div
                                key={note._id}
                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                                        {note.heading}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-3">{note.noteBody}</p>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onUnarchive(note._id)}
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        Unarchive
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(note._id)}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <SheetFooter className="mt-8">
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
