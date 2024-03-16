"use client"
import { useAuthContext } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import React from 'react'
import { Burger, Button, Drawer, Menu, rem } from "@mantine/core";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { PageRoutes } from "@/utils/enums";
import { IconLogout } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";

export default function Navbar() {
   const pathname = usePathname()
   const { user } = useAuthContext()
   const [burgerMenuOpened, { toggle: toggleBurgerMenu, close: closeBurgerMenu }] = useDisclosure(false);

   const handleLogout = React.useCallback(async () => {
      await signOut(auth);
      if (burgerMenuOpened) {
         closeBurgerMenu()
      }
   }, [burgerMenuOpened, closeBurgerMenu])

   React.useEffect(() => {
      closeBurgerMenu()
   }, [closeBurgerMenu, pathname])

   return (
      <header className="flex items-center h-16 border-b border-b-gray-300 shrink-0">
         <nav className="space-x-4 flex">
            <Link href={PageRoutes.Home}>
               <h1 className="text-2xl md:text-3xl font-bold">
                  ⌛ Time Tracker
               </h1>
            </Link>
         </nav>
         <Burger
            size={24}
            opened={burgerMenuOpened}
            onClick={toggleBurgerMenu}
            className="block ml-auto sm:hidden"
         />
         <div className="ml-auto items-center gap-4 hidden sm:flex">
            {!user && (
               <React.Fragment>
                  <Link href={PageRoutes.Home}>
                     <Button>
                        Home
                     </Button>
                  </Link>
                  <Link href={PageRoutes.Login}>
                     <Button variant="outline">
                        Login
                     </Button>
                  </Link>
               </React.Fragment>
            )}
            {user && (
               <Menu shadow="md" width={200}>
                  <Menu.Target>
                     <Button size="sm" variant="outline">
                        Hello, {user.displayName}
                     </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                     <Menu.Item
                        onClick={handleLogout}
                        leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
                     >
                        Logout
                     </Menu.Item>
                  </Menu.Dropdown>
               </Menu>
            )}
         </div>
         <Drawer
            position="bottom"
            opened={burgerMenuOpened}
            onClose={toggleBurgerMenu}
            title={user ? `Hello, ${user.displayName}` : "⌛ Time Tracker"}
         >
            <div className="flex flex-col gap-4">
               {!user && (
                  <React.Fragment>
                     <Link href={PageRoutes.Home}>
                        <Button variant="link" fullWidth>
                           Home
                        </Button>
                     </Link>
                     <Link href={PageRoutes.Login}>
                        <Button fullWidth>
                           Login
                        </Button>
                     </Link>
                  </React.Fragment>
               )}
               {user && (
                  <Button
                     fullWidth
                     variant="outline"
                     color="red"
                     onClick={handleLogout}
                     leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} />}
                  >
                     Logout
                  </Button>
               )}
            </div>
         </Drawer>
      </header>
   )
}