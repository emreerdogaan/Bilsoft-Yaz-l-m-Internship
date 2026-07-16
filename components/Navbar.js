import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  // Karanlık mod durumunu (true/false) hafızada tutan state.
  const [darkMode, setDarkMode] = useState(false);

  // Sayfa tarayıcıda ilk yüklendiğinde kullanıcının daha önceki tema tercihini kontrol eder.
  useEffect(() => {
    // Tarayıcı hafızasından (localStorage) kayıtlı temayı okuyoruz.
    const kayitliTema = localStorage.getItem("theme");
    // Kullanıcının bilgisayar/telefon sistemindeki karanlık tema ayarını kontrol ediyoruz.
    const sistemKaranlikMi = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Eğer önceden karanlık tema seçilmişse ya da sistem ayarı karanlık ise aktifleştiriyoruz.
    if (kayitliTema === "dark" || (!kayitliTema && sistemKaranlikMi)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark"); // HTML etiketine "dark" sınıfını ekleyerek temayı karanlık yapar.
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []); // Boş dizi koyarak bu kontrolün sadece sayfa ilk açıldığında 1 kez çalışmasını sağlıyoruz.

  // Tema değiştirici buton tıklandığında çalışır ve seçimi tarayıcı hafızasına kaydeder.
  const temayiDegistir = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO BÖLÜMÜ */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/Bilsoft Logo.png" 
                alt="Bilsoft Logo" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
              <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 border-l border-neutral-300 dark:border-neutral-700 pl-2 tracking-wider uppercase hidden sm:inline-block">
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
                  ? "text-brand-blue dark:text-brand-orange font-semibold border-b-2 border-brand-blue dark:border-brand-orange py-1" 
                  : "text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange"
              }`}
            >
              Ana Sayfa
            </Link>
            
            <Link 
              href="/?type=blog" 
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                router.query.type === "blog" 
                  ? "text-brand-blue dark:text-brand-orange font-semibold border-b-2 border-brand-blue dark:border-brand-orange py-1" 
                  : "text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange"
              }`}
            >
              Yazılar
            </Link>

            <Link 
              href="/?type=duyuru" 
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                router.query.type === "duyuru" 
                  ? "text-brand-blue dark:text-brand-orange font-semibold border-b-2 border-brand-blue dark:border-brand-orange py-1" 
                  : "text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange"
              }`}
            >
              Duyurular
            </Link>

            <a 
              href="https://www.bilsoft.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange transition-colors duration-200 flex items-center gap-1"
            >
              Kurumsal Site
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* SAĞ TARAF BUTONLAR (MASAÜSTÜ) */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Tema Değiştirici Buton */}
            <button
              onClick={temayiDegistir}
              className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer"
              title={darkMode ? "Aydınlık moda geç" : "Karanlık moda geç"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link 
              href="/admin" 
              className="text-xs font-semibold text-neutral-500 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-brand-blue dark:hover:border-brand-orange transition-all"
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

          {/* MOBİL HIZLI İKONLAR VE HAMBURGER BUTONU */}
          <div className="flex items-center gap-2 md:hidden">
            
            <button
              onClick={temayiDegistir}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer"
              title={darkMode ? "Aydınlık moda geç" : "Karanlık moda geç"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-brand-blue dark:hover:text-brand-orange hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBİL AÇILIR MENÜ */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100 border-t border-neutral-100 dark:border-neutral-800" : "max-h-0 opacity-0 overflow-hidden"}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white dark:bg-neutral-900 shadow-lg">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive("/") && !router.query.type 
                ? "bg-primary-50 dark:bg-primary-950/40 text-brand-blue dark:text-brand-orange font-semibold" 
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-brand-blue dark:hover:text-brand-orange"
            }`}
          >
            Ana Sayfa
          </Link>

          <Link
            href="/?type=blog"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              router.query.type === "blog" 
                ? "bg-primary-50 dark:bg-primary-950/40 text-brand-blue dark:text-brand-orange font-semibold" 
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-brand-blue dark:hover:text-brand-orange"
            }`}
          >
            Yazılar
          </Link>

          <Link
            href="/?type=duyuru"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              router.query.type === "duyuru" 
                ? "bg-primary-50 dark:bg-primary-950/40 text-brand-blue dark:text-brand-orange font-semibold" 
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-brand-blue dark:hover:text-brand-orange"
            }`}
          >
            Duyurular
          </Link>

          <a
            href="https://www.bilsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-brand-blue dark:hover:text-brand-orange transition-colors"
          >
            Kurumsal Site
          </a>

          <div className="pt-4 pb-2 border-t border-neutral-100 dark:border-neutral-800 mt-4 px-3 flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300 px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-brand-blue dark:hover:border-brand-orange hover:text-brand-blue dark:hover:text-brand-orange transition-all"
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
