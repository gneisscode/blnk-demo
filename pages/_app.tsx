import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'sonner';
import { Onest } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';

const onest = Onest({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div className={onest.className}>
      <header className="bg-black-main/95 backdrop-blur-sm border-b border-yellow-main/20 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="text-2xl font-bold text-yellow-main hover:text-yellow-main/90 transition-colors duration-200">
              WMS
            </Link>
            <div className="flex space-x-8">
              <Link 
                href="/" 
                className={`text-lg font-medium transition-colors duration-200 h-10 flex items-center ${
                  router.pathname === "/" 
                    ? "text-yellow-main bg-yellow-main/10 px-4 rounded-md" 
                    : "text-yellow-main hover:text-yellow-main/90 px-4"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/wallets/list" 
                className={`text-lg font-medium transition-colors duration-200 h-10 flex items-center ${
                  router.pathname.startsWith("/wallets") 
                    ? "text-yellow-main bg-yellow-main/10 px-4 rounded-md" 
                    : "text-yellow-main hover:text-yellow-main/90 px-4"
                }`}
              >
                Wallets
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <Component {...pageProps} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
