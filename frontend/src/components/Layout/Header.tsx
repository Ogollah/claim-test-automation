import { useState } from 'react';
import Link from "next/link";
import {
  MenuIcon,
  XIcon,
  LayoutDashboard,
  ChevronDown,
  X,
  User2Icon,
  ClipboardList,
  FlaskConical,
  Wrench,
  Workflow,
  CircuitBoard,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileNavItems = [
    {
      name: 'Custom test form',
      href: '/',
      icon: ClipboardList,
    },
    {
      name: 'Automated test suite',
      href: '/test-cases',
      icon: FlaskConical,
    },
    {
      name: 'Simple test setup',
      href: '/add-test',
      icon: Wrench,
    },
    {
      name: 'Complex test builder',
      href: '/complex-cases',
      icon: Workflow,
    },
    {
      name: 'Complex test suite',
      href: '/complex-tests',
      icon: CircuitBoard,
    },
    {
      name: 'Sanity check',
      href: '/sanity-checks',
      icon: CheckCircle
    }
  ];

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
            {/* User Avatar */}
            <div className="flex items-center space-x-1 cursor-pointer hover:opacity-90">
              <User2Icon className='h-6 w-6 text-gray-500' />
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Navigation</h3>
              <Button
                onClick={() => setMenuOpen(false)}
                className="text-red-500 hover:text-red-700 bg-blue-50"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-500" />
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              {mobileNavItems.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3 text-gray-500" />
                  {name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}