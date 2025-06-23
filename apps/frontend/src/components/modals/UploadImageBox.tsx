import { Image } from "lucide-react";
import { memo } from "react";

interface UploadImageBoxProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    previewFile?: File | null;
}

export const UploadImageBox = memo(({ onFileChange, previewFile }: UploadImageBoxProps) => {
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Image className="w-4 h-4 mr-2 text-violet-600" />
                Add Image
            </label>
            <div className="relative">
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                    id="image-upload-edit"
                />
                <label
                    htmlFor="image-upload-edit"
                    className="flex items-center justify-center h-16 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 group"
                >
                    <div className="text-center">
                        <div className="w-6 h-6 text-gray-400 mx-auto mb-1 group-hover:text-violet-500 transition-colors duration-200">
                            <Image className="w-full h-full" />
                        </div>
                        <p className="text-xs text-gray-500 group-hover:text-violet-600 transition-colors duration-200">
                            Click to upload
                        </p>
                    </div>
                </label>
            </div>

            {previewFile && (
                <img
                    src={URL.createObjectURL(previewFile)}
                    alt="Preview"
                    className="mt-3 rounded-lg max-h-60 object-contain"
                />
            )}
        </div>
    );
});
