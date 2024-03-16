import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import "./globals.css";
import { Roboto } from "next/font/google";
import React from 'react'
import BaseProvider from "./_components/providers/base-provider";
import BaseLayout from "./_components/layouts/base-layout";
import { ColorSchemeScript } from "@mantine/core";
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time Tracker App',
}

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`h-screen font-sans ${roboto.variable}`}>
        <BaseProvider>
          <BaseLayout>
            {props.children}
          </BaseLayout>
        </BaseProvider>
      </body>
    </html>
  );
}
