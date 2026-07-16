import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    // Sticky Footer Layout: CSS Flexbox (flex flex-col min-h-screen) ve flex-grow kuralları kullanılarak, 
    // sayfa içeriği dikey boyuttan kısa olsa bile Footer'ın viewport'un en altında kalması sağlanır.
    <div className="flex flex-col min-h-screen bg-neutral-100/50">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
