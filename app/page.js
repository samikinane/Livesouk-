"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag, Search, MapPin, MessageCircle, Heart, Plus, X,
  Star, ShieldCheck, Eye, Flame, Trash2, CheckCircle2,
  Sparkles, Loader2, Play, Store, Home, Compass, Zap, Share2,
} from "lucide-react";

const SUPABASE_URL = "https://yvicrakxdkotiiqqaytp.supabase.co";
const SUPABASE_KEY = "sb_publishable_n07Cj8nMSHGFmMpuwrArrQ_S8MPBUAx";

const COUNTRIES = {
  MA: {
    name: "المغرب • Maroc", flag: "🇲🇦", secondLang: "fr", currency: "درهم / MAD", dial: "212",
    cities: [
      { ar: "الدار البيضاء", alt: "Casablanca" }, { ar: "الرباط", alt: "Rabat" },
      { ar: "مراكش", alt: "Marrakech" }, { ar: "طنجة", alt: "Tanger" },
      { ar: "فاس", alt: "Fès" }, { ar: "أكادير", alt: "Agadir" },
      { ar: "مكناس", alt: "Meknès" }, { ar: "وجدة", alt: "Oujda" },
      { ar: "القنيطرة", alt: "Kénitra" }, { ar: "تطوان", alt: "Tétouan" },
      { ar: "سلا", alt: "Salé" }, { ar: "تمارة", alt: "Témara" },
      { ar: "المحمدية", alt: "Mohammedia" }, { ar: "الجديدة", alt: "El Jadida" },
      { ar: "بني ملال", alt: "Béni Mellal" }, { ar: "آسفي", alt: "Safi" },
      { ar: "الناظور", alt: "Nador" }, { ar: "خريبكة", alt: "Khouribga" },
      { ar: "سطات", alt: "Settat" }, { ar: "برشيد", alt: "Berrechid" },
      { ar: "تازة", alt: "Taza" }, { ar: "الحسيمة", alt: "Al Hoceïma" },
      { ar: "العرائش", alt: "Larache" }, { ar: "القصر الكبير", alt: "Ksar El Kébir" },
      { ar: "الخميسات", alt: "Khémisset" }, { ar: "كلميم", alt: "Guelmim" },
      { ar: "العيون", alt: "Laâyoune" }, { ar: "الداخلة", alt: "Dakhla" },
      { ar: "ورزازات", alt: "Ouarzazate" }, { ar: "الرشيدية", alt: "Errachidia" },
      { ar: "الصويرة", alt: "Essaouira" }, { ar: "تارودانت", alt: "Taroudant" },
      { ar: "إنزكان", alt: "Inezgane" }, { ar: "آيت ملول", alt: "Aït Melloul" },
      { ar: "بركان", alt: "Berkane" }, { ar: "تاوريرت", alt: "Taourirt" },
      { ar: "سيدي قاسم", alt: "Sidi Kacem" }, { ar: "سيدي سليمان", alt: "Sidi Slimane" },
      { ar: "صفرو", alt: "Sefrou" }, { ar: "إفران", alt: "Ifrane" },
      { ar: "خنيفرة", alt: "Khénifra" }, { ar: "الفقيه بن صالح", alt: "Fquih Ben Salah" },
      { ar: "وادي زم", alt: "Oued Zem" }, { ar: "اليوسفية", alt: "Youssoufia" },
      { ar: "بن جرير", alt: "Ben Guerir" }, { ar: "قلعة السراغنة", alt: "El Kelâa des Sraghna" },
      { ar: "تيزنيت", alt: "Tiznit" }, { ar: "طانطان", alt: "Tan-Tan" },
      { ar: "السمارة", alt: "Smara" }, { ar: "زاكورة", alt: "Zagora" },
      { ar: "ميدلت", alt: "Midelt" }, { ar: "شفشاون", alt: "Chefchaouen" },
      { ar: "وزان", alt: "Ouezzane" }, { ar: "المضيق", alt: "M'diq" },
      { ar: "الفنيدق", alt: "Fnideq" }, { ar: "أصيلة", alt: "Asilah" },
    ],
  },
  DZ: {
    name: "الجزائر • Algérie", flag: "🇩🇿", secondLang: "fr", currency: "د.ج / DZD", dial: "213",
    cities: [
      { ar: "الجزائر العاصمة", alt: "Alger" }, { ar: "وهران", alt: "Oran" },
      { ar: "قسنطينة", alt: "Constantine" }, { ar: "عنابة", alt: "Annaba" },
      { ar: "البليدة", alt: "Blida" }, { ar: "باتنة", alt: "Batna" },
      { ar: "سطيف", alt: "Sétif" }, { ar: "سيدي بلعباس", alt: "Sidi Bel Abbès" },
      { ar: "بسكرة", alt: "Biskra" }, { ar: "تبسة", alt: "Tébessa" },
      { ar: "تلمسان", alt: "Tlemcen" }, { ar: "بجاية", alt: "Béjaïa" },
      { ar: "تيارت", alt: "Tiaret" }, { ar: "ورقلة", alt: "Ouargla" },
      { ar: "الشلف", alt: "Chlef" }, { ar: "تيزي وزو", alt: "Tizi Ouzou" },
      { ar: "بشار", alt: "Béchar" }, { ar: "مستغانم", alt: "Mostaganem" },
      { ar: "برج بوعريريج", alt: "Bordj Bou Arreridj" }, { ar: "سكيكدة", alt: "Skikda" },
      { ar: "جيجل", alt: "Jijel" }, { ar: "المسيلة", alt: "M'Sila" },
      { ar: "غرداية", alt: "Ghardaïa" }, { ar: "الوادي", alt: "El Oued" },
    ],
  },
  TN: {
    name: "تونس • Tunisie", flag: "🇹🇳", secondLang: "fr", currency: "د.ت / TND", dial: "216",
    cities: [
      { ar: "تونس العاصمة", alt: "Tunis" }, { ar: "صفاقس", alt: "Sfax" },
      { ar: "سوسة", alt: "Sousse" }, { ar: "القيروان", alt: "Kairouan" },
      { ar: "بنزرت", alt: "Bizerte" }, { ar: "قابس", alt: "Gabès" },
      { ar: "أريانة", alt: "Ariana" }, { ar: "قفصة", alt: "Gafsa" },
      { ar: "المنستير", alt: "Monastir" }, { ar: "بن عروس", alt: "Ben Arous" },
      { ar: "القصرين", alt: "Kasserine" }, { ar: "مدنين", alt: "Médenine" },
      { ar: "نابل", alt: "Nabeul" }, { ar: "تطاوين", alt: "Tataouine" },
      { ar: "المهدية", alt: "Mahdia" }, { ar: "جندوبة", alt: "Jendouba" },
      { ar: "الكاف", alt: "Le Kef" }, { ar: "توزر", alt: "Tozeur" },
    ],
  },
  SA: {
    name: "السعودية • Saudi Arabia", flag: "🇸🇦", secondLang: "en", currency: "ر.س / SAR", dial: "966",
    cities: [
      { ar: "الرياض", alt: "Riyadh" }, { ar: "جدة", alt: "Jeddah" },
      { ar: "مكة المكرمة", alt: "Makkah" }, { ar: "المدينة المنورة", alt: "Madinah" },
      { ar: "الدمام", alt: "Dammam" }, { ar: "الخبر", alt: "Khobar" },
      { ar: "الظهران", alt: "Dhahran" }, { ar: "الطائف", alt: "Taif" },
      { ar: "تبوك", alt: "Tabuk" }, { ar: "بريدة", alt: "Buraidah" },
      { ar: "خميس مشيط", alt: "Khamis Mushait" }, { ar: "أبها", alt: "Abha" },
      { ar: "حائل", alt: "Hail" }, { ar: "نجران", alt: "Najran" },
      { ar: "جازان", alt: "Jazan" }, { ar: "ينبع", alt: "Yanbu" },
      { ar: "الجبيل", alt: "Jubail" }, { ar: "الأحساء", alt: "Al Ahsa" },
      { ar: "القطيف", alt: "Qatif" }, { ar: "عرعر", alt: "Arar" },
      { ar: "سكاكا", alt: "Sakaka" }, { ar: "الباحة", alt: "Al Bahah" },
    ],
  },
  AE: {
    name: "الإمارات • UAE", flag: "🇦🇪", secondLang: "en", currency: "د.إ / AED", dial: "971",
    cities: [
      { ar: "دبي", alt: "Dubai" }, { ar: "أبوظبي", alt: "Abu Dhabi" },
      { ar: "الشارقة", alt: "Sharjah" }, { ar: "العين", alt: "Al Ain" },
      { ar: "عجمان", alt: "Ajman" }, { ar: "رأس الخيمة", alt: "Ras Al Khaimah" },
      { ar: "الفجيرة", alt: "Fujairah" }, { ar: "أم القيوين", alt: "Umm Al Quwain" },
      { ar: "خورفكان", alt: "Khor Fakkan" }, { ar: "الظفرة", alt: "Al Dhafra" },
    ],
  },
  EG: {
    name: "مصر • Egypt", flag: "🇪🇬", secondLang: "en", currency: "ج.م / EGP", dial: "20",
    cities: [
      { ar: "القاهرة", alt: "Cairo" }, { ar: "الإسكندرية", alt: "Alexandria" },
      { ar: "الجيزة", alt: "Giza" }, { ar: "شبرا الخيمة", alt: "Shubra El Kheima" },
      { ar: "بورسعيد", alt: "Port Said" }, { ar: "السويس", alt: "Suez" },
      { ar: "المنصورة", alt: "Mansoura" }, { ar: "طنطا", alt: "Tanta" },
      { ar: "أسيوط", alt: "Asyut" }, { ar: "الإسماعيلية", alt: "Ismailia" },
      { ar: "الفيوم", alt: "Faiyum" }, { ar: "الزقازيق", alt: "Zagazig" },
      { ar: "دمياط", alt: "Damietta" }, { ar: "أسوان", alt: "Aswan" },
      { ar: "المنيا", alt: "Minya" }, { ar: "دمنهور", alt: "Damanhur" },
      { ar: "بني سويف", alt: "Beni Suef" }, { ar: "الأقصر", alt: "Luxor" },
      { ar: "قنا", alt: "Qena" }, { ar: "سوهاج", alt: "Sohag" },
      { ar: "الغردقة", alt: "Hurghada" }, { ar: "شرم الشيخ", alt: "Sharm El Sheikh" },
    ],
  },
  QA: {
    name: "قطر • Qatar", flag: "🇶🇦", secondLang: "en", currency: "ر.ق / QAR", dial: "974",
    cities: [
      { ar: "الدوحة", alt: "Doha" }, { ar: "الريان", alt: "Al Rayyan" },
      { ar: "الوكرة", alt: "Al Wakrah" }, { ar: "الخور", alt: "Al Khor" },
      { ar: "أم صلال", alt: "Umm Salal" }, { ar: "الضعاين", alt: "Al Daayen" },
      { ar: "الشمال", alt: "Al Shamal" }, { ar: "الشيحانية", alt: "Al-Shahaniya" },
    ],
  },
  KW: {
    name: "الكويت • Kuwait", flag: "🇰🇼", secondLang: "en", currency: "د.ك / KWD", dial: "965",
    cities: [
      { ar: "مدينة الكويت", alt: "Kuwait City" }, { ar: "حولي", alt: "Hawalli" },
      { ar: "السالمية", alt: "Salmiya" }, { ar: "الفروانية", alt: "Farwaniya" },
      { ar: "الأحمدي", alt: "Ahmadi" }, { ar: "الجهراء", alt: "Jahra" },
      { ar: "مبارك الكبير", alt: "Mubarak Al-Kabeer" }, { ar: "الفحيحيل", alt: "Fahaheel" },
    ],
  },
};

