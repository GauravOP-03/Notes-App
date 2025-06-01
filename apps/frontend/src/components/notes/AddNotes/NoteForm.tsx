// components/AddNotes/NoteForm.tsx
import {
    Card,
    CardContent,

} from "@/components/ui/card";

import { useCallback, useState, memo } from "react";
import { useNotes } from "@/context/NotesContext";
import { useSetNoteTags } from "../../utils/useSetNoteTags";
import axios from "axios";
import { BACKEND_URL } from "@/config";

import NoteTitleInput from "./NoteTitleInput";
import NoteImageUpload from "./NoteImageUpload";
import NoteVoiceRecorder from "./NoteVoiceRecorder";
import NoteContentTextarea from "./NoteContentTextarea";
import NoteFooter from "./NoteFooter";
import NoteHeader from "./NoteHeader";
import { toast } from "sonner";
// import { useDraftAutosave } from "@/hooks/useDraftAutosave";

const NoteForm = ({ onClose }: { onClose: () => void }) => {
    const { setNotes } = useNotes();
    const setNoteTags = useSetNoteTags();

    const [formData, setFormData] = useState({
        heading: "",
        noteBody: "",
        image: null as File | null
    });
    const [voiceData, setVoiceData] = useState({
        transcribedText: "",
        audioFile: null as File | null
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    // Use the useDraftAutosave hook
    // const { clearDraft, markInteraction } = useDraftAutosave({
    //     formData: { heading: formData.heading, noteBody: formData.noteBody },
    //     voiceData: { transcribedText: voiceData.transcribedText },
    //     setFormData,
    //     setVoiceData,
    //     storageKey: "note-draft",
    //     delay: 1000,
    //     toastDelay: 8000
    // });

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const data = new FormData();
            data.append("heading", formData.heading);
            data.append("noteBody", formData.noteBody);
            if (formData.image) data.append("image", formData.image);
            if (voiceData.transcribedText) data.append("transcribedText", voiceData.transcribedText);
            if (voiceData.audioFile) data.append("audioFile", voiceData.audioFile);

            const res = await axios.post(`${BACKEND_URL}/notes`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            setNotes((prev) => [...prev, res.data.data]);
            setFormData({ heading: "", noteBody: "", image: null });
            setVoiceData({ transcribedText: "", audioFile: null });
            setError(null);
            onClose();
            setIsPending(false);
            // clearDraft(); 
            toast.success("Note created successfully!", {
                description: "Your note has been saved.",
            });
            setTimeout(() => setNoteTags(res.data.data._id), 4000);
        } catch (err) {
            setIsPending(false);
            if (err instanceof Error) {
                setError(err.message || "Failed to create note.");
            } else {
                setError("Failed to create note.");
            }
        }
    }, [formData, voiceData, setNotes, setNoteTags, onClose,]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
        const files = (e.target as HTMLInputElement).files;
        // markInteraction();
        if (name === "image" && files) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else if (name === "heading" || name === "noteBody") {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }, []);

    const resetField = useCallback((fieldName: string) => {
        if (["image", "heading", "noteBody"].includes(fieldName)) {
            setFormData((prev) => ({ ...prev, [fieldName]: null }));
        } else if (["transcribedText", "audioFile"].includes(fieldName)) {
            setVoiceData((prev) => ({ ...prev, [fieldName]: null }));
        } else {
            console.warn(`Unhandled field name: ${fieldName}`);
        }
    }, []);

    const handleVoiceChange = useCallback((data: { transcribedText: string, audioFile: File | null }) => {
        setVoiceData(data);
    }, []);

    return (
        // <div className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-20 z-50 flex items-center justify-center">
        //     <Card className="w-full h-full bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        //         <NoteHeader title={"Create New Note"} body={"Capture your thoughts and ideas"} onClose={onClose} />

        //         <CardContent className="overflow-y-auto p-6 flex-1">
        //             <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
        //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        //                     <div className="space-y-6">
        //                         <NoteTitleInput heading={formData.heading} handleOnChange={handleChange} />
        //                         <NoteImageUpload image={formData.image} handleOnChange={handleChange} resetField={resetField} />
        //                         <NoteVoiceRecorder voiceData={voiceData} handleVoiceChange={handleVoiceChange} />
        //                     </div>
        //                     <NoteContentTextarea noteBody={formData.noteBody} handleOnChange={handleChange} />
        //                 </div>

        //                 <NoteFooter
        //                     error={error}
        //                     isPending={isPending}
        //                     onClose={onClose}
        //                 />
        //             </form>
        //         </CardContent>
        //     </Card>
        // </div>

        <NoteFormHead onClose={onClose}>
            <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <NoteTitleInput heading={formData.heading} handleOnChange={handleChange} />
                        <NoteImageUpload image={formData.image} handleOnChange={handleChange} resetField={resetField} />
                        <NoteVoiceRecorder voiceData={voiceData} handleVoiceChange={handleVoiceChange} />
                    </div>
                    <NoteContentTextarea noteBody={formData.noteBody} handleOnChange={handleChange} />
                </div>

                <NoteFooter
                    error={error}
                    isPending={isPending}
                    onClose={onClose}
                />
            </form>
        </NoteFormHead>
    );
};


const NoteFormHead = memo(function NoteFormHead({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-20 z-50 flex items-center justify-center">
            <Card className="w-full h-full bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                <NoteHeader title={"Create New Note"} body={"Capture your thoughts and ideas"} onClose={onClose} />

                <CardContent className="overflow-y-auto p-6 flex-1">
                    {children}
                </CardContent>
            </Card>
        </div>
    )
})

export default memo(NoteForm);
