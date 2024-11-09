"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Donate", href: "/donate" },
  { name: "Contact", href: "/contact" },
  { name: "Tiffin", href: "/tiffin" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-start lg:w-1/4">
            <Link href="/">
              <span className="sr-only">Purushottam Sevashram Foundation </span>
              <Image
                width={250}
                height={150}
                src="/logo.svg"
                className="md:h-20"
                alt="PS Foundation Logo"
              />
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-600"
                >
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <Image 
                  src="/logo.svg" 
                  alt="PS Foundation Logo"
                  className="mb-4"
                  width={300}
                  height={300}
                  />
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="hidden md:flex flex-1 justify-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block lg:w-1/4"></div>
        </div>
      </div>
    </header>
  );
}
