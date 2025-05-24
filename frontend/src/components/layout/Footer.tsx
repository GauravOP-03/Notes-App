import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white/70 border-t py-10 px-4 text-sm text-gray-600">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand Info */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Notenest</h2>
                    <p className="mt-2 text-muted-foreground">
                        The next-generation AI-powered collaborative note-taking platform that transforms how you capture, organize, and share ideas with seamless real-time collaboration.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Quick Links</h3>
                    <ul className="space-y-1">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/" className="hover:underline">Features</a></li>
                        <li><a href="/" className="hover:underline">About</a></li>
                        <li><a href="/" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Legal</h3>
                    <ul className="space-y-1">
                        <li><a href="/" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/" className="hover:underline">Terms of Service</a></li>
                        <li><a href="/" className="hover:underline">FAQ</a></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Connect</h3>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Notely. All rights reserved.
            </div>
        </footer>
    );
}
