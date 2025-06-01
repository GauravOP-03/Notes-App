import { Button } from "@/components/ui/button"
import { memo } from "react";


interface SubmitButtonProps {
    loading: boolean,
    icon: React.ReactNode,
    text: string,
    loadingText: string,
}

function SubmitButton({

    loading,
    icon,
    text,
    loadingText

}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base rounded-md transition-colors duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            disabled={loading}
        >
            {loading ? loadingText : (<>{icon} {text}</>)}
        </Button>
    )
}
export default memo(SubmitButton);
