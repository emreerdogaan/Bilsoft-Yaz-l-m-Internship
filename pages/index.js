import { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { getSortedPostsData } from "@/utils/posts";

// getStaticProps: Projedeki Markdown (.md) yazılarını derleme aşamasında (build-time) 
// bir kez okuyup sayfaya gönderir. Bu sayede sayfa son derece hızlı yüklenir.
export async function getStaticProps() {
  const allPosts = getSortedPostsData();
  return {
    props: {
      allPosts,
    },
  };
}

export default function Home({ allPosts }) {
  const router = useRouter();

  // Arama girdisini ve seçilen kategorileri/türleri tutan state'ler.
  const [selectedType, setSelectedType] = useState("all"); 
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // URL'deki type parametresini (?type=blog gibi) algılayarak filtre state'ini günceller.
  useEffect(() => {
    if (router.query.type) {
      setSelectedType(router.query.type);
    } else {
      setSelectedType("all");
    }
  }, [router.query.type]);

  // useMemo: allPosts değişmediği sürece benzersiz kategorileri tekrar tekrar hesaplamaz (performans optimizasyonu).
  const categories = useMemo(() => {
    const list = new Set();
    allPosts.forEach((post) => {
      if (post.category) {
        list.add(post.category);
      }
    });
    return ["all", ...Array.from(list)];
  }, [allPosts]);

  // Seçilen tür, kategori ve arama kutusundaki kelimeye göre yazıları süzüyoruz.
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const typeMatch = selectedType === "all" || post.type === selectedType;
      const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;
      const statusMatch = post.status !== "taslak";
      
      const arananKelime = searchQuery.toLowerCase().trim();
      const aramaEslestiMi = !arananKelime || 
        post.title?.toLowerCase().includes(arananKelime) || 
        post.excerpt?.toLowerCase().includes(arananKelime) || 
        post.tags?.some(tag => tag.toLowerCase().includes(arananKelime));
      
      return typeMatch && categoryMatch && statusMatch && aramaEslestiMi;
    });
  }, [allPosts, selectedType, selectedCategory, searchQuery]);

  return (
    <Layout>
      <Head>
        <title>Bilsoft Yazılım | Bilgi Bankası, Blog ve Duyurular</title>
        <meta name="description" content="Bilsoft Yazılım ön muhasebe, e-Dönüşüm ve KOBİ dijitalleşme süreçlerine dair en güncel rehberler, blog yazıları ve kampanyalar." />
        <meta name="keywords" content="bilsoft, ön muhasebe, e-fatura, e-defter, blog, duyuru, muhasebe rehberi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue to-primary-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 shadow-inner">
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

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Search Bar Input */}
        <div className="relative max-w-xl mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Yazılarda veya duyurularda arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-orange focus:border-transparent transition-all placeholder-neutral-400 dark:placeholder-neutral-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              title="Aramayı Temizle"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Controls (Types & Categories) */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-10">
          
          {/* TÜR SEÇİM ALANI */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-md">
            <button
              onClick={() => { setSelectedType("all"); setSelectedCategory("all"); }}
              className={`flex-1 text-center py-2 px-5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                selectedType === "all"
                  ? "bg-white dark:bg-neutral-700 text-brand-blue dark:text-brand-orange shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-brand-blue dark:hover:text-brand-orange"
              }`}
            >
              Tüm İçerikler
            </button>
            <button
              onClick={() => { setSelectedType("blog"); setSelectedCategory("all"); }}
              className={`flex-1 text-center py-2 px-5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                selectedType === "blog"
                  ? "bg-white dark:bg-neutral-700 text-brand-blue dark:text-brand-orange shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-brand-blue dark:hover:text-brand-orange"
              }`}
            >
              Yazılar
            </button>
            <button
              onClick={() => { setSelectedType("duyuru"); setSelectedCategory("all"); }}
              className={`flex-1 text-center py-2 px-5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                selectedType === "duyuru"
                  ? "bg-white dark:bg-neutral-700 text-brand-blue dark:text-brand-orange shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-brand-blue dark:hover:text-brand-orange"
              }`}
            >
              Duyurular
            </button>
          </div>

          {/* KATEGORİ SEÇİM ALANI */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-2 hidden lg:inline">
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
                      ? "bg-brand-blue dark:bg-brand-orange border-brand-blue dark:border-brand-orange text-white shadow-sm"
                      : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-brand-blue dark:hover:border-brand-orange hover:text-brand-blue dark:hover:text-brand-orange"
                  }`}
                >
                  {cat === "all" ? "Tüm Kategoriler" : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Grid / Fallback UI */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 rounded-2xl max-w-md mx-auto shadow-sm">
            <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              İçerik Bulunamadı
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm px-6">
              Aradığınız kriterlere uygun bir yazı veya duyuru bulunamadı. Lütfen arama teriminizi veya filtreleri değiştirmeyi deneyin.
            </p>
            <button
              onClick={() => { setSelectedType("all"); setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-6 inline-flex items-center justify-center bg-brand-blue dark:bg-brand-orange hover:bg-primary-700 dark:hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Filtreleri ve Aramayı Sıfırla
            </button>
          </div>
        )}

      </section>
    </Layout>
  );
}
