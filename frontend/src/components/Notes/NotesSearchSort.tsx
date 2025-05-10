import { Input } from "../ui/input";
import { Search, ChevronDown } from "lucide-react";

interface Props {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function NotesSearchSort({ searchQuery, setSearchQuery }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                    type="search"
                    placeholder="Search your notes..."
                    className="pl-12 py-3 rounded-full border-gray-300 shadow-md focus:ring-2 focus:ring-purple-300 bg-white/70 backdrop-blur-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-3 rounded-full border border-gray-300 shadow-md bg-white/70 backdrop-blur-md text-gray-700 focus:ring-2 focus:ring-purple-300">
                    <option value="latest">Sort: Latest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="title">Sort: Title</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
