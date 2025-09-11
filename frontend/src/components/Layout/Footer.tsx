import Link from "next/link";
import {
    LayoutDashboard,
    Github,
    Mail,
    FileText,
    HelpCircle,
    ExternalLink
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-auto bottom-0 w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> */}
            {/* <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <LayoutDashboard className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-bold text-gray-700">
                                Claim & Benefit Test System (CBTS)
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm max-w-md mb-4">
                            A comprehensive testing platform for healthcare claims and benefits validation.
                            Ensure compliance and accuracy with our suite of testing tools.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                aria-label="Contact"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                aria-label="Documentation"
                            >
                                <FileText className="h-5 w-5" />
                            </a>
                        </div>
                    </div> */}

            {/* Quick Links */}
            {/* <div>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                            Testing Tools
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Custom Test Form
                                </Link>
                            </li>
                            <li>
                                <Link href="/test-cases" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Automated Test Suite
                                </Link>
                            </li>
                            <li>
                                <Link href="/add-test" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Simple Test Setup
                                </Link>
                            </li>
                            <li>
                                <Link href="/sanity-checks" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Sanity Checks
                                </Link>
                            </li>
                        </ul>
                    </div> */}

            {/* Support */}
            {/* <div>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2"> */}
            {/* <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    Tutorials
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    API Reference
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm flex items-center transition-colors">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    Contact Support
                                </a>
                            </li> */}
            {/* </ul>
                    </div>
                </div> */}

            {/* Bottom section */}
            <div className="mt-8 pt-6 border-t border-blue-200 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500 text-xs">
                    © {new Date().getFullYear()} Claim & Benefit Test System. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="text-gray-500 hover:text-blue-600 text-xs transition-colors">
                        Privacy Policy
                    </a>
                    {/* <a href="#" className="text-gray-500 hover:text-blue-600 text-xs transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 text-xs transition-colors">
                            Cookie Policy
                        </a> */}
                </div>
            </div>
            {/* </div> */}
        </footer>
    );
}