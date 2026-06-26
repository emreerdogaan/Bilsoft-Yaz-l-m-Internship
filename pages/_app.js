import "@/styles/globals.css";
import { Montserrat } from "next/font/google";

// Kurumsal font olarak Montserrat seçtik, Türkçe karakterler bozulmasın diye latin-ext ekledim.
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export default function App({ Component, pageProps }) {
  return (
    // font-sans class'ını ekleyerek tüm sitenin bu fontu kullanmasını sağladım.
    <main className={`${montserrat.variable} font-sans min-h-screen bg-neutral-50 text-neutral-800`}>
      <Component {...pageProps} />
    </main>
  );
}
