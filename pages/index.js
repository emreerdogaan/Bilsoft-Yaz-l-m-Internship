import { useState, useMemo } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { getSortedPostsData } from "@/utils/posts";

// getStaticProps ile markdown dosyalarını build sırasında bir kez okuyup sayfaya gönderiyoruz
export async function getStaticProps() {
  const allPosts = getSortedPostsData();
  return {
    props: {
      allPosts,
    },
  };
}

export default function Home({ allPosts }) {
  // Filtreleme için seçilen tür ve kategoriyi state'te tutuyorum
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'blog' | 'duyuru'
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 1. Yazıların içindeki kategorileri çekip benzersiz bir liste oluşturuyoruz
  const categories = useMemo(() => {
    const list = new Set();
    allPosts.forEach((post) => {
      if (post.category) {
        list.add(post.category);
      }
    });
    return ["all", ...Array.from(list)];
  }, [allPosts]);

  // 2. Seçilen tür (blog, duyuru) veya kategoriye göre yazıları süzüyoruz
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const typeMatch = selectedType === "all" || post.type === selectedType;
      const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;
      return typeMatch && categoryMatch;
    });
  }, [allPosts, selectedType, selectedCategory]);

  return (
    // Sayfayı Navbar ve Footer içeren Layout bileşeni ile sardım
    <Layout>
      <Head>
        <title>Bilsoft Yazılım | Bilgi Bankası, Blog ve Duyurular</title>
        <meta name="description" content="Bilsoft Yazılım ön muhasebe, e-Dönüşüm ve KOBİ dijitalleşme süreçlerine dair en güncel rehberler, blog yazıları ve kampanyalar." />
        <meta name="keywords" content="bilsoft, ön muhasebe, e-fatura, e-defter, blog, duyuru, muhasebe rehberi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Üst Kısım: Degrade Arka Planlı Karşılama Alanı */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue to-primary-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Sağlı sollu gölgeli arka plan yuvarlakları ekledim */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="bg-brand-orange/20 text-brand-orange border border-brand-orange/40 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
            Bilsoft Bilgi Merkezi
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Gelişiminizi Dijitalde <br className="hidden sm:inline" />
            <span className="text-brand-orange">Takip Edin</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-200 max-w-2xl mx-auto leading-relaxed font-light">
            Ön muhasebe, e-Dönüşüm ve işletme yönetimi süreçlerinde rehber niteliğindeki makalelerimiz, resmi duyurularımız ve özel tekliflerimiz.
          </p>
        </div>
      </section>

      {/* Orta Kısım: Filtreler ve Grid Listesi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Filtre Barı */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-8 mb-10">
          
          {/* TÜR SEÇİM ALANI (Tümü / Yazılar / Duyurular) */}
          <div className="flex bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 max-w-md">
            <button
              onClick={() => { setSelectedType("all"); setSelectedCategory("all"); }}
              className={`flex-1 text-center py-2 px-5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                selectedType === "all"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-neutral-500 hover:text-brand-blue"
              }`}
            >
              Tüm İçerikler
            </button>
            <button
              onClick={() => { setSelectedType("blog"); setSelectedCategory("all"); }}
              className={`flex-1 text-center py-2 px-5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                selectedType === "blog"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-neutral-500 hover:text-brand-blue"
              }`}
            >
              Yazılar
            </button>
            <button
              onClick={() => { setSelectedType("duyuru"); setSelectedCategory("all"); }}
              className={`flex-1 text-center py-2 px-5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                selectedType === "duyuru"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-neutral-500 hover:text-brand-blue"
              }`}
            >
              Duyurular
            </button>
          </div>

          {/* KATEGORİ BUTONLARI (Kategorilere göre süzmek için) */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 hidden lg:inline">
              Kategoriler:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all uppercase tracking-wider cursor-pointer ${
                    isActive
                      ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                      : "bg-white border-neutral-300 text-neutral-600 hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  {cat === "all" ? "Tüm Kategoriler" : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Alt Kısım: Kartların Listesi */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          // Eğer aranan filtrede hiç içerik yoksa bu uyarı çıkıyor
          <div className="text-center py-16 bg-white border border-neutral-200/80 rounded-2xl max-w-md mx-auto shadow-sm">
            <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              İçerik Bulunamadı
            </h3>
            <p className="text-neutral-500 text-sm px-6">
              Seçtiğiniz filtre kombinasyonuna uygun bir yazı veya duyuru henüz eklenmemiş. Lütfen filtreleri sıfırlamayı deneyin.
            </p>
            <button
              onClick={() => { setSelectedType("all"); setSelectedCategory("all"); }}
              className="mt-6 inline-flex items-center justify-center bg-brand-blue hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-all"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}

      </section>
    </Layout>
  );
}
