import { HomeIcon, DocumentTextIcon, ChartBarIcon, CogIcon } from '@heroicons/react/16/solid';
import { PlusCircleIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="hidden md:flex md:flex-shrink-0 bg-blue-50 h-auto">
            <div className="flex flex-col w-64 border-r border-gray-100 bg-blue-50">
                <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <nav className="flex-1 px-1 space-y-1">
                        <Link
                            href="/"  
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                pathname === "/" ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <HomeIcon className="mr-3 h-6 w-6 text-gray-500" />
                            Build test
                        </Link>
                        
                        <Link
                            href="/test-cases"
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                pathname === "/test-cases"
                                ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <DocumentTextIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                            Test Cases
                        </Link>

                        <Link
                            href="/add-test"
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                pathname === "/add-test"
                                ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <PlusCircleIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                            Add test
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
