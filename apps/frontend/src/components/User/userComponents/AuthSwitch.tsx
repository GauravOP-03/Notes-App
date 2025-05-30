
interface AuthSwitchProp {
    onSwitch: () => void;
    content: string
}
export default function AuthSwitch({ onSwitch, content }: AuthSwitchProp) {
    return (
        <p className="text-center text-sm text-gray-500 mt-6">
            {content}{" "}
            <span
                onClick={onSwitch}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer"
            >
                Login
            </span>
        </p>
    )
}