"use client";
import './globals.css'
import { useEffect, useState } from 'react';
import cookie from "js-cookie";
import { Case, Switch } from '@/components/SwitchCase';
import Login from '@/pages/Login';
import Panel from '@/pages/Panel';
import AuthService from '@/services/AuthService';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   if (!cookie.get("token")) setCurrentPage(0);
  //   else setCurrentPage(1);
  // }, []);

  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API}/panel/@me`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": cookie.get("token")!
  //     }
  //   }).then(async (res) => {
  //     const data = await res.json();

  //     if (res.ok) {
  //       setUser(data);
  //       setCurrentPage(1);
  //     } else setCurrentPage(0);
  //   })
  // }, [currentPage]);

  useEffect(() => {
    const handleContextMenu = (event: Event) => {
      event.preventDefault();
    }

    document.addEventListener("contextmenu", handleContextMenu);

    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <html lang="en">
      <body className='w-[100w] h-[100vh] bg-neutral-900 text-white'>
        <AuthService>
          <>
            {children}
          </>
        </AuthService>
      </body>
    </html>
  )
}
