import { CardHeader } from "@/components/ui/card"
import { memo } from "react"

interface UserCardHeaderProp {
    heading: string,
    content: string
}
function UserCardHeader({ heading, content }: UserCardHeaderProp) {
    return (
        <CardHeader className="text-center p-6 md:p-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
                {heading}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
                {content}
            </p>
        </CardHeader>
    )
}
export default memo(UserCardHeader);