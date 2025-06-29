import { useState } from "react";
import AuthInput from "./userComponents/AuthInput";
import SubmitButton from "./userComponents/SubmitButton";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { resetPasswordSchema } from "zod-schemas/dist/schema";
import { ZodError } from "zod";
import Navbar from "../layout/Navbar";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get("token");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [loading, setLoading] = useState(false);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        if (!token) {
            toast.error("Invalid or missing token");
            setLoading(false);
            return;
        }

        try {
            resetPasswordSchema.parse(formData);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reset-password`, {
                token,
                newPassword: formData.newPassword,
            });

            toast.success("Password reset successfully. You can now log in.");
            setFormData({ newPassword: "", confirmNewPassword: "" });
            setErrors({});
            navigate("/login")
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Partial<typeof formData> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof typeof formData] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                console.error("Reset error:", error);
                toast.error("Reset Failed", {
                    description:
                        axios.isAxiosError(error) && error.response?.data?.message
                            ? error.response.data.message
                            : "An unexpected error occurred. Please try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md space-y-6 bg-white border border-black shadow-md p-6 rounded-2xl"
                >
                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-bold text-black">Reset Password</h2>
                        <p className="text-sm text-black">Enter and confirm your new password below.</p>
                    </div>

                    <AuthInput
                        id="new-password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInput}
                        placeholder="Enter new password"
                        label="New Password"
                        error={errors.newPassword}
                        required
                        className="text-black"
                    />

                    <AuthInput
                        id="confirm-new-password"
                        name="confirmNewPassword"
                        type="password"
                        value={formData.confirmNewPassword}
                        onChange={handleInput}
                        placeholder="Confirm new password"
                        label="Confirm Password"
                        error={errors.confirmNewPassword}
                        required
                        className="text-black"
                    />

                    <SubmitButton
                        loading={loading}
                        icon={undefined}
                        text="Reset Password"
                        loadingText="Resetting..."

                    />
                </form>
            </div>
        </>
    );
}
