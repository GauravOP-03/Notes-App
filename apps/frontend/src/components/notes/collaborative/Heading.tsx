import { Input } from "@/components/ui/input"
import { memo } from "react";

const Heading = memo(({ title, saving, onChange }: { title: string, saving: boolean, onChange: (value: string) => void }) => {
    // console.log("Heading")
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
                Collaborative Note Editing
            </h2>
            <Input
                placeholder="Title your shared note..."
                value={title}
                onChange={(e) => onChange(e.target.value)}
                className="text-lg rounded-xl"
                disabled={saving}
            />
        </div>
    )
})

export default Heading;