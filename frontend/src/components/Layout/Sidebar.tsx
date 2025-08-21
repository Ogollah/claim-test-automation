import {
  ClipboardList,
  FlaskConical,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
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
    name: 'Test setup',
    href: '/add-test',
    icon: Wrench,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0 bg-blue-500 h-auto">
      <div className="flex flex-col w-64 border-r border-gray-100 bg-blue-100">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-1 space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-all ${
                      isActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
