

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { toast } from "sonner";
import Navbar from "./layout/Navbar";
import axios from "axios";

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/contact`, { ...form })
            toast.success("Message sent successfully!");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            toast.error("Something went wrong. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <section className="flex justify-center items-center min-h-screen bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-xl"
                >
                    <Card className="rounded-3xl shadow-lg border border-muted bg-white">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">
                                Contact Me
                            </CardTitle>
                            <p className="text-gray-500 text-base">
                                Have a question or want to work together? Send me a message below.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="name" className="text-violet-600">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-violet-600">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message" className="text-violet-600">
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Your message..."
                                        rows={5}
                                        required
                                        className="bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-black text-white hover:bg-gray-900 transition-all"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>
        </>
    );
}
