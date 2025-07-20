import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Navbar from "./layout/Navbar";

export default function AboutNoteNest() {
    return (
        <>
            <Navbar />

            <main className="bg-white text-gray-900">
                {/* Hero Section */}
                <section className="py-24 px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900"
                    >
                        About NoteNest
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        NoteNest is an open-source, AI-powered collaborative note-taking app designed to help you capture, organize, and share your ideas effortlessly.
                    </motion.p>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "🚀 Open-Source & Free",
                            description:
                                "Built for the community, by the community. Fork it, self-host it, or contribute to make it better.",
                        },
                        {
                            title: "🤖 AI-Powered",
                            description:
                                "Summarize notes, transcribe voice recordings, and get smart suggestions with built-in AI features.",
                        },
                        {
                            title: "👥 Real-Time Collaboration",
                            description:
                                "Collaborate with your team seamlessly. Edit notes together and chat in real time.",
                        },
                        {
                            title: "🎤 Voice & Image Support",
                            description:
                                "Upload images, record voice notes, and let NoteNest transcribe them for you.",
                        },
                        {
                            title: "🌐 Cross-Platform",
                            description:
                                "Access your notes anywhere—desktop, tablet, or mobile. Your ideas, always in sync.",
                        },
                        {
                            title: "🛠️ Easy to Customize",
                            description:
                                "Tailor NoteNest to your needs. Change themes, add integrations, or build new features.",
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-violet-400 transition-all duration-300 shadow-sm"
                        >
                            <h3 className="text-xl font-semibold text-violet-600 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700">{feature.description}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Call to Action */}
                <section className="py-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold mb-4 text-gray-900"
                    >
                        Contribute to NoteNest
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-gray-600 mb-8"
                    >
                        Help us build the future of collaborative note-taking. Fork the repo, report issues, or suggest new features.
                    </motion.p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <Button
                            onClick={() =>
                                window.open("https://github.com/GauravOP-03/notenest", "_blank")
                            }
                            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-lg"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </Button>
                    </motion.div>
                </section>
            </main>
        </>
    );
}
