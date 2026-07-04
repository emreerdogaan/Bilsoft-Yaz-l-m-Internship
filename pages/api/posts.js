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

export default async function handler(req, res) {
  // Basit güvenlik kontrolü: Sunumda göstermek için admin yetki başlığı aranabilir
  const authHeader = req.headers.authorization;
  const isAuthorized = authHeader === "Bearer admin-token";

  if (req.method !== "GET" && !isAuthorized) {
    return res.status(401).json({ message: "Yetkisiz işlem. Lütfen giriş yapın." });
  }

  // Klasör kontrolü
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory);
  }

  try {
    if (req.method === "GET") {
      const { slug } = req.query;
      if (slug) {
        // Tek yazı detayını (ham markdown içeriği dahil) getir
        const filePath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ message: "Yazı bulunamadı." });
        }
        const fileContents = fs.readFileSync(filePath, "utf8");
        const matterResult = matter(fileContents);
        return res.status(200).json({
          slug,
          content: matterResult.content, // Ham markdown metni
          ...matterResult.data
        });
      }
      // Tüm yazıları getir
      const posts = getSortedPostsData();
      return res.status(200).json(posts);
    } 
    else if (req.method === "POST") {
      // Yeni yazı ekleme
      const { title, excerpt, author, category, tags, type, featuredImage, readTime, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: "Başlık ve içerik alanları zorunludur." });
      }

      let slug = slugify(title);
      let fullPath = path.join(postsDirectory, `${slug}.md`);

      // Eğer aynı isimde dosya varsa çakışmayı önlemek için sonuna benzersiz numara ekle
      let counter = 1;
      while (fs.existsSync(fullPath)) {
        slug = `${slugify(title)}-${counter}`;
        fullPath = path.join(postsDirectory, `${slug}.md`);
        counter++;
      }

      // Front-matter meta bilgileri
      const data = {
        title,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        excerpt: excerpt || "",
        author: author || "Bilsoft Editör",
        category: category || "Genel",
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []),
        type: type === "duyuru" ? "duyuru" : "blog",
        featuredImage: featuredImage || "",
        readTime: readTime || "3 dk okuma"
      };

      // matter.stringify ile front-matter ve markdown içeriğini birleştiriyoruz
      const fileContent = matter.stringify(content, data);
      fs.writeFileSync(fullPath, fileContent, "utf8");

      return res.status(201).json({ message: "Yazı başarıyla eklendi.", slug });
    } 
    
    else if (req.method === "PUT") {
      // Mevcut yazıyı güncelleme
      const { slug: existingSlug, title, excerpt, author, category, tags, type, featuredImage, readTime, content, date } = req.body;

      if (!existingSlug) {
        return res.status(400).json({ message: "Güncellenecek yazının slug değeri bulunamadı." });
      }

      const oldPath = path.join(postsDirectory, `${existingSlug}.md`);
      if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ message: "Güncellenecek dosya bulunamadı." });
      }

      // Yeni slug oluştur (başlık değiştiyse)
      let newSlug = slugify(title || existingSlug);
      let newPath = path.join(postsDirectory, `${newSlug}.md`);

      // Başlık değiştiyse ve yeni başlığa ait başka bir dosya varsa çakışmayı önle
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
        readTime: readTime || "3 dk okuma"
      };

      const fileContent = matter.stringify(content || "", data);

      // Başlık değişmişse eski dosyayı sil, yenisini yaz
      if (newSlug !== existingSlug) {
        fs.unlinkSync(oldPath);
      }
      fs.writeFileSync(newPath, fileContent, "utf8");

      return res.status(200).json({ message: "Yazı başarıyla güncellendi.", slug: newSlug });
    } 
    
    else if (req.method === "DELETE") {
      // Yazı silme
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ message: "Silinecek yazının slug değeri belirtilmelidir." });
      }

      const filePath = path.join(postsDirectory, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Silinecek dosya bulunamadı." });
      }

      fs.unlinkSync(filePath);
      return res.status(200).json({ message: "Yazı başarıyla silindi." });
    } 
    
    else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Hatası:", error);
    return res.status(500).json({ message: "İşlem sırasında bir hata oluştu.", error: error.message });
  }
}
