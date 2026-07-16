import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { getAllPostSlugs, getPostData } from "@/utils/posts";

// getStaticPaths: Dinamik blog detay sayfalarının (slug'ların) listesini derleme aşamasında Next.js'e bildirir.
export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false, // Olmayan bir yazı isteğinde doğrudan 404 sayfasına yönlendirir.
  };
}

// getStaticProps: slug parametresine göre ilgili markdown dosyasının verilerini derleme aşamasında okur.
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}

export default function BlogPost({ postData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center py-20 font-semibold text-neutral-500 dark:text-neutral-400">Yükleniyor...</div>;
  }

  const { title, date, author, category, tags, contentHtml, excerpt, type, readTime, slug } = postData;

  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://www.bilsoft.com/blog/${slug}`;
  const shareText = encodeURIComponent(title);

  // Butona tıklandığında sayfa linkini panoya kopyalar.
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(pageUrl);
    alert("Yazı bağlantısı panoya kopyalandı!");
  };

  const isAnnouncement = type === "duyuru";
  const categoryColor = isAnnouncement 
    ? "bg-orange-50 text-brand-orange border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/60" 
    : "bg-primary-50 text-brand-blue border border-primary-200 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-900/60";

  return (
    <Layout>
      {/* SEO ve Sosyal Paylaşım Kartları için Meta Etiketleri */}
      <Head>
        <title>{`${title} | Bilsoft Yazılım Blog`}</title>
        <meta name="description" content={excerpt} />
        <meta name="keywords" content={tags ? tags.join(", ") : "bilsoft, blog, muhasebe"} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${title} | Bilsoft Yazılım`} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Bilsoft Yazılım" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
      </Head>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-brand-blue dark:text-neutral-400 dark:hover:text-brand-orange transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Blog Ana Sayfa
        </Link>

        {postData.status === "taslak" && (
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-400 rounded-xl p-4 mb-8 text-sm flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold">Taslak İçerik</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-0.5">Bu içerik şu anda taslak olarak kaydedilmiştir ve ana sayfada ziyaretçilere gösterilmemektedir.</p>
            </div>
          </div>
        )}

        <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-8 space-y-5">
          <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block ${categoryColor}`}>
            {category || (isAnnouncement ? "Duyuru" : "Blog")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic">
            {excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 uppercase shadow-inner">
                {author ? author.charAt(0) : "B"}
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{author || "Bilsoft Editör"}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold tracking-wider uppercase">Editör</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {new Date(date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readTime || "3 dk okuma"}
              </span>
            </div>
          </div>
        </header>

        {/* dangerouslySetInnerHTML: İşlenmiş olan Markdown HTML içeriğini sayfaya güvenli bir şekilde basar. */}
        <section 
          className="prose max-w-none text-neutral-700 dark:text-neutral-300 font-normal"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Etiketler listesi */}
        {tags && tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-2">Etiketler:</span>
            {tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-750">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Sosyal medya paylaşım butonları */}
        <div className="mt-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Bu içeriği beğendiniz mi?</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Sosyal ağlarda paylaşarak diğer işletmelerin de faydalanmasını sağlayabilirsiniz.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <a 
              href={`https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange hover:border-brand-blue dark:hover:border-brand-orange transition-all"
              title="Twitter'da Paylaş"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange hover:border-brand-blue dark:hover:border-brand-orange transition-all"
              title="Facebook'ta Paylaş"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>

            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange hover:border-brand-blue dark:hover:border-brand-orange transition-all"
              title="LinkedIn'da Paylaş"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <button 
              onClick={copyLinkToClipboard}
              className="p-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-blue dark:hover:text-brand-orange hover:border-brand-blue dark:hover:border-brand-orange cursor-pointer transition-all"
              title="Bağlantıyı Kopyala"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>

      </article>
    </Layout>
  );
}
