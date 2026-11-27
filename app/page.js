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
  {
    bg: "from-rose-700 via-rose-600 to-amber-500",
    badge: "bg-amber-400 text-slate-950",
  },
  {
    bg: "from-slate-900 via-indigo-950 to-rose-700",
    badge: "bg-rose-500 text-white",
  },
  {
    bg: "from-emerald-800 via-teal-700 to-amber-500",
    badge: "bg-amber-300 text-slate-950",
  },
  {
    bg: "from-amber-700 via-orange-600 to-rose-600",
    badge: "bg-white text-rose-700",
  },
  {
    bg: "from-purple-900 via-fuchsia-800 to-orange-500",
    badge: "bg-amber-400 text-slate-950",
  },
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
            {/* قوس مغربي وحقيبة تسوق */}
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
            {/* أيقونة تشغيل البث المباشر داخل الحقيبة */}
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
        <div className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Live<span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-600 to-amber-500">Souk</span>
          </span>
        </div>
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
    const randomTheme =
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
      color: randomTheme.bg,
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
      {/* إشعار عائم */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/30 flex items-center gap-2.5 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-amber-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <LiveSoukLogo />

          {/* شريط البحث للشاشات المتوسطة والكبيرة */}
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
              className="bg-gradient-to-l from-rose-700 via-rose-600 to-amber-500 hover:opacity-95 text-white px-4 py-2.5 rounded-2xl text-xs s
