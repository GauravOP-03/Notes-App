// import { Link } from "react-router-dom";

interface Props {
    userId: string;
}

export default function FloatingActions({ userId }: Props) {
    return (
        <>

            {/* Dark Mode Toggle - always bottom-right */}
            <div className="fixed bottom-6 right-6 z-30">
                <button className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-md border border-gray-300 hover:bg-black hover:text-white transition ">
                    🌓
                </button>
            </div>
        </>
    );
}
