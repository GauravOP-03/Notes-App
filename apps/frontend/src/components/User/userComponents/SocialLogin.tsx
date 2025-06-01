import { memo } from "react";
import GoogleLogin from "../GoogleLogin"

function SocialLogin() {
    return (
        <>
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-500 rounded-full">Or continue with</span>
                </div>
            </div>

            <div className="flex justify-center">
                <GoogleLogin />
            </div>

        </>
    )
}
export default memo(SocialLogin);