import { FileText, Sparkles, Plus } from "lucide-react";
import { memo } from "react";

const NotesEmpty = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 relative">
            {/* Subtle Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-violet-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-gray-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-violet-200 rounded-full opacity-30 animate-pulse delay-500"></div>
            </div>

            {/* Main Icon and Title */}
            <div className="mb-6">
                <div className="relative group">
                    {/* Glowing Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full blur-xl opacity-20 animate-pulse"></div>

                    {/* Icon Container */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 rounded-full shadow-md">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* NoteNest Title */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                Welcome to <span className="text-violet-600">NoteNest</span>
            </h2>

            {/* Subtext */}
            <p className="text-gray-500 text-base max-w-md">
                You don't have any notes yet. <br />
                To add notes, click the <Plus className="inline-block w-4 h-4 text-violet-500" /> icon at the bottom right corner.
            </p>

            {/* Decorative sparkles */}
            <Sparkles className="w-5 h-5 text-violet-300 animate-pulse mt-6" />
        </div>
    );
};

export default memo(NotesEmpty);