const CATEGORIES = [
  { id: "ملابس", icon: "👗", ar: "ملابس", fr: "Mode", en: "Fashion" },
  { id: "إلكترونيات", icon: "📱", ar: "إلكترونيات", fr: "Tech", en: "Electronics" },
  { id: "تجميل", icon: "💄", ar: "تجميل", fr: "Beauté", en: "Beauty" },
  { id: "منزل وديكور", icon: "🛋️", ar: "منزل وديكور", fr: "Maison", en: "Home" },
  { id: "عطور", icon: "✨", ar: "عطور", fr: "Parfums", en: "Perfumes" },
];

const SAFE_GRADIENTS = [
  "linear-gradient(135deg, #B44328 0%, #7C2D12 50%, #2E5A44 100%)",
  "linear-gradient(135deg, #2E5A44 0%, #143D2B 55%, #B44328 100%)",
  "linear-gradient(135deg, #9A3412 0%, #B44328 55%, #D4A33C 100%)",
  "linear-gradient(135deg, #1E3A2F 0%, #2E5A44 50%, #92400E 100%)",
];

const ZELLIGE_BG_STYLE = {
  backgroundColor: "#F7F3EB",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23B44328' stroke-width='1' stroke-opacity='0.09'%3E%3Cpolygon points='32,4 40,24 60,32 40,40 32,60 24,40 4,32 24,24'/%3E%3Crect x='16' y='16' width='32' height='32' transform='rotate(45 32 32)'/%3E%3Ccircle cx='32' cy='32' r='6' stroke='%232E5A44' stroke-opacity='0.12'/%3E%3C/g%3E%3C/svg%3E")`,
};

