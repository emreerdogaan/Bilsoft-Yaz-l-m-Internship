import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const router = useRouter();
  
  // Oturum Durumları
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Arayüz Görünüm Sekmesi ('dashboard' | 'blogs' | 'duyurular' | 'form')
  const [activeTab, setActiveTab] = useState("dashboard");

  // Yazı verileri (API'den çekilecek)
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form Durumları (Yeni ekleme veya düzenleme için)
  const [isEditing, setIsEditing] = useState(false);
  const [editSlug, setEditSlug] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("blog");
  const [formCategory, setFormCategory] = useState("Genel");
  const [formAuthor, setFormAuthor] = useState("Admin");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formReadTime, setFormReadTime] = useState("3 dk okuma");
  const [formDate, setFormDate] = useState(""); // Düzenlemede orijinal tarihi korumak için

  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  // Sayfa yüklendiğinde oturum kontrolü yap
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "logged_in") {
      setIsLoggedIn(true);
      fetchPosts();
    }
  }, []);

  // Bildirim gösterme fonksiyonu
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Yazıları API'den çekme
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        showNotification("Yazılar yüklenirken bir hata oluştu.", "error");
      }
    } catch (err) {
      showNotification("Bağlantı hatası oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Giriş Yapma İşlemi
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername === "admin" && loginPassword === "admin123") {
      localStorage.setItem("admin_token", "logged_in");
      setIsLoggedIn(true);
      setLoginError("");
      fetchPosts();
      showNotification("Giriş başarılı! Hoş geldiniz.");
    } else {
      setLoginError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  // Çıkış Yapma İşlemi
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    showNotification("Oturum kapatıldı.");
  };

  // Form Sıfırlama
  const resetForm = () => {
    setIsEditing(false);
    setEditSlug("");
    setFormTitle("");
    setFormType("blog");
    setFormCategory("Genel");
    setFormAuthor("Admin");
    setFormExcerpt("");
    setFormContent("");
    setFormTags("");
    setFormImage("");
    setFormReadTime("3 dk okuma");
    setFormDate("");
  };

  // Düzenleme Modunu Açma
  const handleEditClick = (post) => {
    setIsEditing(true);
    setEditSlug(post.slug);
    setFormTitle(post.title || "");
    setFormType(post.type || "blog");
    setFormCategory(post.category || "Genel");
    setFormAuthor(post.author || "Admin");
    setFormExcerpt(post.excerpt || "");
    setFormContent(""); // Önce temizle, API'den yüklenene kadar boş kalsın
    setFormTags(post.tags ? post.tags.join(", ") : "");
    setFormImage(post.featuredImage || "");
    setFormReadTime(post.readTime || "3 dk okuma");
    setFormDate(post.date || "");
    
    // Form sekmesini aç
    setActiveTab("form");
    
    // Düzenleme yapmak için içeriğin ham markdown metnini çekiyoruz
    fetchPostDetail(post.slug);
  };

  const fetchPostDetail = async (slug) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        headers: { "Authorization": "Bearer admin-token" }
      });
      if (res.ok) {
        const data = await res.json();
        setFormContent(data.content || "");
      } else {
        showNotification("Yazı içeriği yüklenemedi.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Yazı içeriği yüklenirken hata oluştu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Form Kaydetme / Güncelleme İşlemi
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      showNotification("Başlık ve İçerik alanları zorunludur!", "error");
      return;
    }

    const payload = {
      slug: editSlug,
      title: formTitle,
      excerpt: formExcerpt,
      author: formAuthor,
      category: formCategory,
      tags: formTags.split(",").map(t => t.trim()).filter(t => t),
      type: formType,
      featuredImage: formImage,
      readTime: formReadTime,
      content: formContent,
      date: formDate // Düzenlemede var olan tarih korunur
    };

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/posts", {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer admin-token"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        showNotification(isEditing ? "İçerik başarıyla güncellendi!" : "Yeni içerik başarıyla eklendi!");
        resetForm();
        fetchPosts();
        setActiveTab("dashboard");
      } else {
        showNotification(result.message || "İşlem başarısız oldu.", "error");
      }
    } catch (err) {
      showNotification("Sunucu ile iletişim kurulamadı.", "error");
    }
  };

  // Silme İşlemi
  const handleDeleteClick = async (slug) => {
    if (!window.confirm("Bu yazıyı kalıcı olarak silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer admin-token"
        }
      });

      const result = await res.json();
      if (res.ok) {
        showNotification("Yazı başarıyla silindi.");
        fetchPosts();
      } else {
        showNotification(result.message || "Silme işlemi başarısız.", "error");
      }
    } catch (err) {
      showNotification("Sunucu hatası oluştu.", "error");
    }
  };

  // İstatistikleri hesapla
  const stats = {
    total: posts.length,
    blogs: posts.filter(p => p.type === "blog").length,
    announcements: posts.filter(p => p.type === "duyuru").length,
    categories: new Set(posts.map(p => p.category).filter(Boolean)).size
  };

  // GİRİŞ EKRANI
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Yönetici Girişi | Bilsoft Blog</title>
        </Head>
        
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-neutral-200">
          <div className="text-center">
            <img src="/Bilsoft Logo.png" alt="Bilsoft Logo" className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">Yönetici Paneli</h2>
            <p className="mt-2 text-xs text-neutral-500">
              Blog ve duyuru içeriklerini yönetmek için giriş yapın.
            </p>
          </div>

          <div className="bg-primary-50 border border-primary-200 text-brand-blue rounded-xl p-4 text-xs space-y-1">
            <p className="font-bold">🔑 Test Giriş Bilgileri:</p>
            <p><span className="font-semibold">Kullanıcı Adı:</span> admin</p>
            <p><span className="font-semibold">Şifre:</span> admin123</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm text-center font-medium">
                {loginError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Şifre</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-blue hover:bg-primary-700 text-white text-sm font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Giriş Yap
            </button>
            
            <div className="text-center">
              <Link href="/" className="text-xs text-neutral-400 hover:text-brand-blue transition-colors font-medium">
                ← Blog Ana Sayfasına Dön
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // YÖNETİCİ PANELİ ARAYÜZÜ
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      <Head>
        <title>Yönetici Kontrol Paneli | Bilsoft Blog</title>
      </Head>

      {/* BİLDİRİM BANNERI */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-xl border flex items-center gap-3 transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="text-sm font-semibold">{notification.message}</div>
        </div>
      )}

      {/* SOL SIDEBAR */}
      <aside className="w-full md:w-64 bg-brand-blue text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/Bilsoft Logo.png" alt="Bilsoft Logo" className="h-8 w-auto brightness-200 invert" />
            <span className="text-xs font-bold border-l border-white/20 pl-2 tracking-wider uppercase">Blog Admin</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          <button
            onClick={() => { setActiveTab("dashboard"); resetForm(); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "dashboard" && !isEditing ? "bg-white/15 text-brand-orange" : "text-neutral-200 hover:bg-white/5"
            }`}
          >
            📊 Gösterge Paneli
          </button>
          
          <button
            onClick={() => { setActiveTab("blogs"); resetForm(); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "blogs" ? "bg-white/15 text-brand-orange" : "text-neutral-200 hover:bg-white/5"
            }`}
          >
            ✍️ Blog Yazıları
          </button>

          <button
            onClick={() => { setActiveTab("duyurular"); resetForm(); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "duyurular" ? "bg-white/15 text-brand-orange" : "text-neutral-200 hover:bg-white/5"
            }`}
          >
            📢 Duyurular
          </button>

          <button
            onClick={() => { setActiveTab("form"); resetForm(); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "form" && !isEditing ? "bg-white/15 text-brand-orange" : "text-neutral-200 hover:bg-white/5"
            }`}
          >
            ➕ Yeni İçerik Ekle
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full text-center block px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-bold rounded-lg border border-white/10 transition-all"
          >
            👁️ Siteyi Görüntüle
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-brand-orange hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>

      {/* SAĞ ANA İÇERİK ALANI */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
        
        {/* SEKME 1: GÖSTERGE PANELİ (DASHBOARD) */}
        {activeTab === "dashboard" && !isEditing && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">Gösterge Paneli</h1>
              <p className="text-neutral-500 text-sm mt-1">İçerik yönetim durumuna genel bakış.</p>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Toplam İçerik</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{stats.total}</h3>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-xl">📝</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Blog Yazıları</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{stats.blogs}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-blue-600">✍️</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Duyurular</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{stats.announcements}</h3>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl text-orange-500">📢</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Kategoriler</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-2">{stats.categories}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl text-purple-600">📂</div>
              </div>
            </div>

            {/* Son Eklenen Yazılar */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
                <h3 className="text-lg font-bold text-neutral-900">Son Eklenen İçerikler</h3>
                <button
                  onClick={() => setActiveTab("form")}
                  className="bg-brand-blue hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  ➕ Yeni Ekle
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-wider border-b border-neutral-200">
                      <th className="p-4 pl-6">İçerik Başlığı</th>
                      <th className="p-4">Tür</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4 pr-6 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-sm text-neutral-700">
                    {posts.slice(0, 5).map((post) => (
                      <tr key={post.slug} className="hover:bg-neutral-50/50">
                        <td className="p-4 pl-6 font-semibold text-neutral-900 max-w-xs truncate">{post.title}</td>
                        <td className="p-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${
                            post.type === "duyuru" 
                              ? "bg-orange-50 text-brand-orange border-orange-200" 
                              : "bg-primary-50 text-brand-blue border-primary-200"
                          }`}>
                            {post.type === "duyuru" ? "Duyuru" : "Blog"}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-500 font-medium">{post.category}</td>
                        <td className="p-4 text-neutral-400 text-xs">{post.date}</td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(post)}
                            className="text-xs font-bold text-brand-blue hover:text-brand-orange border border-neutral-200 px-3 py-1.5 rounded-md hover:border-brand-blue transition-all cursor-pointer"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.slug)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 border border-neutral-200 px-3 py-1.5 rounded-md hover:border-red-600 transition-all cursor-pointer"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-neutral-400 font-medium">Henüz içerik eklenmemiş.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 2 & 3: BLOG VE DUYURU YÖNETİMİ LİSTELERİ */}
        {((activeTab === "blogs" || activeTab === "duyurular") && !isEditing) && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                {activeTab === "blogs" ? "Blog Yazıları Yönetimi" : "Duyurular Yönetimi"}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                {activeTab === "blogs" ? "Sadece blog kategorisindeki yazılar listelenir." : "Sadece duyuru kategorisindeki yazılar listelenir."}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-wider border-b border-neutral-200">
                      <th className="p-4 pl-6">Başlık</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4">Yazar</th>
                      <th className="p-4 pr-6 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-sm text-neutral-700">
                    {posts
                      .filter(p => activeTab === "blogs" ? p.type !== "duyuru" : p.type === "duyuru")
                      .map((post) => (
                        <tr key={post.slug} className="hover:bg-neutral-50/50">
                          <td className="p-4 pl-6 font-semibold text-neutral-900 max-w-sm truncate">{post.title}</td>
                          <td className="p-4 text-neutral-500 font-medium">{post.category}</td>
                          <td className="p-4 text-neutral-400 text-xs">{post.date}</td>
                          <td className="p-4 text-neutral-500 text-xs">{post.author}</td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button
                              onClick={() => handleEditClick(post)}
                              className="text-xs font-bold text-brand-blue hover:text-brand-orange border border-neutral-200 px-3 py-1.5 rounded-md hover:border-brand-blue transition-all cursor-pointer"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteClick(post.slug)}
                              className="text-xs font-bold text-red-600 hover:text-red-800 border border-neutral-200 px-3 py-1.5 rounded-md hover:border-red-600 transition-all cursor-pointer"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    {posts.filter(p => activeTab === "blogs" ? p.type !== "duyuru" : p.type === "duyuru").length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-neutral-400 font-medium">Bu türde hiçbir içerik bulunamadı.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 4: YENİ EKLE / DÜZENLEME FORMU */}
        {(activeTab === "form" || isEditing) && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                {isEditing ? "İçeriği Düzenle" : "Yeni İçerik Ekle"}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                {isEditing 
                  ? `Düzenlenen yazı: "${formTitle}" (Sadece yerel diskteki dosya güncellenecektir)` 
                  : "Buradan ekleyeceğiniz yazılar otomatik olarak posts/ dizininde bir .md dosyası olarak kaydedilecektir."
                }
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Başlık */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">İçerik Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e-Defter Zorunluluğu Kapsamında Yeni Tebliğ vb."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  />
                </div>

                {/* İçerik Türü */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">İçerik Türü</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  >
                    <option value="blog">Blog Yazısı</option>
                    <option value="duyuru">Duyuru / Kampanya</option>
                  </select>
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Kategori</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="E-Dönüşüm, Ön Muhasebe, Kampanyalar"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  />
                </div>

                {/* Yazar */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Yazar</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Yunus Emre, Bilsoft Editör"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  />
                </div>

                {/* Okuma Süresi */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Tahmini Okuma Süresi</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="4 dk okuma"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  />
                </div>

                {/* Öne Çıkan Görsel URL */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Öne Çıkan Görsel URL (Boş bırakılabilir)</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/yeni-yil-kampanyasi-duyuru.jpg veya boş bırakın"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  />
                </div>

                {/* Etiketler */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Etiketler (Virgülle ayırın)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e-defter, gib, muhasebe"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                  />
                </div>

                {/* Kısa Özet (Excerpt) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Kısa Özet (Makale Listelerinde Görünecek Metin) *</label>
                  <textarea
                    required
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    rows="2"
                    placeholder="Bu makalede ön muhasebe süreçlerindeki son gelişmeleri ele alıyoruz..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all resize-y"
                  />
                </div>

                {/* İçerik Metni (Markdown editörü gibi davranan textarea) */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Makale Detay İçeriği (Markdown) *</label>
                    <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-500 font-semibold px-2.5 py-1 rounded-md">
                      İpucu: **Kalın**, *İtalik*, # Başlık kullanabilirsiniz.
                    </span>
                  </div>
                  <textarea
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    rows="12"
                    placeholder="## Giriş Başlığı&#10;&#10;Buraya makalenizin ana metnini Markdown formatında yazabilirsiniz..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all font-mono resize-y"
                  />
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => { setActiveTab("dashboard"); resetForm(); }}
                  className="px-5 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  İptal Et
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-orange hover:bg-orange-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isEditing ? "Değişiklikleri Kaydet" : "İçeriği Yayınla"}
                </button>
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  );
}
