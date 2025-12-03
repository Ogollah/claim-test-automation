import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  CheckCircle,
  Wrench,
  FlaskConical,
  ClipboardList,
  File,
  UploadCloudIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/schedule",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Custom builder",
          icon: ClipboardList,
          submenus: [
            {
              href: "/",
              label: "Custom test form"
            },
            {
              href: "/complex-cases",
              label: "Complex test builder"
            }
          ]
        },
        {
          href: "",
          label: "Automated test suite",
          icon: FlaskConical,
          submenus: [
            {
              href: "/test-cases",
              label: "All test suite"
            },
            {
              href: "/complex-tests",
              label: "Complex test suite"
            }
          ]
        },
        {
          href: "",
          label: "Bulk upload",
          icon: UploadCloudIcon,
          submenus: [
            {
              href: "/upload-preauth",
              label: "Upload preauth-claim"
            },
            // {
            //   href: "/history",
            //   label: "History"
            // }
          ]
        },
        {
          href: "",
          label: "Package",
          icon: File,
          submenus: [
            {
              href: "/manage-packages",
              label: "Manage packages"
            },
            {
              href: "/manage-interventions",
              label: "Manage interventions"
            }
          ]
        },
        {
          href: "/add-test",
          label: "Simple test setup",
          icon: Wrench
        },
        {
          href: "/sanity-checks",
          label: "Sanity check",
          icon: CheckCircle
        },
        {
          href: "/schedule",
          label: "Test Automation Dashboard",
          icon: Tag
        }
      ]
    },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "/users",
    //       label: "Users",
    //       icon: Users
    //     },
    //     {
    //       href: "/account",
    //       label: "Account",
    //       icon: Settings
    //     }
    //   ]
    // }
  ];
}
