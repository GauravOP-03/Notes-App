import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useState } from "react";
import NoteForm from "./NoteForm";

const AddNotes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      {/* Button to open the Note Form Modal */}
      <AddNotesButton onClick={handleOpen} />

      {/* Modal for Note Form */}

      {isOpen && (
        <>
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <NoteForm onClose={handleClose} />
        </>
      )}
    </>
  );
};

const AddNotesButton = memo(({ onClick }: { onClick: () => void }) => (
  <div className="fixed bottom-6 right-6 z-50">
    <Button
      onClick={onClick}
      className="group relative w-16 h-16 p-0 rounded-full shadow-xl bg-gray-900 hover:bg-gray-800 border border-gray-700"
    >
      <Plus className="w-7 h-7 text-white" />
      <div className="absolute inset-0 rounded-full bg-violet-500/20 opacity-0 group-hover:opacity-100" />
    </Button>
  </div>
));


export default memo(AddNotes);
