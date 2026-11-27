"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag, Search, MapPin, MessageCircle, Heart, Plus, X,
  Star, ShieldCheck, Eye, Flame, Trash2, CheckCircle2,
  Sparkles, Loader2, Play, Store, Home, Compass, Zap, Share2,
} from "lucide-react";

const SUPABASE_URL = "https://yvicrakxdkotiiqqaytp.supabase.co";
const SUPABASE_KEY = "sb_publishable_n07Cj8nMSHGFmMpuwrArrQ_S8MPBUAx";

const CITIES = ["الكل", "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة"];
const CATEGORIES = [
  { name: "الكل", icon: "🔥" },
  { name: "ملابس", icon: "👗" },
  { name: "إلكترونيات", icon: "📱" },
  { name: "تجميل", icon: "💄" },
  { name: "منزل وديكور", icon: "🛋️" },
  { name: "عطور", icon: "✨" },
  { name: "إكسسوارات", icon: "⌚" },
];
const CARD_THEMES = [
  "from-rose-600 via-pink-600 to-amber-500",
  "from-violet-700 via-purple-600 to-rose-500",
  "from-emerald-600 via-teal-600 to-cyan-500",
  "from-amber-600 via-orange-600 to-rose-600",
  "from-blue-700 via-indigo-600 to-fuchsia-600",
];

function LiveSoukPremiumLogo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-400 p-[2px] shadow-lg shadow-rose-500/30">
        <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6 relative z-10">
            <path d="M14 14V11.5C14 8.46 16.46 6 19.5 6H20.5C23.54 6 26 8.46 26 11.5V14" stroke="#FBBF24" strokeWidth="2.8" strokeLinecap="round" />
            <rect x="9" y="13.5" width="22" height="20" rx="6" fill="#FFFBEB" />
            <path d="M17.5 19.5L24.5 23.5L17.5 27.5V19.5Z" fill="#09090B" />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-zinc-950" />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black tracking-tight text-white">
            Live<span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-500 to-amber-400">Souk</span>
          </span>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">PRO</span>
        </div>
        <p className="text-[10px] font-medium text-zinc-400 -mt-0.5">التسوق المباشر في المغرب</p>
      </div>
    </div>
  );
}

