import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
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
          href: "/dashboard",
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
          icon: SquarePen,
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
          icon: SquarePen,
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
          href: "/add-test",
          label: "Simple test setup",
          icon: Bookmark
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
