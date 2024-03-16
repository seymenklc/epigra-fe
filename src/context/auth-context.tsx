'use client'
import React from 'react'
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/utils/enums';
import { useAuthState } from 'react-firebase-hooks/auth';

type AuthContextType = {
   user: User | null | undefined;
   checkAuth: () => boolean;
}

export const AuthContext = React.createContext<AuthContextType | {}>({});

export const useAuthContext = () => {
   return React.useContext(AuthContext) as AuthContextType;
}

export function AuthContextProvider(props: Readonly<React.PropsWithChildren>) {
   const router = useRouter()
   const [user, loading] = useAuthState(auth)

   const checkAuth = () => {
      if (!user) {
         router.push(PageRoutes.Login);
         return false;
      }
      return true;
   }

   const contextValue = {
      user,
      checkAuth,
   }

   return (
      <AuthContext.Provider value={contextValue}>
         <LoadingOverlay visible={loading} />
         {!loading && props.children}
      </AuthContext.Provider>
   );
}