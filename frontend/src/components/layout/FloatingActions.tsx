import { Link } from "react-router-dom";

interface Props {
    userId: string;
}

export default function FloatingActions({ userId }: Props) {
    return (
        <>
            {/* Real Time Notes - always bottom-left, small and round */}
            <div className="fixed left-6 bottom-6 z-30">
                <Link
                    to={`/${userId}/notes`}
                    target="_blank"
                    className="block px-3 py-2 text-sm font-medium rounded-full bg-white/80 backdrop-blur-lg hover:bg-black hover:text-white border border-gray-300 shadow-md transition"
                    style={{ minWidth: 0, minHeight: 0 }}
                >
                    Real Time
                </Link>
            </div>

            {/* Dark Mode Toggle - always bottom-right */}
            <div className="fixed bottom-6 right-6 z-30">
                <button className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md border border-gray-300 hover:bg-black hover:text-white transition ">
                    🌓
                </button>
            </div>
        </>
    );
}
