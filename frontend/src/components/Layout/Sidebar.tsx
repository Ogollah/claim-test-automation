// import {
//   ClipboardList,
//   FlaskConical,
//   Workflow,
//   Wrench,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   CircuitBoard,
//   Home,
// } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const navItems = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: 'Custom test form',
//     url: '/',
//     icon: ClipboardList,
//   },
//   {
//     title: 'Automated test suite',
//     url: '/test-cases',
//     icon: FlaskConical,
//   },
//   {
//     title: 'Simple test setup',
//     url: '/add-test',
//     icon: Wrench,
//   },
//   {
//     title: 'Complex test builder',
//     url: '/complex-cases',
//     icon: Workflow,
//   },
//   {
//     title: 'Complex test suite',
//     url: '/complex-tests',
//     icon: CircuitBoard,
//   },
//   {
//     title: 'Sanity check',
//     url: '/sanity-checks',
//     icon: CheckCircle
//   }
// ];

// export default function LeftSidebar() {
//   const pathname = usePathname();

//   // const [isCollapsed, setIsCollapsed] = useState(false);

//   // const toggleSidebar = () => {
//   //   setIsCollapsed(!isCollapsed);
//   // };

//   // return (
//   //   <div className="hidden md:flex md:flex-shrink-0 bg-blue-500 h-auto">
//   //     <div className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-50'} border-r border-gray-100 bg-blue-100 transition-all duration-300 ease-in-out`}>
//   //       <div className="flex justify-end p-2">
//   //         <button
//   //           onClick={toggleSidebar}
//   //           className="p-1 rounded-md hover:bg-gray-200 transition-colors"
//   //           aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//   //         >
//   //           {isCollapsed ? (
//   //             <ChevronRight className="h-4 w-4 text-gray-600" />
//   //           ) : (
//   //             <ChevronLeft className="h-4 w-4 text-gray-600" />
//   //           )}
//   //         </button>
//   //       </div>

//   //       <div className="h-0 flex-1 flex flex-col pt-2 pb-4 overflow-y-auto">
//   //         <nav className="flex-1 px-1 space-y-1">
//   //           {navItems.map(({ name, href, icon: Icon }) => {
//   //             const isActive = pathname === href;

//   //             return (
//   //               <Link
//   //                 key={href}
//   //                 href={href}
//   //                 className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all ${isActive
//   //                   ? 'bg-gray-100 text-gray-900'
//   //                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//   //                   } ${isCollapsed ? 'justify-center' : ''}`}
//   //                 title={isCollapsed ? name : undefined}
//   //               >
//   //                 <Icon
//   //                   className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'} transition-all ${isActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-500'
//   //                     }`}
//   //                 />
//   //                 {!isCollapsed && name}
//   //                 {isCollapsed && (
//   //                   <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//   //                     {name}
//   //                   </span>
//   //                 )}
//   //               </Link>
//   //             );
//   //           })}
//   //         </nav>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <Sidebar>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Claim & benefit test system (CBTS)</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }