// components/AddNotes/NoteFooter.tsx
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { memo } from "react";

const NoteFooter = ({
    error,
    isPending,
    onClose
}: {
    error: string | null;
    isPending: boolean;
    onClose: () => void;
}) => {
    return (
        <>
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                    variant="outline"
                    type="button"
                    onClick={onClose}
                    className="px-6 h-11"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="px-6 h-11 bg-gray-900 text-white hover:bg-gray-800"
                >
                    {isPending ? "Creating..." : (
                        <div className="flex items-center space-x-2">
                            <Edit3 className="w-4 h-4" />
                            <span>Create Note</span>
                        </div>
                    )}
                </Button>
            </div>
        </>
    );
};

export default memo(NoteFooter);
