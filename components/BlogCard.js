import Link from "next/link";

export default function BlogCard({ post }) {
  // Markdown dosyasının üstündeki (front-matter) değişkenleri aldım
  const { slug, title, date, excerpt, author, category, type, featuredImage, readTime } = post;

  // İçerik tipine göre etiket rengini ayarladım (Duyuru ise turuncu, Blog ise mavi)
  const isAnnouncement = type === "duyuru";
  const badgeStyles = isAnnouncement
    ? "bg-orange-50 text-brand-orange border border-orange-200"
    : "bg-primary-50 text-brand-blue border border-primary-200";

  return (
    // Hover olunca hafif yukarı kayma ve gölge efekti ekledim
    <article className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-neutral-200/60 transition-all duration-300 hover:-translate-y-1 group">
      
      {/* Kart Görseli */}
      <Link href={`/blog/${slug}`} className="block relative overflow-hidden aspect-video bg-neutral-100">
        <img 
          src={featuredImage || "/Bilsoft Logo.png"} 
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !featuredImage ? "p-8 object-contain opacity-50" : ""
          }`}
          loading="lazy"
        />
        {/* Sol üst köşedeki kategori etiketi */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full shadow-sm capitalize ${badgeStyles}`}>
          {category || (isAnnouncement ? "Duyuru" : "Blog")}
        </span>
      </Link>

      {/* Yazı Detayları */}
      <div className="flex flex-col flex-grow p-6 sm:p-8">
        
        {/* Tarih ve Tahmini Okuma Süresi */}
        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 font-medium">
          <time dateTime={date} className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {new Date(date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </time>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime || "3 dk okuma"}
          </span>
        </div>

        {/* Kart Başlığı */}
        <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h3>

        {/* Kısa Özet Yazısı */}
        <p className="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {excerpt}
        </p>

        {/* Yazar Bilgisi ve Oku Butonu */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600 border border-neutral-300 uppercase">
              {author ? author.charAt(0) : "B"}
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-800">{author || "Bilsoft Yazar"}</p>
              <p className="text-[10px] text-neutral-400 font-medium">Editör</p>
            </div>
          </div>
          
          <Link 
            href={`/blog/${slug}`}
            className="text-xs font-bold text-brand-blue group-hover:text-brand-orange flex items-center gap-1 transition-colors"
          >
            Oku
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </article>
  );
}
