import { useState } from "react";
import AuthInput from "./userComponents/AuthInput";
import SubmitButton from "./userComponents/SubmitButton";
import axios from "axios";
import { toast } from "sonner";
import { forgetPasswordSchema } from "zod-schemas/dist/schema";
import { ZodError } from "zod";
import Navbar from "../layout/Navbar";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Partial<{ email: string }>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            forgetPasswordSchema.parse({ email }); // Validate email format
            if (!email.trim()) {
                toast.error("Please enter a valid email address");
                return;
            }

            setLoading(true);
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/forget-password`, { email });

            toast.success("Reset link sent to your email");
            setEmail("");
            setError({});
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Partial<{ email: string }> = {};
                error.errors.forEach((err) => {
                    if (err.path[0] === "email") {
                        fieldErrors.email = err.message;
                    }
                });
                setError(fieldErrors);
            } else {
                console.error("Forget password error:", error);
                toast.error("Request Failed", {
                    description:
                        axios.isAxiosError(error) && error.response?.data?.message
                            ? error.response.data.message
                            : "An unexpected error occurred. Please try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md p-6 rounded-2xl shadow-md border border-black bg-white space-y-6"
                >
                    <h2 className="text-2xl font-bold text-black text-center">
                        Forgot your password?
                    </h2>
                    <p className="text-sm text-center text-black">
                        Enter your email and we’ll send you a reset link.
                    </p>

                    <AuthInput
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        label="Email"
                        required
                        className="text-black"
                        error={error.email}
                    />

                    <SubmitButton
                        loading={loading}
                        icon={undefined}
                        text="Send Reset Link"
                        loadingText="Sending..."

                    />
                </form>
            </div>
        </>
    );
}