function LiveSoukSoukPinLogo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E5DEC9] shadow-sm flex items-center justify-center shrink-0">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
          <path d="M12 10H28V18H25V13.5C25 11.5 20 9.5 20 9.5C20 9.5 15 11.5 15 13.5V19H12V10Z" fill="#B44328" />
          <path d="M16.5 19V14.5C16.5 13.2 20 11.8 20 11.8C20 11.8 23.5 13.2 23.5 14.5V17" stroke="#D4A33C" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 21H15.5V35H23L25 38H12V21Z" fill="#B44328" />
          <path d="M27.5 19C22.8 19 19 22.8 19 27.5C19 33.2 27.5 39 27.5 39C27.5 39 36 33.2 36 27.5C36 22.8 32.2 19 27.5 19Z" fill="#2E5A44" />
          <circle cx="27.5" cy="27" r="4.5" fill="#FAF7F2" />
          <circle cx="27.5" cy="27" r="2.3" fill="#D4A33C" />
          <path d="M32 14.5C35.5 15.2 38 18 38.5 21.5" stroke="#D4A33C" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 11C37.5 12 41.5 16.2 42.2 21.8" stroke="#B44328" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <span className="text-lg sm:text-xl font-black tracking-tight text-[#2C241E]">
          Live<span className="text-[#B44328]">Souk</span>
        </span>
        <p className="text-[10px] font-bold text-[#2E5A44] -mt-0.5">سوق مباشر • Live Shopping</p>
      </div>
    </div>
  );
}

