// components/AddNotes/NoteTitleInput.tsx
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { memo } from "react";

interface NoteTitleInputProps {
    heading: string;
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NoteTitleInput = ({
    heading,
    handleOnChange
}:
    NoteTitleInputProps
) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-violet-600" />
                Note Title
            </label>
            <Input
                type="text"
                name="heading"
                placeholder="Give your note a memorable title..."
                value={heading}
                onChange={handleOnChange}
                required
                className="h-12 px-4"
            />
        </div>
    );
};

export default memo(NoteTitleInput);
