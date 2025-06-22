import { memo } from "react";
import { FileText } from "lucide-react";
import { SummaryBox } from "./SummaryBox";
import { TranscriptionBox } from "./TranscriptionBox";
import { AudioBox } from "./AudioBox";
import { ImageGalleryBox } from "./ImageGalleryBox";
import { UploadImageBox } from "./UploadImageBox";

interface NoteModalBodyProps {
    noteBody: string;
    transcribedText: string;
    audioFile: string | null;
    image: string[];
    tags: string[];
    file?: File;
    displayedSummary: string;
    summarizing: boolean;
    summarizeText: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    markAudioForDeletion: () => void;
    markImageForDeletion: (img: string) => void;
    imagesToDelete: string[];
    deleteAudio: boolean;
}

export const NoteModalBody = memo(({
    noteBody,
    transcribedText,
    audioFile,
    image,
    tags,
    file,
    displayedSummary,
    summarizing,
    summarizeText,
    handleChange,
    handleFileChange,
    markAudioForDeletion,
    markImageForDeletion,
    imagesToDelete,
    deleteAudio,
}: NoteModalBodyProps) => {
    return (
        <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-full">
                {/* Main Content - Note Text */}
                <div className="xl:col-span-3 space-y-4">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FileText className="w-4 h-4 mr-2 text-violet-600" />
                            Note Content
                        </label>
                        <textarea
                            name="noteBody"
                            value={noteBody}
                            onChange={handleChange}
                            placeholder="Start writing your note here..."
                            className="w-full h-[500px] xl:h-[600px] p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 text-base resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:outline-none leading-relaxed tracking-wide transition-all duration-200"
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {noteBody.length > 0 &&
                                `${noteBody.split(" ").filter(word => word.length > 0).length} words`}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-1 space-y-4">
                    <SummaryBox
                        tags={tags}
                        summarizeText={summarizeText}
                        summarizing={summarizing}
                        displayedSummary={displayedSummary}
                    />

                    <TranscriptionBox
                        transcribedText={transcribedText}
                        onChange={handleChange}
                    />

                    <AudioBox
                        audioFile={deleteAudio ? null : audioFile}
                        onDelete={markAudioForDeletion}
                    />

                    <ImageGalleryBox
                        images={(image || []).filter(Boolean)}
                        imagesToDelete={imagesToDelete}
                        onDelete={markImageForDeletion}
                    />

                    <UploadImageBox
                        onFileChange={handleFileChange}
                        previewFile={file}
                    />
                </div>
            </div>
        </div>
    );
});

NoteModalBody.displayName = "NoteModalBody"; // helpful for debugging with memo