export default function LiveSoukHome() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [toast, setToast] = useState("");
  const [formData, setFormData] = useState({
    title: "", seller: "", city: "الدار البيضاء", category: "ملابس",
    price: "", whatsapp: "", delivery: "الدفع عند الاستلام",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/streams?select=*&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (Array.isArray(data)) setStreams(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.seller || !formData.price || !formData.whatsapp) return;
    setSubmitting(true);
    const randomColor = CARD_THEMES[Math.floor(Math.random() * CARD_THEMES.length)];
    const cleanWhatsapp = formData.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "212");
    const payload = {
      title: formData.title.trim(),
      seller: formData.seller.trim(),
      city: formData.city,
      category: formData.category,
      price: Number(formData.price),
      whatsapp: cleanWhatsapp,
      delivery: formData.delivery,
      rating: 5.0,
      verified: true,
      viewers: Math.floor(Math.random() * 65) + 22,
      is_live: true,
      color: randomColor,
    };
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/streams`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const rows = await res.json();
        setStreams((prev) => [rows[0] || { ...payload, id: Date.now() }, ...prev]);
        showToast("تم نشر عرضك المباشر بنجاح!");
      } else showToast("تعذر الحفظ، تحقق من الاتصال");
    } catch {
      showToast("حدث خطأ في الشبكة");
    } finally {
      setSubmitting(false);
      setIsAddModalOpen(false);
      setFormData({ title: "", seller: "", city: "الدار البيضاء", category: "ملابس", price: "", whatsapp: "", delivery: "الدفع عند الاستلام" });
    }
  };

  const toggleFavorite = (id) => setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const addToCart = (item) => { setCart((p) => [...p, item]); showToast(`أُضيف "${item.title.slice(0, 18)}..." للسلة`); };
  const removeFromCart = (idx) => setCart((p) => p.filter((_, i) => i !== idx));

  const shareOffer = (item) => {
    if (navigator.share) {
      navigator.share({ title: item.title, text: `عرض مباشر من ${item.seller} بثمن ${item.price} درهم`, url: window.location.href });
    } else showToast("تم نسخ رابط العرض للمشاركة");
  };

  const openWhatsApp = (item) => {
    const raw = String(item.whatsapp || "").replace(/[^0-9]/g, "");
    if (!raw) return showToast("رقم الواتساب غير متوفر");
    const phone = raw.startsWith("0") ? "212" + raw.slice(1) : raw.startsWith("212") ? raw : "212" + raw;
    const text = encodeURIComponent(`السلام عليكم ${item.seller}، شاهدت عرضكم المباشر على تطبيق LiveSouk:\n"${item.title}"\nالثمن: ${item.price} درهم\nأرغب في طلبه.`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const filteredStreams = streams.filter((item) => {
    if (activeTab === "favorites" && !favorites.includes(item.id)) return false;
    const matchCity = selectedCity === "الكل" || item.city === selectedCity;
    const matchCat = selectedCategory === "الكل" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || item.title?.toLowerCase().includes(q) || item.seller?.toLowerCase().includes(q) || item.city?.toLowerCase().includes(q);
    return matchCity && matchCat && matchQuery;
  });

  const totalCartPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div dir="rtl" className="min-h-screen bg-[#09090B] text-zinc-100 font-sans pb-28">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 backdrop-blur-xl text-white px-5 py-2.5 rounded-full shadow-2xl border border-rose-500/40 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-gradient-to-l from-rose-600 via-pink-600 to-amber-500 text-white text-[11px] font-extrabold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
        <span>توصيل سريع لجميع مدن المغرب • الدفع نقداً عند الاستلام 100%</span>
      </div>

      <header className="sticky top-0 z-40 bg-[#09090B]/85 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <LiveSoukPremiumLogo />
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث في البث المباشر، المتاجر، المدن..." className="w-full pr-11 pl-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 focus:border-rose-500 text-sm text-white placeholder:text-zinc-500 outline-none" />
          </div>
          <button type="button" onClick={() => setIsCartOpen(true)} className="relative p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">{cart.length}</span>}
          </button>
        </div>
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن قفطان، هواتف، عطور، مدينة..." className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-rose-500" />
          </div>
        </div>
      </header>

      {streams.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-3.5 overflow-x-auto pb-2 no-scrollbar">
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-dashed border-rose-500/70 flex items-center justify-center text-rose-400">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-zinc-300">بثك المباشر</span>
            </button>
            {streams.slice(0, 10).map((story) => (
              <button type="button" key={`story-${story.id}`} onClick={() => setActiveStream(story)} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                  <div className="w-[58px] h-[58px] rounded-full bg-zinc-950 flex items-center justify-center font-black text-lg text-white border-2 border-zinc-950">
                    {story.seller?.charAt(0) || "S"}
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[8px] font-black px-1.5 rounded-full border border-zinc-950">LIVE</span>
                </div>
                <span className="text-[11px] font-medium text-zinc-300 max-w-[66px] truncate">{story.seller}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pt-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-rose-600/25 via-zinc-900 to-amber-500/20 border border-white/10 p-5 sm:p-8">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[11px] font-extrabold text-amber-300 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تجربة تسوق مباشر بمعايير عالمية</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2">
                اكتشف أقوى العروض الحية في المغرب{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-400 to-amber-300">مباشرة من البائع</span>
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm">شاهد تفاصيل المنتج، اسأل البائع، واطلب بضغطة زر عبر واتساب.</p>
            </div>
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="self-start sm:self-center bg-gradient-to-l from-rose-600 to-amber-500 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl shadow-rose-600/25 shrink-0">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ابدأ عرضك المباشر</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-5 space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button type="button" key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 ${selectedCategory === cat.name ? "bg-white text-zinc-950 shadow-lg" : "bg-zinc-900 text-zinc-300 border border-white/10"}`}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CITIES.map((city) => (
            <button type="button" key={city} onClick={() => setSelectedCity(city)} className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-1 ${selectedCity === city ? "bg-rose-600 text-white" : "bg-zinc-900/60 text-zinc-400 border border-white/5"}`}>
              <MapPin className="w-3 h-3" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>{activeTab === "favorites" ? "عروضي المفضلة" : "البث المباشر الرائج"}</span>
            <span className="text-xs font-bold text-zinc-500">({filteredStreams.length})</span>
          </h2>
          {loading && <span className="text-xs text-rose-400 flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> تحميل...</span>}
        </div>

        {!loading && filteredStreams.length === 0 ? (
          <div className="bg-zinc-900/70 rounded-3xl border border-white/10 p-10 text-center space-y-3">
            <Store className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-white font-black text-base">لا توجد عروض مطابقة حالياً</h3>
            <p className="text-zinc-400 text-xs max-w-xs mx-auto">أضف عرضك الآن ليظهر في الصفحة الرئيسية وفي شريط القصص المباشرة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStreams.map((item) => (
              <article key={item.id} className="group bg-zinc-900/90 rounded-[26px] border border-white/10 overflow-hidden hover:border-rose-500/50 transition-all flex flex-col shadow-xl">
                <div onClick={() => setActiveStream(item)} className={`relative h-52 bg-gradient-to-br ${item.color || "from-rose-600 via-pink-600 to-amber-500"} p-4 text-white flex flex-col justify-between cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />LIVE
                      </span>
                      <span className="bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />{item.viewers || 34}
                      </span>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); shareOffer(item); }} className="p-2 rounded-full bg-black/35 backdrop-blur-md">
                      <Share2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <div className="self-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/40 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-black/45 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-extrabold">{item.category}</span>
                    <span className="bg-black/45 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />{item.city}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 onClick={() => setActiveStream(item)} className="font-black text-white text-base leading-snug cursor-pointer">{item.title}</h3>
                      <button type="button" onClick={() => toggleFavorite(item.id)} className="p-2 rounded-xl bg-white/5 shrink-0">
                        <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? "fill-rose-500 text-rose-500" : "text-zinc-400"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-white/10">
                      <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-zinc-950 font-black flex items-center justify-center text-[10px]">{item.seller?.charAt(0) || "م"}</span>
                        {item.seller}
                        {item.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-extrabold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />{item.rating || "5.0"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-white">{item.price} <span className="text-xs font-bold text-amber-400">درهم</span></span>
                        <span className="block text-[10px] text-emerald-400 font-bold">✓ {item.delivery || "الدفع عند الاستلام"}</span>
                      </div>
                      <button type="button" onClick={() => addToCart(item)} className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-extrabold">+ السلة</button>
                    </div>
                    <button type="button" onClick={() => openWhatsApp(item)} className="w-full py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                      <MessageCircle className="w-4 h-4" />
                      <span>اطلب مباشرة عبر واتساب</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-zinc-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl px-4 py-2 shadow-2xl flex items-center justify-around">
        <button type="button" onClick={() => { setActiveTab("home"); setSelectedCategory("الكل"); }} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${activeTab === "home" ? "text-rose-500" : "text-zinc-400"}`}>
          <Home className="w-5 h-5" /><span className="text-[10px] font-extrabold">الرئيسية</span>
        </button>
        <button type="button" onClick={() => { setActiveTab("home"); window.scrollTo({ top: 260, behavior: "smooth" }); }} className="flex flex-col items-center gap-0.5 py-1 px-3 text-zinc-400">
          <Compass className="w-5 h-5" /><span className="text-[10px] font-extrabold">اكتشف</span>
        </button>
        <button type="button" onClick={() => setIsAddModalOpen(true)} className="w-12 h-12 -mt-6 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg border-4 border-[#09090B]">
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
        <button type="button" onClick={() => setActiveTab("favorites")} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${activeTab === "favorites" ? "text-rose-500" : "text-zinc-400"}`}>
          <Heart className="w-5 h-5" /><span className="text-[10px] font-extrabold">المفضلة</span>
        </button>
        <button type="button" onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-zinc-400">
          <ShoppingBag className="w-5 h-5" /><span className="text-[10px] font-extrabold">السلة</span>
          {cart.length > 0 && <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">{cart.length}</span>}
        </button>
      </nav>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-white/15 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-base font-black flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" /><span>نشر عرض مباشر جديد</span></h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl bg-white/5 text-zinc-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddOffer} className="space-y-3.5 text-sm">
              <div>
                <label className="block font-bold text-zinc-300 mb-1 text-xs">اسم المنتج أو العرض *</label>
                <input required type="text" placeholder="مثال: قفطان مغربي فاخر 2026" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10 outline-none focus:border-rose-500 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 text-xs">اسم المتجر *</label>
                  <input required type="text" placeholder="مثال: دار الأناقة" value={formData.seller} onChange={(e) => setFormData({ ...formData, seller: e.target.value })} className="w-full px-3.5 py-3 rounded-2xl bg-zinc-950 border border-white/10 outline-none focus:border-rose-500 text-white" />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 text-xs">الثمن (درهم) *</label>
                  <input required type="number" placeholder="350" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3.5 py-3 rounded-2xl bg-zinc-950 border border-white/10 outline-none focus:border-rose-500 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 text-xs">المدينة</label>
                  <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-3 rounded-2xl bg-zinc-950 border border-white/10 text-white">
                    {CITIES.filter((c) => c !== "الكل").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 text-xs">الفئة</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-3 rounded-2xl bg-zinc-950 border border-white/10 text-white">
                    {CATEGORIES.filter((c) => c !== "الكل").map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-zinc-300 mb-1 text-xs">رقم واتساب لاستقبال الطلبات *</label>
                <input required type="tel" placeholder="06XXXXXXXX" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10 outline-none focus:border-rose-500 text-white" />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-rose-600 to-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>جاري البث...</span></> : <span>نشر العرض المباشر الآن</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="bg-zinc-900 w-full max-w-md h-full p-6 flex flex-col justify-between border-r border-white/10 text-white">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-base font-black flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-amber-400" /><span>سلة المشتريات ({cart.length})</span></h3>
                <button type="button" onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              {cart.length === 0 ? <p className="text-center text-zinc-500 py-16 text-sm">سلتك فارغة حالياً.</p> : (
                <div className="divide-y divide-white/10 max-h-[65vh] overflow-y-auto mt-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm text-white">{item.title}</p>
                        <p className="text-xs text-amber-400 font-bold mt-0.5">{item.price} درهم • {item.seller}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(idx)} className="p-2 rounded-xl text-zinc-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between font-black text-base mb-4"><span>المجموع:</span><span className="text-amber-400">{totalCartPrice} درهم</span></div>
                <button type="button" onClick={() => openWhatsApp(cart[0])} className="w-full py-3.5 rounded-2xl bg-emerald-500 text-zinc-950 font-black flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /><span>إتمام الطلب عبر واتساب</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStream && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl max-w-lg w-full overflow-hidden border border-white/15 text-white shadow-2xl">
            <div className={`h-60 bg-gradient-to-br ${activeStream.color || "from-rose-600 via-pink-600 to-amber-500"} p-6 flex flex-col justify-between`}>
              <div className="flex justify-between items-center">
                <span className="bg-rose-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />LIVE • {activeStream.city}
                </span>
                <button type="button" onClick={() => setActiveStream(null)} className="bg-black/40 p-2 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <h3 className="text-2xl font-black leading-snug">{activeStream.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-white/10">
                <div>
                  <p className="text-[11px] text-zinc-400">المتجر البائع</p>
                  <p className="font-black text-base text-white flex items-center gap-1">{activeStream.seller}<ShieldCheck className="w-4 h-4 text-sky-400" /></p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-zinc-400">الثمن</p>
                  <p className="text-2xl font-black text-amber-400">{activeStream.price} درهم</p>
                </div>
              </div>
              <button type="button" onClick={() => openWhatsApp(activeStream)} className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 text-zinc-950 font-black flex items-center justify-center gap-2 shadow-lg">
                <MessageCircle className="w-5 h-5" /><span>تواصل واطلب الآن عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
