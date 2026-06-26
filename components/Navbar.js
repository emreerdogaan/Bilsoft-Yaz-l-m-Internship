import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  // Mobil menünün açılıp kapanmasını kontrol eden state
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Menüdeki aktif sayfayı belirlemek için url kontrolü yapıyoruz
  const isActive = (path) => router.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO BÖLÜMÜ */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Klasördeki logomuzu buraya çektim */}
              <img 
                src="/Bilsoft Logo.png" 
                alt="Bilsoft Logo" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
              <span className="text-xs font-bold text-neutral-400 border-l border-neutral-300 pl-2 tracking-wider uppercase hidden sm:inline-block">
                Blog
              </span>
            </Link>
          </div>

          {/* MENÜ LİNKLERİ (MASAÜSTÜ) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive("/") && !router.query.type
                  ? "text-brand-blue font-semibold border-b-2 border-brand-blue py-1" 
                  : "text-neutral-600 hover:text-brand-blue"
              }`}
            >
              Ana Sayfa
            </Link>
            
            <Link 
              href="/?type=blog" 
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                router.query.type === "blog" 
                  ? "text-brand-blue font-semibold border-b-2 border-brand-blue py-1" 
                  : "text-neutral-600 hover:text-brand-blue"
              }`}
            >
              Yazılar
            </Link>

            <Link 
              href="/?type=duyuru" 
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                router.query.type === "duyuru" 
                  ? "text-brand-blue font-semibold border-b-2 border-brand-blue py-1" 
                  : "text-neutral-600 hover:text-brand-blue"
              }`}
            >
              Duyurular
            </Link>

            <a 
              href="https://www.bilsoft.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-neutral-600 hover:text-brand-blue transition-colors duration-200 flex items-center gap-1"
            >
              Kurumsal Site
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* SAĞ TARAF BUTONLAR */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="text-xs font-semibold text-neutral-500 hover:text-brand-blue px-3 py-2 border border-neutral-300 rounded-lg hover:border-brand-blue transition-all"
            >
              Yönetici Girişi
            </Link>
            <a 
              href="https://www.bilsoft.com/tr/uye-kayit.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-orange hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              Ücretsiz Dene
            </a>
          </div>

          {/* MOBİL HAMBURGER BUTONU */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:text-brand-blue hover:bg-neutral-100 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {!isOpen ? (
                // Menü kapalıyken hamburger çizgileri
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                // Menü açıkken çarpı işareti
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBİL MENÜ İÇERİĞİ */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100 border-t border-neutral-100" : "max-h-0 opacity-0 overflow-hidden"}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive("/") && !router.query.type ? "bg-primary-50 text-brand-blue" : "text-neutral-700 hover:bg-neutral-50 hover:text-brand-blue"
            }`}
          >
            Ana Sayfa
          </Link>

          <Link
            href="/?type=blog"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              router.query.type === "blog" ? "bg-primary-50 text-brand-blue" : "text-neutral-700 hover:bg-neutral-50 hover:text-brand-blue"
            }`}
          >
            Yazılar
          </Link>

          <Link
            href="/?type=duyuru"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              router.query.type === "duyuru" ? "bg-primary-50 text-brand-blue" : "text-neutral-700 hover:bg-neutral-50 hover:text-brand-blue"
            }`}
          >
            Duyurular
          </Link>

          <a
            href="https://www.bilsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-brand-blue transition-colors"
          >
            Kurumsal Site
          </a>

          <div className="pt-4 pb-2 border-t border-neutral-100 mt-4 px-3 flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-semibold text-neutral-600 px-4 py-2.5 border border-neutral-300 rounded-lg hover:border-brand-blue hover:text-brand-blue transition-all"
            >
              Yönetici Girişi
            </Link>
            <a
              href="https://www.bilsoft.com/tr/uye-kayit.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-brand-orange hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Ücretsiz Dene
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
