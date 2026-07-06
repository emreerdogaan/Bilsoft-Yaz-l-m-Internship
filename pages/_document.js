import { Html, Head, Main, NextScript } from "next/document";

// _document.js: Next.js projelerinde sayfanın HTML yapısını (HTML, Head, Body etiketlerini) özelleştirmek için kullanılır.
// Sunucuda (server-side) yalnızca bir kere render edilir, client-side tarafında çalışmaz.
export default function Document() {
  return (
    // Türkçe karakterlerin arama motorları ve tarayıcılar tarafından doğru algılanması için lang="tr" yapıldı.
    <Html lang="tr">
      <Head />
      <body className="antialiased">
        {/* Main: Next.js sayfalarının yerleşeceği ana bileşendir. */}
        <Main />
        {/* NextScript: Next.js'in düzgün çalışması için gerekli olan Javascript kodlarını (bundle) sayfaya yükler. */}
        <NextScript />
      </body>
    </Html>
  );
}
