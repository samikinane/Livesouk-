"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Radio,
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
  Filter,
  Trash2,
  CheckCircle2,
  Sparkles,
  Loader2,
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

const CARD_GRADIENTS = [
  "from-rose-500 to-orange-400",
  "from-indigo-600 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-purple-600 to-pink-500",
  "from-amber-500 to-red-500",
];

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
    const randomGradient =
      CARD_GRADIENTS[Math.floor(Math.random() * CARD_GRADIENTS.length)];

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
      viewers: Math.floor(Math.random() * 35) + 10,
      is_live: true,
      color: randomGradient,
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
        showToast("تم نشر عرضك الحقيقي بنجاح!");
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
    showToast(`تمت إضافة "${item.title.slice(0, 20)}..." إلى السلة`);
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
      `السلام عليكم ${item.seller}، شاهدت عرضكم على LiveSouk:\n"${item.title}"\nالثمن: ${item.price} درهم\nأرغب في طلبه.`
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
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Live<span className="text-rose-600">Souk</span>
              </h1>
              <p className="text-[11px] text-slate-500 -mt-1">
                التسوق المباشر في المغرب
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج، مدينة، أو متجر..."
              className="w-full pr-10 pl-4 py-2 rounded-full bg-slate-100 border border-transparent focus:border-rose-500 focus:bg-white text-sm outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>أضف عرضك</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              aria-label="السلة"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج أو مدينة..."
              className="w-full pr-10 pl-4 py-2 rounded-full bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-5">
        <div className="rounded-3xl bg-gradient-to-l from-rose-600 via-rose-500 to-orange-500 text-white p-6 sm:p-8 shadow-lg">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              أول سوق مغربي للتسوق المباشر
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug mb-2">
              اكتشف عروض LiveSouk الحية
            </h2>
            <p className="text-rose-50 text-sm sm:text-base mb-5 leading-relaxed">
              تواصل مع البائع مباشرة عبر واتساب، واستفد من الدفع عند الاستلام في جميع مدن المغرب.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                بائعون موثوقون
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
                <Truck className="w-4 h-4 text-amber-300" />
                الدفع عند الاستلام
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-6 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> الفئات:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5" /> المدينة:
          </span>
          {CITIES.map((city) => (
            <button
              type="button"
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                selectedCity === city
                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <span>العروض المباشرة المتاحة ({filteredStreams.length})</span>
          </h3>
          {loading && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> جاري التحميل...
            </span>
          )}
        </div>

        {!loading && filteredStreams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <p className="text-slate-600 font-bold text-base">
              لا توجد عروض منشورة حالياً في هذه الفئة.
            </p>
            <p className="text-slate-400 text-sm">
              كن أول من ينشر عرضه المباشر برقم واتساب حقيقي!
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>أضف أول عرض الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStreams.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div
                  onClick={() => setActiveStream(item)}
                  className={`h-44 bg-gradient-to-br ${
                    item.color || "from-rose-500 to-orange-400"
                  } p-4 text-white flex flex-col justify-between cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      مباشر الآن
                    </span>
                    <span className="bg-black/40 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.viewers || 15}
                    </span>
                  </div>

                  <div>
                    <span className="inline-block bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-md text-[11px] font-bold mb-1">
                      {item.category}
                    </span>
                    <p className="text-xs text-white/90 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.city}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4
                        onClick={() => setActiveStream(item)}
                        className="font-bold text-slate-900 text-base leading-snug cursor-pointer hover:text-rose-600 transition"
                      >
                        {item.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        className="p-1.5 rounded-full hover:bg-slate-100 shrink-0"
                        aria-label="مفضلة"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(item.id)
                              ? "fill-rose-500 text-rose-500"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        {item.seller}
                        {item.verified && (
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {item.rating || "5.0"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-black text-rose-600">
                          {item.price} درهم
                        </span>
                        <span className="block text-[11px] text-emerald-600 font-semibold">
                          {item.delivery || "الدفع عند الاستلام"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                      >
                        + السلة
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openWhatsApp(item)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>اطلب مباشرة عبر واتساب</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                انشر عرضك المباشر الآن
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOffer} className="space-y-3.5 text-sm">
              <div>
                <label className="block font-bold mb-1">اسم المنتج أو العرض *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: قفطان مغربي أصيل"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">اسم المتجر / البائع *</label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: متجر النور"
                    value={formData.seller}
                    onChange={(e) =>
                      setFormData({ ...formData, seller: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">الثمن (بالدرهم) *</label>
                  <input
                    required
                    type="number"
                    placeholder="250"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">المدينة</label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-rose-500"
                  >
                    {CITIES.filter((c) => c !== "الكل").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">الفئة</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-rose-500"
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
                <label className="block font-bold mb-1">
                  رقم الواتساب الحقيقي لاستقبال الطلبات *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="06XXXXXXXX"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري الحفظ والنشر...</span>
                  </>
                ) : (
                  <span>نشر العرض للجميع الآن</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-black">سلة المشتريات ({cart.length})</h3>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-slate-500 py-12">سلتك فارغة حالياً.</p>
              ) : (
                <div className="divide-y max-h-[65vh] overflow-y-auto mt-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-rose-600 font-bold">
                          {item.price} درهم • {item.seller}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex justify-between font-black text-base mb-3">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-rose-600">{totalCartPrice} درهم</span>
                </div>
                <button
                  type="button"
                  onClick={() => openWhatsApp(cart[0])}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div
              className={`h-52 bg-gradient-to-br ${
                activeStream.color || "from-rose-500 to-orange-400"
              } p-5 text-white flex flex-col justify-between`}
            >
              <div className="flex justify-between items-center">
                <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
                  بث مباشر • {activeStream.city}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStream(null)}
                  className="bg-black/30 p-1.5 rounded-full hover:bg-black/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-black">{activeStream.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">البائع</p>
                  <p className="font-bold text-base">{activeStream.seller}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">الثمن</p>
                  <p className="text-2xl font-black text-rose-600">
                    {activeStream.price} درهم
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openWhatsApp(activeStream)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>تواصل واطلب عبر واتساب الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
