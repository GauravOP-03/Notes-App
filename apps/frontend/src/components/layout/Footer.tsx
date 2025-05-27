import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white/70 border-t py-4 sm:py-8 px-4 text-sm text-gray-600">
            <div className="max-w-7xl mx-auto flex flex-col sm:grid sm:grid-cols-4 gap-4 sm:gap-8">
                {/* Brand Info */}
                <div className="text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-gray-800">Notenest</h2>
                    <p className="mt-1 text-muted-foreground text-sm hidden sm:block">
                        AI-powered notes with seamless collaboration.
                    </p>
                </div>

                {/* Quick Links - hidden on small screens */}
                <div className="hidden sm:block">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/" className="hover:underline">Features</a></li>
                        <li><a href="/" className="hover:underline">About</a></li>
                        <li><a href="/" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Legal - hidden on small screens */}
                <div className="hidden sm:block">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Legal</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/" className="hover:underline">Terms of Service</a></li>
                        <li><a href="/" className="hover:underline">FAQ</a></li>
                    </ul>
                </div>

                {/* Socials */}
                <div className="flex justify-center sm:justify-start items-center space-x-4">
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

            <div className="mt-4 sm:mt-6 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Notenest. All rights reserved.
            </div>
        </footer>
    );
}
