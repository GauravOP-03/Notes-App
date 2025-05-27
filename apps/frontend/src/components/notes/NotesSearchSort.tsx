import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpAZ } from "lucide-react";
// import { useState } from "react";

interface Props {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortOrder: string;
    setSortOrder: (order: "asc" | "desc") => void;
    sortField: string;
    setSortField: (field: string) => void;
}

const sortFields = [
    { value: "created", label: "Created" },
    { value: "updated", label: "Updated" },
    { value: "title", label: "Title" },
];

export default function NotesSearchSort({ searchQuery, setSearchQuery, setSortOrder, sortOrder, setSortField, sortField }: Props) {


    // Toggle sort order
    const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            {/* Search */}
            <div className="relative w-full sm:flex-1">
                {/* Icon inside input */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                    <Search className="h-5 w-5 text-gray-400" />
                </span>
                <Input
                    type="search"
                    placeholder="Search your notes..."
                    className="pl-12 py-3 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-300 bg-white/70 backdrop-blur-md transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sort Dropdown */}
            <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(val) => {
                    const [field, order] = val.split("-");
                    setSortField(field);
                    setSortOrder(order as "asc" | "desc");
                }}
            >
                <SelectTrigger className="w-full sm:w-72 py-3 rounded-xl border border-gray-200 shadow-sm bg-white/70 backdrop-blur-md text-gray-700 focus:ring-2 focus:ring-purple-300">
                    <SelectValue>
                        <div className="flex items-center gap-2">
                            <ArrowUpAZ
                                className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                            />
                            Sort by {sortFields.find((f) => f.value === sortField)?.label} (
                            {sortOrder === "asc" ? "A→Z/Oldest" : "Z→A/Newest"})
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="z-50">
                    {sortFields.map((field) => (
                        <SelectItem key={field.value} value={`${field.value}-${sortOrder}`}>
                            <div className="flex items-center gap-2">
                                <ArrowUpAZ
                                    className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                                />
                                {field.label}
                            </div>
                        </SelectItem>
                    ))}
                    <div className="flex justify-center py-2 border-t mt-2">
                        <button
                            type="button"
                            className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-100 transition"
                            onClick={toggleSortOrder}
                            tabIndex={-1}
                        >
                            <ArrowUpAZ
                                className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                            />
                            {sortOrder === "asc" ? "Ascending" : "Descending"}
                        </button>
                    </div>
                </SelectContent>
            </Select>
        </div>
    );
}
