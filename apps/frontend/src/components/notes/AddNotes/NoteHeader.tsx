import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, X } from "lucide-react";
import { memo } from "react";

interface NoteHeaderProps {
    title: string;
    body: string;
    onClose: () => void
}

function NoteHeader({ title, body, onClose }: NoteHeaderProps) {
    return (
        <CardHeader className="border-b border-gray-100 p-6 bg-gray-50/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-semibold text-gray-900">
                            {title}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {body}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-gray-100"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </Button>
            </div>
        </CardHeader>
    )
}

export default memo(NoteHeader)