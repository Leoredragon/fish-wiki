import fs from 'fs';

async function generateApk() {
  console.log('Requesting APK generation from PWABuilder Cloud Build Service...');
  
  const payload = {
    appUrl: "https://www.oltaapp.com",
    manifestUrl: "https://www.oltaapp.com/manifest.json",
    manifest: {
      name: "Oltapp - Dijital Balıkçılık & Livar",
      short_name: "Oltapp",
      description: "Türkiye Amatör Balıkçılık Topluluğu, Meralar, Solunar Tahmini ve Dijital Livar",
      start_url: "/tr",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#0F172A",
      theme_color: "#0F172A",
      icons: [
        {
          src: "https://www.oltaapp.com/icon.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable"
        }
      ]
    },
    packageId: "com.oltaapp.twa",
    name: "OltaApp",
    launcherName: "OltaApp",
    themeColor: "#0F172A",
    navigationColor: "#0F172A",
    backgroundColor: "#0F172A",
    enableNotifications: true,
    splashScreenFadeOutDuration: 300,
    signingMode: "new"
  };

  try {
    const res = await fetch("https://pwabuilder-android-new.azurewebsites.net/api/PWABuilder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.log('Response not ok:', res.status, text);
    } else {
      const buffer = await res.arrayBuffer();
      fs.writeFileSync("scratch/OltaApp.zip", Buffer.from(buffer));
      console.log("Successfully generated OltaApp.zip package! Size:", buffer.byteLength, "bytes");
    }
  } catch (err) {
    console.error("PWABuilder API Error:", err.message);
  }
}

generateApk();
