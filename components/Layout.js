import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    // min-h-screen kullanarak sayfa içeriği az olsa bile footer'ın en alta yapışmasını sağladım
    <div className="flex flex-col min-h-screen bg-neutral-100/50">
      
      {/* Sayfa başlığı (Navbar) */}
      <Navbar />
      
      {/* Dinamik gelen sayfa içeriği */}
      {/* flex-grow ekledim ki orta kısım uzasın, footer aşağıda kalsın */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Sayfa altlığı (Footer) */}
      <Footer />
      
    </div>
  );
}
