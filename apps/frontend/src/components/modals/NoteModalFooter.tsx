import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { memo } from "react";

interface NoteModalFooterProps {
    loading: boolean;
    handleSave: () => void;
    onClose: () => void;
    isNoteDirty: boolean;
}

// import { memo } from "react";

export const NoteModalFooter = memo(({ loading, handleSave, onClose, isNoteDirty }: NoteModalFooterProps) => {
    return (
        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
            <Button
                variant="outline"
                onClick={onClose}
                className="px-6 h-10 border-gray-300 hover:bg-gray-50"
            >
                Close
            </Button>
            <Button
                onClick={handleSave}
                disabled={loading || !isNoteDirty}
                className="px-6 h-10 bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200 disabled:opacity-50"
            >
                {loading ? (
                    <span className="flex items-center space-x-2">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                    </span>
                ) : (
                    <span className="flex items-center space-x-2">
                        <Pencil className="w-4 h-4" />
                        <span>Save Changes</span>
                    </span>
                )}
            </Button>
        </div>
    );
});

