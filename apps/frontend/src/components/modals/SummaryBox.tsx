import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
// import { Note } from "@/types/schema";
import { memo } from "react";

interface SummaryBoxProps {
    tags: string[];
    summarizeText: () => void;
    summarizing: boolean;
    displayedSummary: string;
}

export const SummaryBox = memo(({ tags, summarizeText, summarizing, displayedSummary }: SummaryBoxProps) => {
    // const tags = note.aiData?.tags || [];
    // console.log("rerender")
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center text-sm font-medium text-gray-700">
                    <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
                    AI Summary
                </h3>
                <Button
                    onClick={summarizeText}
                    disabled={summarizing}
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-2"
                >
                    {summarizing ? "..." : "Generate"}
                </Button>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
                {displayedSummary || <span className="text-gray-400 italic">No summary yet.</span>}
            </p>

            {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
});
