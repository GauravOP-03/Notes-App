import { Image, Trash2, ZoomIn } from "lucide-react";
import { memo } from "react";

interface ImageGalleryBoxProps {
    images: string[];
    imagesToDelete: string[];
    onDelete: (img: string) => void;
    imageInsight: (url: string) => Promise<void>;
    displayInsightLoading: boolean;
    displayImageInsight: Record<string, string>;
}

export const ImageGalleryBox = memo(
    ({
        images,
        imagesToDelete,
        onDelete,
        imageInsight,
        displayInsightLoading,
        displayImageInsight,
    }: ImageGalleryBoxProps) => {
        const validImages = images.filter(Boolean) as string[];
        if (validImages.length === 0) return null;

        return (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Image className="w-4 h-4 mr-2 text-violet-600" />
                    Images ({validImages.length})
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {validImages.map((img, idx) => {
                        const isMarkedForDeletion = imagesToDelete.includes(img);
                        const insight = displayImageInsight[img];

                        return (
                            <div
                                key={idx}
                                className={`relative rounded-lg overflow-hidden group aspect-video border-2 ${isMarkedForDeletion
                                        ? "border-red-300 opacity-50"
                                        : "border-gray-200 hover:border-violet-300"
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Note image ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />

                                {/* Insight Text */}
                                {insight && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-gray-800 text-xs p-2 max-h-24 overflow-y-auto border-t border-gray-300">
                                        {insight}
                                    </div>
                                )}

                                {/* Summarize Button */}
                                {!insight && (
                                    <button
                                        onClick={() => imageInsight(img)}
                                        disabled={displayInsightLoading}
                                        className="absolute bottom-2 left-2 bg-violet-600 text-white text-xs px-2 py-1 rounded hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {displayInsightLoading ? "Summarizing..." : "Summarize"}
                                    </button>
                                )}

                                {/* Deletion Badge */}
                                {isMarkedForDeletion && (
                                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                        <span className="text-red-700 text-xs font-medium bg-white px-2 py-1 rounded">
                                            Marked for deletion
                                        </span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-2 right-2 flex space-x-1 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(img, "_blank");
                                        }}
                                        className="w-7 h-7 bg-gray-900/80 text-white rounded-full flex items-center justify-center hover:bg-gray-900"
                                        title="View full size"
                                    >
                                        <ZoomIn className="w-3 h-3" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(img);
                                        }}
                                        className="w-7 h-7 bg-red-600/80 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                        title="Mark for deletion"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);
