import { useState } from 'react';
import Link from "next/link";
import {
  MenuIcon,
  XIcon,
  LayoutDashboard,
  ChevronDown,
  X,
  User2Icon,
} from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="top-0 z-50 bg-blue-100 w-full shadow">
      <nav className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand with icon */}
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <Link href="/" className="text-xl font-bold text-gray-700 hover:text-blue-600 transition">
              Claim & Benefit Test System (CBTS) 
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Custom Test
            </Link>
            <Link href="/test-cases" className="text-gray-600 hover:text-blue-600 font-medium">
              Test Cases
            </Link>
            <Link href="/add-test" className="text-gray-600 hover:text-blue-600 font-medium">
              Add Test
            </Link> */}

            {/* User Avatar */}
            <div className="flex items-center space-x-1 cursor-pointer hover:opacity-90">
              <User2Icon className='h-6 w-6 text-gray-500'/>
              {/* <Image
                src="/avatar.png" // Make sure this exists in your `public/` folder
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full border border-gray-300"
              /> */}
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 relative bg-blue-50 p-4 shadow rounded">
            <div className="flex justify-end">
              <Button
                onClick={() => setMenuOpen(false)}
                className="text-red-500 hover:text-red-700 font-bold text-lg bg-blue-50"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-500" />
              </Button>
            </div>

            <div className="mt-2 space-y-2">
              <Link
                href="/"
                className="block text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Build Test Case
              </Link>
              <Link
                href="/test-cases"
                className="block text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Auto Test Cases
              </Link>
              <Link
                href="/add-test"
                className="block text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Add Test Case
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
