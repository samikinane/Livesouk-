"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  MapPin,
  MessageCircle,
  Heart,
  Plus,
  X,
  Star,
  ShieldCheck,
  Truck,
  Eye,
  Flame,
  Trash2,
  CheckCircle2,
  Sparkles,
  Loader2,
  Play,
  Store,
  Tag,
} from "lucide-react";

const SUPABASE_URL = "https://yvicrakxdkotiiqqaytp.supabase.co";
const SUPABASE_KEY = "sb_publishable_n07Cj8nMSHGFmMpuwrArrQ_S8MPBUAx";

const CITIES = [
  "الكل",
  "الدار البيضاء",
  "الرباط",
  "مراكش",
  "طنجة",
  "فاس",
  "أكادير",
  "مكناس",
  "وجدة",
];

const CATEGORIES = [
  "الكل",
  "ملابس",
  "إلكترونيات",
  "تجميل",
  "منزل وديكور",
  "عطور",
  "إكسسوارات",
];

const CARD_THEMES = [
  "from-rose-700 via-rose-600 to-amber-500",
  "from-slate-900 via-indigo-950 to-rose-700",
  "from-emerald-800 via-teal-700 to-amber-500",
  "from-amber-700 via-orange-600 to-rose-600",
  "from-purple-900 via-fuchsia-800 to-orange-500",
];

function LiveSoukLogo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-rose-600/25">
        <div className="w-full h-full rounded-[14px] bg-slate-950/15 backdrop-blur-sm flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 14V11.5C14 8.46243 16.4624 6 19.5 6H20.5C23.5376 6 26 8.46243 26 11.5V14"
              stroke="#FDE68A"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <rect
              x="9"
              y="13.5"
              width="22"
              height="20"
              rx="6"
              fill="white"
              fillOpacity="0.95"
            />
            <path
              d="M17.5 19.5L24.5 23.5L17.5 27.5V19.5Z"
              fill="#BE123C"
            />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-white"></span>
        </span>
      </div>

      <div>
        <span className="text-2xl font-black tracking-tight text-slate-900">
          Live
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-600 to-amber-500">
            Souk
          </span>
        </span>
        <p className="text-[11px] font-bold text-amber-700/90 -mt-1">
          سوق المغرب المباشر ✨
        </p>
      </div>
    </div>
  );
}

