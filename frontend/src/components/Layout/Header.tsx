import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon, UserCircleIcon } from '@heroicons/react/16/solid'
import Link from "next/link";

export default function Header() {
  return (
    <header className="top-0 z-50 bg-gray shadow w-full bg-blue-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-600">
              Claim Test Cases Automation
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Build test case
            </Link>
            <Link href="/test-cases" className="text-gray-600 hover:text-blue-600 font-medium">
              Auto Test Cases
            </Link>
            <Link href="/add-test" className="text-gray-600 hover:text-blue-600 font-medium">
              Add auto test
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}