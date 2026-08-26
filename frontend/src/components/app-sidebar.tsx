import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserAuth } from "@/context/AuthContext";

const data = {
  user: {
    name: "Chronos Support",
    email: "support@chronos.io",
    avatar: "/avatars/chronos.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: <FolderIcon />,
    },
    {
      title: "My Account",
      url: "/account",
      icon: <UsersIcon />,
    },
  ],
  navClouds: [
    {
      title: "Open Tickets",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        { title: "New Requests", url: "#" },
        { title: "Unassigned", url: "#" },
      ],
    },
    {
      title: "In Progress",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        { title: "Escalations", url: "#" },
        { title: "Pending Review", url: "#" },
      ],
    },
    {
      title: "Resolved",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        { title: "Closed Today", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Preferences",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Support Center",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search Tickets",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Knowledge Base",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Ticket Reports",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Templates",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = UserAuth();

  const getProfile = async () => {
    const response = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading profile</p>;
  }

  if (!profile) {
    return <p>Profile data could not be loaded.</p>;
  }
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:cursor-pointer"
              render={<Link to="/" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Chronos Desk</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
    </Sidebar>
  );
}
