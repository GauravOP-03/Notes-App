// components/AddNotes/NoteImageUpload.tsx
import { Image, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { memo } from "react";

interface NoteInputUploadProps {
    image: File | null;
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetField: (field: string) => void;
}

const NoteImageUpload = ({
    image,
    handleOnChange,
    resetField
}: NoteInputUploadProps
) => {
    return (
        <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
                <Image className="w-4 h-4 mr-2 text-violet-600" />
                Add Image
            </label>
            <div className="relative">
                <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleOnChange
                    }
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                >
                    <div className="text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                </label>
            </div>
            {image && (
                <div className="relative">
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded-lg border"
                    />
                    <Button
                        type="button"
                        onClick={() => resetField("image")}
                        className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
                    >
                        <X className="w-4 h-4 text-white" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default memo(NoteImageUpload);
