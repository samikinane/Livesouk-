import "./globals.css";

export const metadata = {
  title: "LiveSouk | التسوق المباشر في المغرب",
  description: "اكتشف العروض المباشرة واطلب عبر واتساب مع الدفع عند الاستلام في جميع مدن المغرب",
  manifest: "/manifest.json",
  themeColor: "#e11d48",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LiveSouk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e11d48" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
