"use client"
import { AuthContextProvider } from "@/context/auth-context";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function BaseProvider({ children }: Readonly<React.PropsWithChildren>) {
   return (
      <MantineProvider withGlobalClasses withCssVariables>
         <AuthContextProvider>
            <Notifications />
            {children}
         </AuthContextProvider>
      </MantineProvider>
   )
}