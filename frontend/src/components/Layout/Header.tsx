import { useState } from 'react';
import Link from "next/link";
import { MenuIcon, X, XIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="top-0 z-50 bg-blue-50 w-full shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-600">
              Claim Test Automation
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Build case
            </Link>
            <Link href="/test-cases" className="text-gray-600 hover:text-blue-600 font-medium">
              Test Cases
            </Link>
            <Link href="/add-test" className="text-gray-600 hover:text-blue-600 font-medium">
              Add test
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

          {menuOpen && (
          <div className="md:hidden mt-2 relative bg-blue-50 p-4 shadow rounded">
            {/* Cancel Button Top-Right */}
            <div className="flex justify-end">
              <Button
                onClick={() => setMenuOpen(false)}
                className="text-red-500 hover:text-red-700 font-bold text-lg bg-blue-50"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-500" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="mt-2 space-y-2">
              <Link
                href="/"
                className="block text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Build test case
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
                Add auto test
              </Link>
            </div>
          </div>
          )}
      </nav>
    </header>
  );
}
