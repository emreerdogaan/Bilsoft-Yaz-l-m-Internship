import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getSortedPostsData } from "@/utils/posts";

const postsDirectory = path.join(process.cwd(), "posts");

// Türkçe karakterleri temizleyen ve URL dostu slug oluşturan fonksiyon
function slugify(text) {
  const map = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };
  
  let str = text.toString().toLowerCase().trim();
  
  // Türkçe karakterleri değiştir
  Object.keys(map).forEach(key => {
    str = str.replace(new RegExp(key, 'g'), map[key]);
  });

  return str
    .replace(/\s+/g, "-")          // Boşlukları tireye çevir
    .replace(/[^\w\-]+/g, "")      // Harf, sayı ve tire dışındaki karakterleri kaldır
    .replace(/\-\-+/g, "-")        // Çift tireleri tek tireye indir
    .replace(/^-+/, "")            // Başındaki tireyi kaldır
    .replace(/-+$/, "");           // Sonundaki tireyi kaldır
}

// =========================================================================
// API HANDLER (SUNUCU TARAFINDA ÇALIŞAN KOD BLOĞU)
// =========================================================================
// Next.js'te api klasöründeki dosyalar birer sunucu fonksiyonu (Serverless Function) gibi çalışır.
// Tarayıcıdan bu API'ye istek geldiğinde bu handler fonksiyonu çalışır.
export default async function handler(req, res) {
  
  // 1. GÜVENLİK KONTROLÜ (AUTHORIZATION)
  // İstek başlığındaki (Headers) Authorization verisini kontrol ediyoruz.
  // Yazma/güncelleme/silme işlemleri için admin.js'ten gelen "Bearer admin-token" değerini arıyoruz.
  const authHeader = req.headers.authorization;
  const isAuthorized = authHeader === "Bearer admin-token";

  // Sadece GET (okuma) işlemine şifresiz izin veriyoruz.
  // POST, PUT, DELETE işlemleri yapılıyorsa ve yetki yoksa 401 (Unauthorized) hatası dönüyoruz.
  if (req.method !== "GET" && !isAuthorized) {
    return res.status(401).json({ message: "Yetkisiz işlem. Lütfen giriş yapın." });
  }

  // 2. DOSYA KLASÖR KONTROLÜ (fs)
  // posts klasörünün var olup olmadığını kontrol eder. Yoksa otomatik oluşturur (mkdirSync).
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory);
  }

  try {
    // =========================================================================
    // GET İSTEĞİ (İÇERİKLERİ OKUMA / ÇEKME)
    // =========================================================================
    if (req.method === "GET") {
      const { slug } = req.query; // Adresten gelen parametreyi okur (örn: /api/posts?slug=yazi-adi)
      
      if (slug) {
        // A) TEK BİR YAZININ DETAYINI GETİRME
        const filePath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ message: "Yazı bulunamadı." });
        }
        // Dosyayı text olarak okuyoruz.
        const fileContents = fs.readFileSync(filePath, "utf8");
        // gray-matter ile dosyanın üstündeki metadata (front-matter) ve markdown içeriğini (content) ayırıyoruz.
        const matterResult = matter(fileContents);
        
        return res.status(200).json({
          slug,
          content: matterResult.content, // Ham markdown metni (düzenleme editörü için)
          ...matterResult.data // title, author, date, type vb. metadata
        });
      }
      
      // B) TÜM YAZILARI SIRALI LİSTELEME
      // utils/posts.js içindeki getSortedPostsData fonksiyonunu çağırarak tüm yazıları dizi halinde çeker.
      const posts = getSortedPostsData();
      return res.status(200).json(posts);
    } 
    
    // =========================================================================
    // POST İSTEĞİ (YENİ İÇERİK OLUŞTURMA / KAYDETME)
    // =========================================================================
    else if (req.method === "POST") {
      // Gönderilen JSON paketindeki (body) alanları değişkenlere atıyoruz.
      const { title, excerpt, author, category, tags, type, featuredImage, readTime, content, status } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: "Başlık ve içerik alanları zorunludur." });
      }

      // Başlığı temizleyip URL uyumlu bir slug haline getiriyoruz (Örn: "Yeni Kampanya!" -> "yeni-kampanya")
      let slug = slugify(title);
      let fullPath = path.join(postsDirectory, `${slug}.md`);

      // Eğer aynı isimde başka bir dosya varsa sonuna sayı ekleyerek çakışmayı önlüyoruz (örn: yazi-adi-1.md)
      let counter = 1;
      while (fs.existsSync(fullPath)) {
        slug = `${slugify(title)}-${counter}`;
        fullPath = path.join(postsDirectory, `${slug}.md`);
        counter++;
      }

      // Markdown dosyasının en tepesine eklenecek metadata (front-matter) bilgileri
      const data = {
        title,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD formatında bugünün tarihi
        excerpt: excerpt || "",
        author: author || "Bilsoft Editör",
        category: category || "Genel",
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []),
        type: type === "duyuru" ? "duyuru" : "blog",
        featuredImage: featuredImage || "",
        readTime: readTime || "3 dk okuma",
        status: status || "yayinlandi" // Yayın durumu (yayinlandi veya taslak)
      };

      // matter.stringify: Verilen metadata objesini YAML formatına dönüştürüp markdown metninin üstüne yazar.
      const fileContent = matter.stringify(content, data);
      
      // Dosyayı diske kaydediyoruz.
      fs.writeFileSync(fullPath, fileContent, "utf8");

      return res.status(201).json({ message: "Yazı başarıyla eklendi.", slug });
    } 
    
    // =========================================================================
    // PUT İSTEĞİ (MEVCUT İÇERİĞİ GÜNCELLEME / DÜZENLEME)
    // =========================================================================
    else if (req.method === "PUT") {
      const { slug: existingSlug, title, excerpt, author, category, tags, type, featuredImage, readTime, content, date, status } = req.body;

      if (!existingSlug) {
        return res.status(400).json({ message: "Güncellenecek yazının slug değeri bulunamadı." });
      }

      const oldPath = path.join(postsDirectory, `${existingSlug}.md`);
      if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ message: "Güncellenecek dosya bulunamadı." });
      }

      // Yeni başlık girildiyse yeni bir slug ve yeni bir dosya adı oluşturuyoruz.
      let newSlug = slugify(title || existingSlug);
      let newPath = path.join(postsDirectory, `${newSlug}.md`);

      // Başlık değiştiyse ve yeni isme ait başka bir dosya varsa çakışmayı önlüyoruz.
      if (newSlug !== existingSlug) {
        let counter = 1;
        while (fs.existsSync(newPath) && newPath !== oldPath) {
          newSlug = `${slugify(title)}-${counter}`;
          newPath = path.join(postsDirectory, `${newSlug}.md`);
          counter++;
        }
      }

      const data = {
        title: title || "",
        date: date || new Date().toISOString().split("T")[0],
        excerpt: excerpt || "",
        author: author || "Bilsoft Editör",
        category: category || "Genel",
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []),
        type: type === "duyuru" ? "duyuru" : "blog",
        featuredImage: featuredImage || "",
        readTime: readTime || "3 dk okuma",
        status: status || "yayinlandi" // Yayın durumu güncellenir
      };

      const fileContent = matter.stringify(content || "", data);

      // Başlık değişmişse dosya adı da değişeceği için eski dosyayı siliyoruz (fs.unlinkSync), yeni isimle yazıyoruz.
      if (newSlug !== existingSlug) {
        fs.unlinkSync(oldPath);
      }
      fs.writeFileSync(newPath, fileContent, "utf8");

      return res.status(200).json({ message: "Yazı başarıyla güncellendi.", slug: newSlug });
    } 
    
    // =========================================================================
    // DELETE İSTEĞİ (İÇERİK SİLME)
    // =========================================================================
    else if (req.method === "DELETE") {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ message: "Silinecek yazının slug değeri belirtilmelidir." });
      }

      const filePath = path.join(postsDirectory, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Silinecek dosya bulunamadı." });
      }

      // Dosyayı diskten kalıcı olarak siliyoruz.
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: "Yazı başarıyla silindi." });
    } 
    
    // Desteklenmeyen bir HTTP metodu geldiğinde 405 (Method Not Allowed) dönüyoruz.
    else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Hatası:", error);
    return res.status(500).json({ message: "İşlem sırasında bir hata oluştu.", error: error.message });
  }
}