export default function LiveSoukHome() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    title: "",
    seller: "",
    city: "الدار البيضاء",
    category: "ملابس",
    price: "",
    whatsapp: "",
    delivery: "الدفع عند الاستلام",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchStreams = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/streams?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (res.ok) {
        const dbStreams = await res.json();
        if (Array.isArray(dbStreams)) {
          setStreams(dbStreams);
        }
      }
    } catch (err) {
      console.error("Error loading streams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.seller || !formData.price || !formData.whatsapp) return;

    setSubmitting(true);
    const randomColor =
      CARD_THEMES[Math.floor(Math.random() * CARD_THEMES.length)];

    const cleanWhatsapp = formData.whatsapp
      .replace(/[^0-9]/g, "")
      .replace(/^0/, "212");

    const newOfferPayload = {
      title: formData.title.trim(),
      seller: formData.seller.trim(),
      city: formData.city,
      category: formData.category,
      price: Number(formData.price),
      whatsapp: cleanWhatsapp,
      delivery: formData.delivery,
      rating: 5.0,
      verified: true,
      viewers: Math.floor(Math.random() * 45) + 18,
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
        body: JSON.stringify(newOfferPayload),
      });

      if (res.ok) {
        const savedRows = await res.json();
        const createdItem = savedRows[0] || {
          ...newOfferPayload,
          id: Date.now(),
        };
        setStreams((prev) => [createdItem, ...prev]);
        showToast("تم نشر عرضك المباشر بنجاح!");
      } else {
        showToast("تعذر الحفظ في قاعدة البيانات، تأكد من الاتصال");
      }
    } catch (err) {
      showToast("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSubmitting(false);
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        seller: "",
        city: "الدار البيضاء",
        category: "ملابس",
        price: "",
        whatsapp: "",
        delivery: "الدفع عند الاستلام",
      });
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
    showToast(`أُضيف "${item.title.slice(0, 18)}..." إلى سلتك`);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const openWhatsApp = (item) => {
    const rawPhone = String(item.whatsapp || "").replace(/[^0-9]/g, "");
    if (!rawPhone) {
      showToast("رقم الواتساب غير متوفر لهذا العرض");
      return;
    }
    const phone = rawPhone.startsWith("0")
      ? "212" + rawPhone.slice(1)
      : rawPhone.startsWith("212")
      ? rawPhone
      : "212" + rawPhone;

    const text = encodeURIComponent(
      `السلام عليكم ${item.seller}، شاهدت عرضكم المباشر على LiveSouk:\n"${item.title}"\nالثمن: ${item.price} درهم\nأرغب في طلبه.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const filteredStreams = streams.filter((item) => {
    const matchCity = selectedCity === "الكل" || item.city === selectedCity;
    const matchCat =
      selectedCategory === "الكل" || item.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCat && matchQuery;
  });

  const totalCartPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans pb-12">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/30 flex items-center gap-2.5 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-amber-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <LiveSoukLogo />

          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-rose-500 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قفطان، إلكترونيات، مدينة..."
              className="w-full pr-11 pl-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-amber-200/80 focus:border-rose-500 focus:bg-white text-sm outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-l from-rose-700 via-rose-600 to-amber-500 hover:opacity-95 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>أضف عرضك</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-slate-800 transition"
              aria-label="السلة"
            >
              <ShoppingBag className="w-5 h-5 text-rose-700" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج، متجر، أو مدينة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-amber-200/80 text-sm outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-5">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-bl from-slate-950 via-rose-950 to-rose-700 text-white p-6 sm:p-9 shadow-xl">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #FBBF24 2px, transparent 2px), radial-gradient(circle at 80% 80%, #FBBF24 2px, transparent 2px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-amber-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تجربة التسوق المباشر الأولى في المغرب</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-3">
              شاهد العروض الحية، واطلب مباشرة من{" "}
              <span className="text-amber-400">قلب السوق المغربي</span>
            </h1>

            <p className="text-rose-100/90 text-sm sm:text-base mb-6 leading-relaxed">
              تواصل فوري مع البائعين عبر واتساب، مع ضمان الدفع عند الاستلام والتوصيل لجميع المدن.
            </p>

            <div className="flex flex-wrap gap-2.5 text-xs font-bold">
              <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur px-3.5 py-2 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                متاجر مغربية موثوقة
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur px-3.5 py-2 rounded-2xl">
                <Truck className="w-4 h-4 text-emerald-400" />
                الدفع عند الاستلام
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-6 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? "bg-slate-950 text-amber-400 shadow-md"
                  : "bg-white text-slate-700 border border-amber-200/70 hover:border-rose-400"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{cat}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CITIES.map((city) => (
            <button
              type="button"
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 ${
                selectedCity === city
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-white"
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                العروض المباشرة الآن
              </h2>
              <p className="text-xs text-slate-500">
                {filteredStreams.length} عرض متاح للطلب الفوري
              </p>
            </div>
          </div>

          {loading && (
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> جاري التحديث...
            </span>
          )}
        </div>

        {!loading && filteredStreams.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-amber-200/80 p-10 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-slate-900 font-black text-lg">
              لا توجد عروض في هذا القسم حالياً
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              ابدأ الآن بنشر أول عرض مباشر لمتجرك واستقبل طلبات الزبائن على واتساب.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-l from-rose-700 to-amber-500 text-white px-6 py-3 rounded-2xl text-sm font-extrabold shadow-lg shadow-rose-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>انشر عرضك الأول الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-[26px] border border-amber-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div
                  onClick={() => setActiveStream(item)}
                  className={`relative h-48 bg-gradient-to-br ${
                    item.color || "from-rose-700 via-rose-600 to-amber-500"
                  } p-4 text-white flex flex-col justify-between cursor-pointer overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/15">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      مباشر
                    </span>

                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.viewers || 24}
                    </span>
                  </div>

                  <div className="self-center w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>

                  <div className="flex items-center justify-between z-10">
                    <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-xl text-[11px] font-black shadow">
                      {item.category}
                    </span>
                    <span className="bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      {item.city}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3
                        onClick={() => setActiveStream(item)}
                        className="font-black text-slate-900 text-base leading-snug cursor-pointer group-hover:text-rose-700 transition"
                      >
                        {item.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 shrink-0 transition"
                        aria-label="إضافة للمفضلة"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(item.id)
                              ? "fill-rose-600 text-rose-600"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center text-[11px]">
                          {item.seller?.charAt(0) || "م"}
                        </span>
                        {item.seller}
                        {item.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </span>

                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-extrabold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {item.rating || "5.0"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-rose-700">
                          {item.price}{" "}
                          <span className="text-xs font-extrabold text-slate-500">
                            درهم
                          </span>
                        </span>
                        <span className="block text-[11px] text-emerald-700 font-bold">
                          ✓ {item.delivery || "الدفع عند الاستلام"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold transition"
                      >
                        + السلة
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openWhatsApp(item)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-[0.99]"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>اطلب الآن عبر واتساب</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  نشر عرض مباشر جديد
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOffer} className="space-y-4 text-sm">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  اسم المنتج أو العرض *
                </label>
                <input
                  required
                  type="text"
                  placeholder="مثال: جلابة مغربية مطروزة باليد"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-amber-200 outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    اسم المتجر *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: دار الأصالة"
                    value={formData.seller}
                    onChange={(e) =>
                      setFormData({ ...formData, seller: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-amber-200 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    الثمن (درهم) *
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="290"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-amber-200 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    المدينة
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-2xl bg-[#FAF8F5] border border-amber-200 outline-none focus:border-rose-500"
                  >
                    {CITIES.filter((c) => c !== "الكل").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5">
                    الفئة
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-2xl bg-[#FAF8F5] border border-amber-200 outline-none focus:border-rose-500"
                  >
                    {CATEGORIES.filter((c) => c !== "الكل").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  رقم الواتساب لاستقبال الطلبات *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="06XXXXXXXX"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-amber-200 outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-rose-700 via-rose-600 to-amber-500 text-white font-black text-base shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري النشر...</span>
                  </>
                ) : (
                  <span>نشر العرض في LiveSouk الآن</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-700" />
                  <span>سلة المشتريات ({cart.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-slate-500 py-16 font-medium">
                  سلتك فارغة حالياً.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[65vh] overflow-y-auto mt-2">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-extrabold text-sm text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-rose-700 font-bold mt-0.5">
                          {item.price} درهم • {item.seller}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(idx)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between font-black text-base mb-4">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-rose-700">{totalCartPrice} درهم</span>
                </div>
                <button
                  type="button"
                  onClick={() => openWhatsApp(cart[0])}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>إتمام الطلب عبر واتساب</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStream && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200">
            <div
              className={`h-56 bg-gradient-to-br ${
                activeStream.color || "from-rose-700 via-rose-600 to-amber-500"
              } p-6 text-white flex flex-col justify-between`}
            >
              <div className="flex justify-between items-center">
                <span className="bg-slate-950/75 backdrop-blur px-3.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  بث مباشر • {activeStream.city}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStream(null)}
                  className="bg-black/35 p-2 rounded-full hover:bg-black/55 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-2xl font-black leading-snug">
                {activeStream.title}
              </h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between bg-[#FAF8F5] p-4 rounded-2xl border border-amber-200/70">
                <div>
                  <p className="text-xs text-slate-500 font-bold">المتجر البائع</p>
                  <p className="font-black text-base text-slate-900">
                    {activeStream.seller}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold">الثمن النهائي</p>
                  <p className="text-2xl font-black text-rose-700">
                    {activeStream.price} درهم
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openWhatsApp(activeStream)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5" />
                <span>تواصل واطلب مباشرة عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
