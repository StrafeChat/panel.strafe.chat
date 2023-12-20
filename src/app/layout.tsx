import './globals.css'
import AuthService from '@/services/AuthService';
import { UserProvider } from '@/context/UserContext';
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className='w-[100w] h-[100vh]'>
        <UserProvider>
          <AuthService>
            <>{children}</>
          </AuthService>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  )
}
