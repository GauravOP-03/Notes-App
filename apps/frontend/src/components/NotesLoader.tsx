const NotesLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center text-gray-500 p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500"></div>
            <p className="mt-2 text-sm">Loading your notes...</p>
        </div>
    );
};

export default NotesLoader;
