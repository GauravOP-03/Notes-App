import { Button } from "@/components/ui/button";
import { Save, Share2, Lock, Unlock, Loader2 } from "lucide-react";
import { memo } from "react";

interface ToolbarProps {
    saving: boolean;
    locked: boolean;
    host: string | null;
    userId: string;
    allUser: Array<{ uid: string; username: string }>;
    onSave: () => void;
    onShare: () => void;
    onLock: () => void;
}

function Toolbar({
    saving,
    locked,
    host,
    userId,
    allUser,
    onSave,
    onShare,
    onLock,
}: ToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border rounded-xl px-5 py-3 shadow-sm">
            <div className="flex flex-wrap gap-2 text-sm text-blue-800">
                {allUser.map(({ uid, username }) => (
                    <span
                        key={uid}
                        className="px-3 py-1 bg-blue-100 rounded-full font-medium select-none"
                    >
                        {uid === userId ? "You" : username}
                    </span>
                ))}
            </div>

            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    className="rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
                    onClick={onShare}
                    disabled={saving}
                >
                    <Share2 className="w-5 h-5" /> Share
                </Button>

                <Button
                    className="rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
                    onClick={onSave}
                    disabled={saving}
                >
                    {saving ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : "Save Note"}
                </Button>

                {host === userId && (
                    <Button
                        variant={locked ? "default" : "destructive"}
                        className="rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2"
                        onClick={onLock}
                    >
                        {locked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        {locked ? "Unlock" : "Lock"}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default memo(Toolbar);