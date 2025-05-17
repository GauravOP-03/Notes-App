import {
    BookOpen,
    ClipboardList,
    Star,
    FileText,
    Briefcase,
    CheckSquare,
    Users,
    Lightbulb,
    Code,
    FlaskConical,
    AlignLeft,
    Quote,
    User,
    LucideIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type TagEnum =
    | "lecture"
    | "assignment"
    | "important"
    | "exam"
    | "project"
    | "todo"
    | "meeting"
    | "idea"
    | "code"
    | "research"
    | "summary"
    | "quote"
    | "personal";

const tagIconMap: Record<TagEnum, { icon: LucideIcon; label: string }> = {
    lecture: { icon: BookOpen, label: "Lecture" },
    assignment: { icon: ClipboardList, label: "Assignment" },
    important: { icon: Star, label: "Important" },
    exam: { icon: FileText, label: "Exam" },
    project: { icon: Briefcase, label: "Project" },
    todo: { icon: CheckSquare, label: "To-Do" },
    meeting: { icon: Users, label: "Meeting" },
    idea: { icon: Lightbulb, label: "Idea" },
    code: { icon: Code, label: "Code" },
    research: { icon: FlaskConical, label: "Research" },
    summary: { icon: AlignLeft, label: "Summary" },
    quote: { icon: Quote, label: "Quote" },
    personal: { icon: User, label: "Personal" },
};

interface TagIconProps {
    tag: TagEnum;
    size?: number;
    className?: string;
}

export const TagIcon: React.FC<TagIconProps> = ({ tag, size = 20, className }) => {
    const { icon: Icon, label } = tagIconMap[tag];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Icon size={size} className={className} />
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};