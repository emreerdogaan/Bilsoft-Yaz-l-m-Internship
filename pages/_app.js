import "@/styles/globals.css";
import { Montserrat } from "next/font/google";

// Montserrat yazı tipini projeye dahil ediyoruz. 'subsets' ayarı ile Türkçe karakterlerin bozulmasını önlüyoruz.
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export default function App({ Component, pageProps }) {
  return (
    // Montserrat yazı tipini tüm sayfalar için varsayılan yapıyoruz.
    // dark:bg-neutral-950 ve dark:text-neutral-100 sınıfları karanlık modda arka plan ve metin renklerini ayarlar.
    <main className={`${montserrat.variable} font-sans min-h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-300`}>
      <Component {...pageProps} />
    </main>
  );
}