export default function LiveSoukHome() {
  const [countryCode, setCountryCode] = useState("MA");
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [toast, setToast] = useState("");
  const [formData, setFormData] = useState({
    title: "", seller: "", city: "الدار البيضاء • Casablanca", category: "ملابس",
    price: "", whatsapp: "",
  });

  const country = COUNTRIES[countryCode];
  const isFr = country.secondLang === "fr";
  const bi = (ar, fr, en) => `${ar} • ${isFr ? fr : en}`;

  const handleCountryChange = (newCode) => {
    setCountryCode(newCode);
    setSelectedCity("ALL");
    const firstCity = COUNTRIES[newCode].cities[0];
    setFormData((prev) => ({ ...prev, city: `${firstCity.ar} • ${firstCity.alt}` }));
  };

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
    const cleanWa = formData.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, country.dial);
    const payload = {
      title: formData.title.trim(),
      seller: formData.seller.trim(),
      city: formData.city,
      category: formData.category,
      price: Number(formData.price),
      whatsapp: cleanWa,
      delivery: bi("الدفع عند الاستلام", "Paiement à la livraison", "Cash on Delivery"),
      rating: 5.0,
      verified: true,
      viewers: Math.floor(Math.random() * 55) + 20,
      is_live: true,
      color: "terracotta-olive",
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
        showToast(bi("تم النشر بنجاح", "Publié avec succès", "Published successfully"));
      }
    } finally {
      setSubmitting(false);
      setIsAddModalOpen(false);
      const firstCity = country.cities[0];
      setFormData({ title: "", seller: "", city: `${firstCity.ar} • ${firstCity.alt}`, category: "ملابس", price: "", whatsapp: "" });
    }
  };

  const toggleFavorite = (id) => setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const addToCart = (item) => {
    setCart((p) => [...p, item]);
    showToast(`${bi("أُضيف للسلة", "Ajouté au panier", "Added to cart")}: ${item.title.slice(0, 14)}`);
  };
  const removeFromCart = (idx) => setCart((p) => p.filter((_, i) => i !== idx));

  const openWhatsApp = (item) => {
    const raw = String(item.whatsapp || "").replace(/[^0-9]/g, "");
    if (!raw) return;
    const phone = raw.startsWith("0") ? country.dial + raw.slice(1) : raw;
    const text = encodeURIComponent(`LiveSouk (${country.name}): "${item.title}" - ${item.price} ${country.currency}`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const filteredStreams = streams.filter((item) => {
    if (activeTab === "favorites" && !favorites.includes(item.id)) return false;
    const matchCity = selectedCity === "ALL" || item.city?.includes(selectedCity);
    const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || item.title?.toLowerCase().includes(q) || item.seller?.toLowerCase().includes(q) || item.city?.toLowerCase().includes(q);
    return matchCity && matchCat && matchQuery;
  });

  const totalCartPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div dir="rtl" style={ZELLIGE_BG_STYLE} className="min-h-screen text-[#2C241E] font-sans pb-28">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C241E] text-[#FAF7F2] px-5 py-2 rounded-full shadow-xl border border-[#D4A33C]/40 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#D4A33C]" /><span>{toast}</span>
        </div>
      )}

      <div style={{ backgroundColor: "#2E5A44" }} className="text-[#FAF7F2] text-[11px] font-extrabold py-1.5 px-3 text-center flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 fill-[#D4A33C] text-[#D4A33C] shrink-0" />
        <span>{bi("الدفع عند الاستلام", "Paiement à la livraison", "Cash on Delivery")}</span>
      </div>

      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#E5DEC9]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <LiveSoukSoukPinLogo />

          <div className="flex items-center gap-2">
            <select
              aria-label="اختيار الدولة • Country"
              value={countryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-[#F7F3EB] border border-[#E5DEC9] rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-[#2C241E] outline-none focus:border-[#B44328] max-w-[175px] sm:max-w-none"
            >
              {Object.entries(COUNTRIES).map(([code, c]) => (
                <option key={code} value={code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => setIsCartOpen(true)} className="relative p-2.5 rounded-xl bg-[#F7F3EB] border border-[#E5DEC9]">
              <ShoppingBag className="w-4 h-4 text-[#B44328]" />
              {cart.length > 0 && <span style={{ backgroundColor: "#B44328" }} className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center">{cart.length}</span>}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#B44328] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={bi("ابحث عن منتج، متجر، مدينة...", "Rechercher produit, boutique, ville...", "Search product, store, city...")}
              className="w-full pr-10 pl-4 py-2 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9] text-xs text-[#2C241E] outline-none focus:border-[#B44328]"
            />
          </div>
        </div>
      </header>

      {streams.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pt-3.5">
          <div className="flex items-center gap-3.5 overflow-x-auto pb-2 no-scrollbar">
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border-2 border-dashed border-[#B44328] flex items-center justify-center text-[#B44328]">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#5C4E42]">{bi("بثك", "Direct", "Live")}</span>
            </button>
            {streams.slice(0, 10).map((story) => (
              <button type="button" key={`story-${story.id}`} onClick={() => setActiveStream(story)} className="flex flex-col items-center gap-1 shrink-0">
                <div style={{ background: "linear-gradient(45deg, #D4A33C, #B44328, #2E5A44)" }} className="relative p-[2.5px] rounded-full">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#FAF7F2] flex items-center justify-center font-black text-base text-[#2C241E] border-2 border-[#FAF7F2]">
                    {story.seller?.charAt(0) || "S"}
                  </div>
                  <span style={{ backgroundColor: "#B44328" }} className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-white text-[7px] font-black px-1.5 rounded-full">LIVE</span>
                </div>
                <span className="text-[10px] font-bold text-[#5C4E42] max-w-[64px] truncate">{story.seller}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pt-2.5">
        <div style={{ background: "linear-gradient(135deg, #B44328 0%, #8E301B 55%, #2E5A44 100%)" }} className="rounded-3xl text-[#FAF7F2] p-5 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-[11px] font-extrabold text-[#FDE68A] mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{country.flag} {bi("سوق مباشر", "Shopping en direct", "Live Shopping")}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black leading-snug mb-1.5">
              {bi("عروض حية من قلب السوق", "Offres en direct du marché", "Live deals straight from the market")}
            </h1>
            <p className="text-[#FAF7F2]/90 text-xs sm:text-sm">
              {bi("اطلب مباشرة عبر واتساب", "Commandez directement sur WhatsApp", "Order directly via WhatsApp")}
            </p>
          </div>
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="self-start sm:self-center bg-[#FAF7F2] text-[#B44328] px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md shrink-0">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{bi("أضف عرضك", "Publier", "Post Offer")}</span>
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-4 space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button type="button" onClick={() => setSelectedCategory("ALL")} style={selectedCategory === "ALL" ? { backgroundColor: "#2C241E", color: "#FDE68A" } : {}} className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold shrink-0 ${selectedCategory !== "ALL" ? "bg-[#FAF7F2] text-[#5C4E42] border border-[#E5DEC9]" : ""}`}>
            🔥 {bi("الكل", "Tout", "All")}
          </button>
          {CATEGORIES.map((cat) => (
            <button type="button" key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={selectedCategory === cat.id ? { backgroundColor: "#2C241E", color: "#FDE68A" } : {}} className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 ${selectedCategory !== cat.id ? "bg-[#FAF7F2] text-[#5C4E42] border border-[#E5DEC9]" : ""}`}>
              <span>{cat.icon}</span><span>{bi(cat.ar, cat.fr, cat.en)}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:max-w-sm">
            <MapPin className="w-4 h-4 text-[#B44328] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              aria-label="اختيار المدينة • Select City"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-extrabold text-[#2C241E] outline-none focus:border-[#B44328]"
            >
              <option value="ALL">{country.flag} {bi(`كل المدن (${country.cities.length})`, `Toutes les villes (${country.cities.length})`, `All Cities (${country.cities.length})`)}</option>
              {country.cities.map((c) => (
                <option key={c.ar} value={c.ar}>
                  {c.ar} • {c.alt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-black text-[#2C241E] flex items-center gap-2 bg-[#FAF7F2]/90 px-3 py-1.5 rounded-2xl border border-[#E5DEC9]">
            <Flame className="w-5 h-5 text-[#B44328] fill-[#B44328]" />
            <span>
              {activeTab === "favorites"
                ? bi("المفضلة", "Favoris", "Favorites")
                : bi("العروض المباشرة", "Offres en direct", "Live Offers")}
            </span>
            <span className="text-xs font-bold text-[#7A6B5D]">({filteredStreams.length})</span>
          </h2>
          {loading && <Loader2 className="w-4 h-4 text-[#B44328] animate-spin" />}
        </div>

        {!loading && filteredStreams.length === 0 ? (
          <div className="bg-[#FAF7F2]/95 rounded-3xl border border-[#E5DEC9] p-10 text-center space-y-2">
            <Store className="w-10 h-10 text-[#B44328] mx-auto" />
            <p className="text-sm font-bold text-[#5C4E42]">
              {bi("لا توجد عروض حالياً", "Aucune offre disponible", "No offers available")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStreams.map((item, idx) => {
              const catObj = CATEGORIES.find((c) => c.id === item.category);
              const catLabel = catObj ? bi(catObj.ar, catObj.fr, catObj.en) : item.category;
              const cardBg = SAFE_GRADIENTS[idx % SAFE_GRADIENTS.length];
              return (
                <article key={item.id} className="bg-[#FAF7F2] rounded-[26px] border border-[#E5DEC9] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
                  <div
                    onClick={() => setActiveStream(item)}
                    style={{ background: cardBg }}
                    className="relative h-52 p-4 text-white flex flex-col justify-between cursor-pointer overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle at 20% 25%, #FDE68A 2px, transparent 2px), radial-gradient(circle at 80% 75%, #FDE68A 2px, transparent 2px)",
                        backgroundSize: "24px 24px",
                      }}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span style={{ backgroundColor: "#B44328" }} className="border border-white/30 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        {bi("DIRECT", "DIRECT", "LIVE")}
</span>
</div>
</div>



                            
                        
                              

</div>                      
        </article>
  )}    
 )}  
 </div> 

     </section> 
    </div>
  );
}
                        <span className="bg-black/40 backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" />{item.viewers || 43}
                        </span>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); navigator.share?.({ title: item.title, url: window.location.href }); }} className="p-2 rounded-full bg-black/35 hover:bg-black/50">
                        <Share2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-2 my-auto">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">{catObj?.icon || "🛍️"}</span>
                      </div>
                      <span className="bg-black/35 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-[#FDE68A] flex items-center gap-1.5">
                        <Play className="w-3 h-3 fill-[#FDE68A]" />
                        {bi("شاهد العرض المباشر", "Voir le direct", "Watch Live")}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-1.5">
                      <span className="bg-[#FAF7F2] text-[#2C241E] px-2.5 py-1 rounded-xl text-[10px] font-black truncate shadow-sm">{catLabel}</span>
                      <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#FDE68A] shrink-0" />{item.city}
                      </span>
                    </div>
                  </div>
        </article>
      ))}
    </div>
  )}
</section>
      </main>
    </div>
  );
}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 onClick={() => setActiveStream(item)} className="font-black text-[#2C241E] text-base leading-snug cursor-pointer">{item.title}</h3>
                        <button type="button" onClick={() => toggleFavorite(item.id)} className="p-2 rounded-xl bg-[#F7F3EB] border border-[#E5DEC9] shrink-0">
                          <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? "fill-[#B44328] text-[#B44328]" : "text-[#7A6B5D]"}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-[#E5DEC9]">
                        <span className="font-bold text-[#5C4E42] flex items-center gap-1.5">
                          <span style={{ backgroundColor: "#2E5A44" }} className="w-5 h-5 rounded-full text-white font-black flex items-center justify-center text-[10px]">{item.seller?.charAt(0) || "S"}</span>
                          {item.seller} <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A44]" />
                        </span>
                        <span className="flex items-center gap-1 text-[#B45309] font-extrabold">
                          <Star className="w-3.5 h-3.5 fill-[#D4A33C] text-[#D4A33C]" />{item.rating || "5.0"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xl font-black text-[#B44328]">{item.price} <span className="text-[11px] font-bold text-[#5C4E42]">{country.currency}</span></span>
                          <span className="block text-[10px] text-[#2E5A44] font-bold">✓ {bi("الدفع عند الاستلام", "Paiement à la livraison", "Cash on Delivery")}</span>
                        </div>
                        <button type="button" onClick={() => addToCart(item)} className="px-3 py-2 rounded-xl bg-[#F7F3EB] border border-[#E5DEC9] text-[#2C241E] text-[11px] font-extrabold shrink-0">
                          + {bi("السلة", "Panier", "Cart")}
                        </button>
                      </div>
                      <button type="button" onClick={() => openWhatsApp(item)} style={{ backgroundColor: "#2E5A44" }} className="w-full py-3 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm">
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>{bi("اطلب عبر واتساب", "Commander sur WhatsApp", "Order on WhatsApp")}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-lg bg-[#FAF7F2]/95 backdrop-blur-xl border border-[#E5DEC9] rounded-3xl px-2 py-2 shadow-xl flex items-center justify-around">
        <button type="button" onClick={() => { setActiveTab("home"); setSelectedCategory("ALL"); }} className={`flex flex-col items-center gap-0.5 py-1 px-1.5 ${activeTab === "home" ? "text-[#B44328]" : "text-[#7A6B5D]"}`}>
          <Home className="w-5 h-5" /><span className="text-[9px] font-extrabold">{bi("الرئيسية", "Accueil", "Home")}</span>
        </button>
        <button type="button" onClick={() => { setActiveTab("home"); window.scrollTo({ top: 240, behavior: "smooth" }); }} className="flex flex-col items-center gap-0.5 py-1 px-1.5 text-[#7A6B5D]">
          <Compass className="w-5 h-5" /><span className="text-[9px] font-extrabold">{bi("المدن", "Villes", "Cities")}</span>
        </button>
        <button type="button" onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: "#B44328" }} className="w-12 h-12 -mt-6 rounded-2xl text-white flex items-center justify-center shadow-lg border-4 border-[#F7F3EB] shrink-0">
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
        <button type="button" onClick={() => setActiveTab("favorites")} className={`flex flex-col items-center gap-0.5 py-1 px-1.5 ${activeTab === "favorites" ? "text-[#B44328]" : "text-[#7A6B5D]"}`}>
          <Heart className="w-5 h-5" /><span className="text-[9px] font-extrabold">{bi("المفضلة", "Favoris", "Favorites")}</span>
        </button>
        <button type="button" onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center gap-0.5 py-1 px-1.5 text-[#7A6B5D]">
          <ShoppingBag className="w-5 h-5" /><span className="text-[9px] font-extrabold">{bi("السلة", "Panier", "Cart")}</span>
          {cart.length > 0 && <span style={{ backgroundColor: "#B44328" }} className="absolute top-0.5 right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center">{cart.length}</span>}
        </button>
      </nav>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#E5DEC9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5DEC9]">
              <h3 className="text-sm font-black flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#B44328]" /><span>{bi("نشر عرض مباشر", "Publier une offre", "Post Live Offer")}</span></h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl bg-[#F7F3EB]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddOffer} className="space-y-3 text-sm">
              <div>
                <label className="block font-bold text-[#5C4E42] mb-1 text-xs">{bi("اسم المنتج *", "Produit *", "Product *")}</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5C4E42] mb-1 text-xs">{bi("المتجر *", "Boutique *", "Store *")}</label>
                  <input required type="text" value={formData.seller} onChange={(e) => setFormData({ ...formData, seller: e.target.value })} className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9]" />
                </div>
                <div>
                  <label className="block font-bold text-[#5C4E42] mb-1 text-xs">{bi("الثمن *", "Prix *", "Price *")}</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5C4E42] mb-1 text-xs">{bi("المدينة", "Ville", "City")}</label>
                  <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2.5 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9] text-xs">
                    {country.cities.map((c) => <option key={c.ar} value={`${c.ar} • ${c.alt}`}>{c.ar} • {c.alt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5C4E42] mb-1 text-xs">{bi("الفئة", "Catégorie", "Category")}</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2.5 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9] text-xs">
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{bi(c.ar, c.fr, c.en)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#5C4E42] mb-1 text-xs">{bi("رقم واتساب *", "WhatsApp *", "WhatsApp *")}</label>
                <input required type="tel" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3EB] border border-[#E5DEC9]" />
              </div>
              <button type="submit" disabled={submitting} style={{ backgroundColor: "#B44328" }} className="w-full py-3 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{bi("نشر العرض الآن", "Publier maintenant", "Publish Now")}</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/60 backdrop-blur-sm flex justify-end">
          <div className="bg-[#FAF7F2] w-full max-w-md h-full p-6 flex flex-col justify-between border-r border-[#E5DEC9]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]">
                <h3 className="text-sm font-black flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-[#B44328]" /><span>{bi("السلة", "Panier", "Cart")} ({cart.length})</span></h3>
                <button type="button" onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl bg-[#F7F3EB]"><X className="w-5 h-5" /></button>
              </div>
              {cart.length === 0 ? <p className="text-center text-[#7A6B5D] py-16 text-xs font-bold">{bi("السلة فارغة", "Panier vide", "Cart is empty")}</p> : (
                <div className="divide-y divide-[#E5DEC9] max-h-[65vh] overflow-y-auto mt-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-[#B44328] font-bold">{item.price} {country.currency}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(idx)} className="p-2 text-[#7A6B5D]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#E5DEC9]">
                <div className="flex justify-between font-black text-sm mb-4"><span>{bi("المجموع", "Total", "Total")}:</span><span className="text-[#B44328]">{totalCartPrice} {country.currency}</span></div>
                <button type="button" onClick={() => openWhatsApp(cart[0])} style={{ backgroundColor: "#2E5A44" }} className="w-full py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /><span>{bi("إتمام الطلب عبر واتساب", "Commander sur WhatsApp", "Checkout on WhatsApp")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStream && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full overflow-hidden border border-[#E5DEC9] shadow-2xl">
            <div style={{ background: SAFE_GRADIENTS[0] }} className="h-52 p-6 text-white flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span style={{ backgroundColor: "#B44328" }} className="px-3 py-1 rounded-full text-xs font-black">{bi("مباشر", "DIRECT", "LIVE")} • {activeStream.city}</span>
                <button type="button" onClick={() => setActiveStream(null)} className="bg-black/35 p-2 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <h3 className="text-xl font-black">{activeStream.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-[#F7F3EB] p-4 rounded-2xl border border-[#E5DEC9]">
                <div><p className="text-[11px] text-[#7A6B5D]">{bi("المتجر", "Boutique", "Store")}</p><p className="font-black text-base">{activeStream.seller}</p></div>
                <div><p className="text-[11px] text-[#7A6B5D]">{bi("الثمن", "Prix", "Price")}</p><p className="text-xl font-black text-[#B44328]">{activeStream.price} {country.currency}</p></div>
              </div>
              <button type="button" onClick={() => openWhatsApp(activeStream)} style={{ backgroundColor: "#2E5A44" }} className="w-full py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /><span>{bi("اطلب عبر واتساب", "Commander sur WhatsApp", "Order on WhatsApp")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
        </div>
    </div>
  )}
      </main>
    </div>
  );
}
}
