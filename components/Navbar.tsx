"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CloudUpload, ChevronDown, User, Menu, X, Sparkles, Folder, LogOut } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useState, useEffect, useRef } from "react";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const { isSignedIn, user: clerkUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  const activeUser = user || (clerkUser ? {
    id: clerkUser.id,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    username: clerkUser.username,
    emailAddress: clerkUser.primaryEmailAddress?.emailAddress,
  } : null);

  const userDetails = {
    fullName: activeUser
      ? `${activeUser.firstName || ""} ${activeUser.lastName || ""}`.trim()
      : "",
    initials: activeUser
      ? `${activeUser.firstName || ""} ${activeUser.lastName || ""}`
          .trim()
          .split(" ")
          .map((name) => name?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName: activeUser
      ? activeUser.firstName && activeUser.lastName
        ? `${activeUser.firstName} ${activeUser.lastName}`
        : activeUser.firstName || activeUser.username || activeUser.emailAddress || "User"
      : "User",
    email: activeUser?.emailAddress || "",
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800 shadow-lg shadow-black/40"
          : "bg-zinc-950/60 backdrop-blur-md border-b border-zinc-800/60"
      }`}
    >
      <div className="container mx-auto py-3.5 px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <CloudUpload className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-100 group-hover:text-primary transition-colors">
              Syncstack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-3 items-center">
            {!isSignedIn ? (
              <>
                <Link href="/sign-in">
                  <Button variant="light" className="text-zinc-300 hover:text-white font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    color="primary"
                    variant="solid"
                    className="font-medium shadow-md shadow-primary/20"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {!isOnDashboard && (
                  <Link href="/dashboard">
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="font-medium bg-primary/10 border border-primary/20 text-primary"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-900 border border-zinc-800/80 transition-all cursor-pointer focus:outline-none">
                      <Avatar
                        name={userDetails.initials}
                        size="sm"
                        src={activeUser?.imageUrl || undefined}
                        className="h-8 w-8 text-xs border border-zinc-700"
                        fallback={<User className="h-4 w-4" />}
                      />
                      <span className="text-xs font-medium text-zinc-200 hidden lg:inline max-w-[120px] truncate pr-1">
                        {userDetails.displayName}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-400 mr-1.5" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="User actions"
                    className="w-56"
                    classNames={{
                      base: "border border-zinc-800 bg-zinc-950/95 shadow-xl backdrop-blur-xl",
                    }}
                  >
                    <DropdownItem
                      key="profile"
                      description={userDetails.email || "Account settings"}
                      onClick={() => router.push("/dashboard?tab=profile")}
                      startContent={<User className="h-4 w-4 text-zinc-400" />}
                    >
                      Profile Settings
                    </DropdownItem>
                    <DropdownItem
                      key="files"
                      description="View all uploaded files"
                      onClick={() => router.push("/dashboard")}
                      startContent={<Folder className="h-4 w-4 text-zinc-400" />}
                    >
                      My Storage
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      description="Sign out of Syncstack"
                      className="text-danger"
                      color="danger"
                      onClick={handleSignOut}
                      startContent={<LogOut className="h-4 w-4 text-danger" />}
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              className="p-2 rounded-xl text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-2xl px-6 py-5 space-y-4">
          {!isSignedIn ? (
            <div className="flex flex-col gap-2.5">
              <Link href="/sign-in" className="w-full">
                <Button variant="bordered" className="w-full border-zinc-700 text-zinc-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" className="w-full">
                <Button color="primary" variant="solid" className="w-full font-medium">
                  Get Started Free
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <Avatar
                  name={userDetails.initials}
                  size="sm"
                  src={activeUser?.imageUrl || undefined}
                  className="h-10 w-10 text-xs"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-100 truncate">
                    {userDetails.displayName}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {userDetails.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Button
                  variant="light"
                  className="w-full justify-start text-zinc-300"
                  onClick={() => {
                    router.push("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  startContent={<Folder className="h-4 w-4" />}
                >
                  My Storage
                </Button>
                <Button
                  variant="light"
                  className="w-full justify-start text-zinc-300"
                  onClick={() => {
                    router.push("/dashboard?tab=profile");
                    setIsMobileMenuOpen(false);
                  }}
                  startContent={<User className="h-4 w-4" />}
                >
                  Profile Settings
                </Button>
                <Button
                  variant="light"
                  color="danger"
                  className="w-full justify-start text-danger"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  startContent={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
