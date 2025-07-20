import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "motion/react";
import Navbar from "./layout/Navbar";

export default function FAQSection() {
    return (
        <>
            <Navbar />

            <section className="py-16 px-4 bg-white">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-gray-900"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <p className="mt-4 text-gray-500">
                        Everything you need to know about using NoteNest.
                    </p>
                </div>

                <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
                    <AccordionItem value="q1" className="border border-muted rounded-xl">
                        <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-violet-600">
                            What is NoteNest?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            NoteNest is an AI-powered, open-source notes app that helps you create, share, and collaborate on notes seamlessly.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q2" className="border border-muted rounded-xl">
                        <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-violet-600">
                            Is NoteNest free to use?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Yes! NoteNest is completely free and open-source. You can use it, modify it, and even contribute to its development on GitHub.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q3" className="border border-muted rounded-xl">
                        <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-violet-600">
                            Can I collaborate with others in real-time?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Absolutely. You can invite others to edit notes with you in real-time. It also supports built-in chat for seamless collaboration.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q4" className="border border-muted rounded-xl">
                        <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-violet-600">
                            Can I host NoteNest on my own server?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Yes! Since NoteNest is open-source, you can self-host it on your own server or deploy it using platforms like Vercel or Render.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q5" className="border border-muted rounded-xl">
                        <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-violet-600">
                            Does NoteNest support voice and image notes?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Yes. You can upload images, record voice notes, and even transcribe them using built-in AI features.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="q6" className="border border-muted rounded-xl">
                        <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-violet-600">
                            How can I contribute to NoteNest?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Contributions are welcome! Visit the NoteNest GitHub repository to open issues, submit pull requests, or suggest new features.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </>
    );
}
