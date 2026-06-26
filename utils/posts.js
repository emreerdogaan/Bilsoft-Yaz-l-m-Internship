import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Markdown (.md) dosyalarının durduğu klasörün yolunu çektim
const postsDirectory = path.join(process.cwd(), "posts");

/*
  Klasördeki bütün markdown dosyalarını tarayıp içindeki bilgileri
  tarihe göre sıralı dizi olarak veren fonksiyon.
*/
export function getSortedPostsData() {
  // Eğer klasör bulunamadıysa hata vermemesi için boş dizi dönüyoruz
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // Klasördeki bütün dosyaları listeliyoruz
  const fileNames = fs.readdirSync(postsDirectory);
  
  // Sadece .md olanları alıp içlerini okuyoruz
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith(".md"))
    .map((fileName) => {
      // Dosya ismini URL slug değeri olarak kullanmak için .md kısmını kestik
      const slug = fileName.replace(/\.md$/, "");

      // Dosyanın tam disk yolunu buluyoruz
      const fullPath = path.join(postsDirectory, fileName);
      // Dosyayı text formatında okuyoruz
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matter paketiyle dosyanın üstündeki meta bilgilerini (başlık, tarih vb.) ayrıştırdık
      const matterResult = matter(fileContents);

      // Bilgileri slug ile birleştirip diziye atıyoruz
      return {
        slug,
        ...matterResult.data, // title, date, excerpt, type vb.
      };
    });

  // Son eklenen yazı en üstte görünsün diye tarihe göre sıraladım
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/*
  Dinamik detay sayfaları ([slug].js) için getStaticPaths fonksiyonunun
  istediği rota parametrelerini hazırlayan fonksiyon.
*/
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  // Rotaları [{ params: { slug: 'yazi-adi' } }] şeklinde Next.js'in istediği yapıda döndürdüm
  return fileNames
    .filter(fileName => fileName.endsWith(".md"))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ""),
        },
      };
    });
}

/*
  Seçilen tek bir yazının detayını ve markdown içeriğini
  marked paketiyle HTML'e çevirip veren fonksiyon.
*/
export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Yazı bulunamadı: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matter ile makaleyi okudum
  const matterResult = matter(fileContents);

  // Markdown gövdesini normal HTML etiketlerine çevirdik
  const contentHtml = marked(matterResult.content);

  // Başlık, yazar vb. verileri ve HTML içeriğini döndüm
  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
}
