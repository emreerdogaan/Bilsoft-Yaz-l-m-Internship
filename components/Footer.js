import Link from "next/link";

export default function Footer() {
  return (
    // Kılavuzdaki koyu siyah tonunu (bg-brand-black) kullandım
    <footer className="bg-brand-black text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Alt menü 4 kolonlu grid yapısı */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo ve Hakkında Yazısı */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              {/* Beyaz logoyu kullandım arka plan koyu olduğu için */}
              <img 
                src="/Bilsoft Logo Beyaz.png" 
                alt="Bilsoft Logo Beyaz" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Bilsoft Yazılım, KOBİ'ler için ön muhasebe ve e-Dönüşüm çözümleri üreten, Düzce merkezli bir teknoloji firmasıdır.
            </p>
          </div>

          {/* Sayfa Bağlantıları */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-neutral-800">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors duration-200 block">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/?type=blog" className="hover:text-brand-orange transition-colors duration-200 block">
                  Blog Yazıları
                </Link>
              </li>
              <li>
                <Link href="/?type=duyuru" className="hover:text-brand-orange transition-colors duration-200 block">
                  Duyuru & Kampanyalar
                </Link>
              </li>
              <li>
                <a href="https://www.bilsoft.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors duration-200 block">
                  Kurumsal Web Sitesi
                </a>
              </li>
            </ul>
          </div>

          {/* Adres ve Telefon */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-neutral-800">
              İletişim
            </h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Fatih Mahallesi, 81010 Merkez / Düzce</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:08503020030" className="hover:text-brand-orange transition-colors">0850 302 00 30</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@bilsoft.com" className="hover:text-brand-orange transition-colors">info@bilsoft.com</a>
              </li>
            </ul>
          </div>

          {/* Bülten Kayıt Formu */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-neutral-800">
              E-Bülten
            </h4>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              En yeni teknoloji haberleri ve ön muhasebe tüyolarından haberdar olun.
            </p>
            <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="bg-neutral-800/80 border border-neutral-700/60 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange placeholder-neutral-500 transition-colors w-full"
              />
              <button 
                type="submit" 
                className="bg-brand-orange hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer w-full"
              >
                Abone Ol
              </button>
            </form>
          </div>

        </div>

        {/* En alt telif ve sosyal medya satırı */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Bilsoft Yazılım A.Ş. Tüm Hakları Saklıdır.
          </p>
          <div className="flex space-x-6">
            <a href="https://facebook.com/bilsoftyazilim" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Facebook</a>
            <a href="https://twitter.com/bilsoftyazilim" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Twitter</a>
            <a href="https://instagram.com/bilsoftyazilim" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Instagram</a>
            <a href="https://linkedin.com/company/bilsoftyazilim" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
