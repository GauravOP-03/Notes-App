import React from "react";
import { getCursorCoordinates } from "@/components/utils/getCaretCoordinates";

interface CursorOverlayProps {
    cursors: Record<string, { userId: string; position: number; username: string }>;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    currentUserId: string;
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({
    cursors,
    textareaRef,
    currentUserId,
}) => {
    if (!textareaRef.current) return null;


    return (
        <>
            {Object.entries(cursors).map(([uid, { position, username }]) => {
                if (uid === currentUserId || !textareaRef.current || position < 0) return null;

                const textarea = textareaRef.current!;
                const textLength = textarea.value.length;
                const safePosition = Math.min(position, textLength); // Clamp position
                const { top, left } = getCursorCoordinates(textarea, safePosition);

                if (isNaN(top) || isNaN(left)) return null;

                return (
                    <div key={uid}>
                        {/* Label bubble */}
                        <div
                            className="absolute z-50 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow pointer-events-none animate-fadeIn"
                            style={{
                                top,
                                left,
                                transform: "translateY(-100%)", // Position label above caret
                            }}
                        >
                            {username}
                        </div>

                        {/* Optional: thin blinking caret */}
                        <div
                            className="absolute z-40 bg-blue-600"
                            style={{
                                top,
                                left,
                                width: "2px",
                                height: "1.25rem", // Approx line-height
                                animation: "blink 1s step-end infinite",
                            }}
                        ></div>
                    </div>
                );
            })}
        </>
    );
};
