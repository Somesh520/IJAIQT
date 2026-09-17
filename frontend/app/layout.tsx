import type { Metadata } from 'next'
import { Inter, Lora, Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-logo' })

export const metadata: Metadata = {
  title: 'College Research Journal',
  description: 'International Journal for Research and Development',
  icons: {
    icon: '/KIET-Logo.webp',
    shortcut: '/KIET-Logo.webp',
    apple: '/KIET-Logo.webp',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} ${montserrat.variable} font-sans bg-slate-50 text-slate-800 antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-white w-[1017px] mx-auto border-x border-b border-gray-300 shadow-md">
            <Navbar />
            {children}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
    // hey
  )
}
