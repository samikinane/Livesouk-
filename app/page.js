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

const INITIAL_STREAMS = [
  {
    id: 1001,
    title: "جلابة مغربية عصرية طرز الرباطي - بث مباشر من الورشة",
    seller: "دار الأناقة الفاسية",
    city: "فاس",
    category: "ملابس",
    price: 349,
    whatsapp: "212600000001",
    delivery: "الدفع عند الاستلام",
    rating: 4.9,
    verified: true,
    viewers: 142,
    is_live: true,
    color: "from-rose-500 to-orange-400",
  },
  {
    id: 1002,
    title: "سماعات بلوتوث أصلية مع ضمان سنة وتجربة الصوت مباشرة",
    seller: "تيك ستور كازا",
    city: "الدار البيضاء",
    category: "إلكترونيات",
    price: 199,
    whatsapp: "212600000002",
    delivery: "الدفع عند الاستلام",
    rating: 4.8,
    verified: true,
    viewers: 98,
    is_live: true,
    color: "from-indigo-600 to-blue-500",
  },
  {
    id: 1003,
    title: "مجموعة زيت الأركان التجميلي العضوي 100% من التعاونية",
    seller: "تعاونية سوس",
    city: "أكادير",
    category: "تجميل",
    price: 160,
    whatsapp: "212600000003",
    delivery: "الدفع عند الاستلام",
    rating: 5.0,
    verified: true,
    viewers: 215,
    is_live: true,
    color: "from-amber-500 to-emerald-500",
  },
];

const CARD_GRADIENTS = [
  "from-rose-500 to-orange-400",
  "from-indigo-600 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-purple-600 to-pink-500",
  "from-amber-500 to-red-500",
];

export default function LiveSoukHome() {
  const [streams, setStreams] = useState(INITIAL_STREAMS);
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

  // جلب العروض الحقيقية من Supabase عند فتح الموقع
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
        if (Array.isArray(dbStreams) && dbStreams.length > 0) {
          setStreams([...dbStreams, ...INITIAL_STREAMS]);
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

  // إضافة عرض جديد وحفظه في Supabase
  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.seller || !formData.price) return;

    setSubmitting(true);
    const randomGradient =
      CARD_GRADIENTS[Math.floor(Math.random() * CARD_GRADIENTS.length)];

    const cleanWhatsapp = formData.whatsapp
      .replace(/\s+/g, "")
      .replace(/^0/, "212");

    const newOfferPayload = {
      title: formData.title.trim(),
      seller: formData.seller.trim(),
      city: formData.city,
      category: formData.category,
      price: Number(formData.price),
      whatsapp: cleanWhatsapp || "212600000000",
      delivery: formData.delivery,
      rating: 5.0,
      verified: true,
      viewers: Math.floor(Math.random() * 40) + 12,
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
        showToast("تم نشر عرضك وحفظه لجميع الزوار بنجاح!");
      } else {
        setStreams((prev) => [{ ...newOfferPayload, id: Date.now() }, ...prev]);
        showToast("تم إضافة العرض مؤقتاً");
      }
    } catch (err) {
      setStreams((prev) => [{ ...newOfferPayload, id: Date.now() }, ...prev]);
      showToast("تم إضافة العرض");
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
    showToast(`تمت إضافة "${item.title.slice(0, 22)}..." إلى السلة`);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const openWhatsApp = (item) => {
    const phone = (item.whatsapp || "212600000000")
      .replace(/[^0-9]/g, "")
      .replace(/^0/, "212");
    const text = encodeURIComponent(
      `السلام عليكم ${item.seller}، شاهدت عرضكم على LiveSouk:\n"${item.title}"\nالثمن: ${item.price} درهم\nأرغب في طلبه (${item.delivery}).`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const filteredStreams = streams.filter((item) => {
    const matchCity = selectedCity === "الكل" || item.city === selectedCity;
    const matchCat =
      selectedCategory === "الكل" || item.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCat && matchQuery;
  });

  const totalCartPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* إشعار علوي */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* الشريط العلوي */}
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
              onClick={() => setIsAddModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>أضف عرضك</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              aria-label="السلة"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {cart.length}
                </span
