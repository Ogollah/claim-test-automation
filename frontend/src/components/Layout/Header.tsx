import { useState, useEffect } from 'react';
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
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('test') === 'true' || process.env.NEXT_PUBLIC_TEST_MODE === 'true';

    if (testMode && status === 'unauthenticated' && !session) {
      setIsTesting(true);
      console.log('Auto-login for testing enabled');
    }
  }, [status, session]);

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

  // Mock session data for testing
  const testSession = {
    user: {
      name: 'Test User',
      email: 'test@example.com',
      image: null
    },
    expires: new Date(Date.now() + 3600 * 1000).toISOString()
  };

  const currentSession = isTesting ? testSession : session;

  return (
    <header className="top-0 z-50 bg-blue-100 w-full shadow">
      <nav className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <Link href="/" className="text-xl font-bold text-gray-700 hover:text-blue-600 transition">
              Claim & Benefit Test System (CBTS)
            </Link>
          </div>

          {currentSession && (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <h3 className="text-xl mb-4">Hello, {currentSession.user?.name || 'Admin user'}</h3>
                <div className="flex items-center space-x-1 cursor-pointer hover:opacity-90">
                  <User2Icon className='h-6 w-6 text-gray-500' />
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                  <Button
                    onClick={() => isTesting ? setIsTesting(false) : signOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    {isTesting ? 'Exit Test Mode' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {!currentSession && status === 'unauthenticated' && (
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => signIn("keycloak")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Sign In with Keycloak
              </Button>
              {/* Test login button */}
              <Button
                onClick={() => setIsTesting(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Test Login
              </Button>
            </div>
          )}

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

              {/* Test login option in mobile menu */}
              {!currentSession && (
                <button
                  onClick={() => setIsTesting(true)}
                  className="flex items-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors w-full"
                >
                  <CheckCircle className="h-5 w-5 mr-3" />
                  Test Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


