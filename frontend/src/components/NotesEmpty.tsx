import { FileText, Plus, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";

const NotesEmpty = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-violet-300 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-gray-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-violet-200 rounded-full opacity-50 animate-pulse delay-500"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative max-w-md w-full">
                {/* Animated Icon Container */}
                <div className="mb-8 flex justify-center">
                    <div className="relative group">
                        {/* Glowing Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>

                        {/* Icon Background */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 p-6 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-transparent rounded-full opacity-50"></div>
                            <FileText className="relative w-12 h-12 text-gray-400 group-hover:text-violet-500 transition-colors duration-300" />

                            {/* Floating Plus Icon */}
                            <div className="absolute -top-1 -right-1 bg-violet-500 rounded-full p-1.5 shadow-lg animate-bounce">
                                <Plus className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title with Gradient Text */}
                <h2 className="text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-gray-700 via-black to-gray-700 bg-clip-text text-transparent">
                        Your Notes Canvas
                    </span>
                    <span className="inline-block ml-2">
                        <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                    </span>
                </h2>

                {/* Subtitle */}
                <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                    Ready to capture your brilliant ideas?
                    <br />
                    <span className="text-violet-600 font-medium">Create your first note</span> and let your thoughts flow.
                </p>

                {/* Action Button */}


                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                    <div className="group cursor-pointer">
                        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-violet-200 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-violet-100 to-violet-200 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-violet-600" />
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Rich Text</p>
                        </div>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-violet-200 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-gray-600" />
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Smart Tags</p>
                        </div>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-violet-200 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-violet-100 to-violet-200 rounded-lg flex items-center justify-center">
                                <Plus className="w-4 h-4 text-violet-600" />
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Quick Add</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Element */}
                <div className="mt-12 flex justify-center">
                    <div className="flex space-x-3">
                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-violet-300 rounded-full animate-pulse delay-200"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-400"></div>
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-600"></div>
                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse delay-800"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesEmpty;