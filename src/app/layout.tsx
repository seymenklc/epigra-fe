"use client"
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Inter } from "next/font/google";
import { Notifications } from '@mantine/notifications';
import { ColorSchemeScript, LoadingOverlay, MantineProvider } from '@mantine/core';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase-config";
import { usePathname, useRouter } from "next/navigation";
import { unstable_noStore } from "next/cache";
import React from 'react'
import { PageRoutes } from "@/lib/enums";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const authRoutes = [PageRoutes.Login, PageRoutes.Register]

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  unstable_noStore();

  const [userSession, setUserSession] = React.useState<string | null>(null);

  const router = useRouter()
  const pathname = usePathname()
  const [user, loading] = useAuthState(auth);

  React.useEffect(() => {
    setUserSession(sessionStorage.getItem('user'))
  }, [])

  if (!loading && !user && !userSession) {
    router.push(PageRoutes.Login)
  }

  if (!loading && user && userSession && authRoutes.includes(pathname as PageRoutes)) {
    router.push(PageRoutes.Home)
  }

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={`h-screen font-sans ${inter.variable}`}>
        <MantineProvider withGlobalClasses withCssVariables defaultColorScheme="dark">
          <Notifications />
          <LoadingOverlay visible={loading} zIndex={1000} />
          {!loading && children}
        </MantineProvider>
      </body>
    </html>
  );
}
