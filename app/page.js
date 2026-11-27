"use client";
import React, { useState } from "react";
import {
  ShoppingBag,
  Radio,
  Search,
  Heart,
  Eye,
  Sparkles,
  MapPin,
  BadgeCheck,
  Star,
  Truck,
  MessageCircle,
  PlusCircle,
  X,
  CheckCircle2,
  Play,
} from "lucide-react";

const INITIAL_STREAMS = [
  {
    id: 1,
    title: "عرض مباشر: قفاطين وملابس تقليدية وعصرية بأثمنة مناسبة",
    seller: "متجر الأناقة",
    city: "الدار البيضاء",
    rating: 4.9,
    verified: true,
    viewers: 342,
    category: "ملابس",
    price: 199,
    delivery: "الدفع عند الاستلام",
    whatsapp: "212600000001",
    isLive: true,
    color: "from-rose-500 to-orange-400",
  },
  {
    id: 2,
    title: "تخفيضات مباشرة على الساعات الذكية وإكسسوارات الهواتف",
    seller: "تيك ماروك",
    city: "الرباط",
    rating: 4.8,
    verified: true,
    viewers: 518,
    category: "إلكترونيات",
    price: 149,
    delivery: "توصيل مجاني لجميع المدن",
    whatsapp: "212600000002",
    isLive: true,
    color: "from-blue-600 to-indigo-500",
  },
  {
    id: 3,
    title: "زيت أركان الحر ومنتجات العناية الطبيعية المغربية الأصيلة",
    seller: "تعاونية الأطلس",
    city: "أكادير",
    rating: 5.0,
    verified: true,
    viewers: 215,
    category: "تجميل",
    price: 85,
    delivery: "الدفع عند الاستلام",
    whatsapp: "212600000003",
    isLive: true,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "أواني منزلية عصرية وديكورات الصالون المغربي بأسعار الجملة",
    seller: "دار الديكور",
    city: "مراكش",
    rating: 4.7,
    verified: true,
    viewers: 189,
    category: "منزل",
    price: 240,
    delivery: "توصيل لجميع المدن",
    whatsapp: "212600000004",
    isLive: true,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 5,
    title: "أحذية رياضية أصلية وتشكيلة الشتاء الجديدة للرجال والنساء",
    seller: "سبور ستايل",
    city: "طنجة",
    rating: 4.8,
    verified: false,
    viewers: 274,
    category: "ملابس",
    price: 299,
    delivery: "الدفع عند الاستلام",
    whatsapp: "212600000005",
    isLive: false,
    color: "from-purple-600 to-pink-500",
  },
  {
    id: 6,
    title: "سماعات لاسلكية وشواحن سريعة بضمان سنة كاملة",
    seller: "إلكترو فاس",
    city: "فاس",
    rating: 4.9,
    verified: true,
    viewers: 410,
    category: "إلكترونيات",
    price: 120,
    delivery: "الدفع عند الاستلام",
    whatsapp: "212600000006",
    isLive: true,
    color: "from-cyan-600 to-blue-600",
  },
];

export default function Home() {
  const [streams, setStreams] = useState(INITIAL_STREAMS);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedCity, setSelectedCity] = useState("كل المدن");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // حقول إضافة عرض جديد
  const [newTitle, setNewTitle] = useState("");
  const [newSeller, setNewSeller] = useState("");
  const [newCity, setNewCity] = useState("الدار البيضاء");
  const [newCategory, setNewCategory] = useState("ملابس");
  const [newPrice, setNewPrice] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");

  const categories = ["الكل", "ملابس", "إلكترونيات", "تجميل", "منزل"];
  const cities = [
    "كل المدن",
    "الدار البيضاء",
    "الرباط",
    "مراكش",
    "طنجة",
    "فاس",
    "أكادير",
  ];

  const filteredStreams = streams.filter((item) => {
    const matchesCat =
      selectedCategory === "الكل" || item.category === selectedCategory;
    const matchesCity =
      selectedCity === "كل المدن" || item.city === selectedCity;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesCity && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (stream) => {
    setCartItems((prev) => [...prev, stream]);
  };

  const openWhatsApp = (stream) => {
    const phone = stream.whatsapp.replace(/[^0-9]/g, "") || "212600000000";
    const message = encodeURIComponent(
      `السلام عليكم ${stream.seller}، أعجبني هذا العرض على منصة LiveSouk:\n• ${stream.title}\n• الثمن: ${stream.price} درهم\nهل المنتج متوفر حالياً؟`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleAddOffer = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newSeller) return;

    const colors = [
      "from-rose-500 to-orange-400",
      "from-blue-600 to-indigo-500",
      "from-emerald-500 to-teal-600",
      "from-purple-600 to-pink-500",
    ];

    const newOffer = {
      id: Date.now(),
      title: newTitle,
      seller: newSeller,
      city: newCity,
      rating: 5.0,
      verified: true,
      viewers: 1,
      category: newCategory,
      price: Number(newPrice),
      delivery: "الدفع عند الاستلام",
      whatsapp: newWhatsapp.startsWith("0")
        ? "212" + newWhatsapp.slice(1)
        : newWhatsapp || "212600000000",
      isLive: true,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setStreams([newOffer, ...streams]);
    setNewTitle("");
    setNewSeller("");
    setNewPrice("");
    setNewWhatsapp("");
    setIsAddModalOpen(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-rose-600 text-white p-2 rounded-xl shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Live<span className="text-rose-600">Souk</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="ابحث عن منتج، مدينة، أو متجر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 rounded-full pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-full shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">أضف عرضك</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -left-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* بانر ترحيبي */}
        <div className="bg-gradient-to-l from-rose-600 via-rose-500 to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-100 text-xs sm:text-sm mb-1.5 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>أول سوق مغربي للتسوق المباشر بالفيديو</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                اكتشف عروض LiveSouk الحية
              </h2>
              <p className="text-rose-50 text-sm max-w-xl leading-relaxed">
                شاهد المنتجات على الطبيعة، تواصل مع البائع مباشرة عبر واتساب،
                واستفد من الدفع عند الاستلام في جميع مدن المغرب.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> بائعون موثوقون
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> الدفع عند الاستلام
              </span>
            </div>
          </div>
        </div>

        {/* شريط التصفية حسب الفئة والمدينة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* التصنيفات */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* اختيار المدينة */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 self-start sm:self-auto">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* عدد النتائج */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
          <span>
            يتم عرض <strong>{filteredStreams.length}</strong> عرض متاح حالياً
          </span>
          {(selectedCategory !== "الكل" ||
            selectedCity !== "كل المدن" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("الكل");
                setSelectedCity("كل المدن");
                setSearchQuery("");
              }}
              className="text-rose-600 font-semibold hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        {/* شبكة العروض والبث المباشر */}
        {filteredStreams.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <p className="text-slate-600 font-medium mb-2">
              لا توجد عروض مطابقة لبحثك حالياً.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("الكل");
                setSelectedCity("كل المدن");
                setSearchQuery("");
              }}
              className="text-sm text-rose-600 font-bold hover:underline"
            >
              عرض جميع المنتجات المتوفرة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStreams.map((stream) => {
              const isFav = favorites.includes(stream.id);
              return (
                <div
                  key={stream.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
                >
                  {/* بطاقة الفيديو / البث */}
                  <div
                    className={`h-44 bg-gradient-to-br ${stream.color} p-4 flex flex-col justify-between text-white relative group`}
                  >
                    <div className="flex justify-between items-center">
                      {stream.isLive ? (
                        <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                          مباشر
                        </span>
                      ) : (
                        <span className="bg-slate-900/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Play className="w-3 h-3 fill-white" />
                          فيديو العرض
                        </span>
                      )}

                      <span className="bg-black/40 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {stream.viewers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-medium">
                        {stream.category}
                      </span>
                      <span className="text-xs bg-black/35 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {stream.city}
                      </span>
                    </div>
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* معلومات البائع والتقييم */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <span>{stream.seller}</span>
                          {stream.verified && (
                            <BadgeCheck
                              className="w-4 h-4 text-blue-500"
                              title="بائع موثوق"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{stream.rating}</span>
                        </div>
                      </div>

                      {/* عنوان المنتج */}
                      <h3 className="font-bold text-slate-900 leading-snug mb-2">
                        {stream.title}
                      </h3>

                      {/* شارة الدفع والتوصيل */}
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mb-3">
                        <Truck className="w-3 h-3" />
                        <span>{stream.delivery}</span>
                      </div>
                    </div>

                    {/* السعر وأزرار الشراء */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-extrabold text-rose-600">
                            {stream.price}
                          </span>{" "}
                          <span className="text-xs font-bold text-rose-600">
                            درهم
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleFavorite(stream.id)}
                            className={`p-2 rounded-full transition ${
                              isFav
                                ? "text-rose-600 bg-rose-50"
                                : "text-slate-400 hover:text-rose-500 hover:bg-slate-100"
                            }`}
                            aria-label="إضافة للمفضلة"
                          >
                            <Heart
                              className={`w-4 h-4 ${isFav ? "fill-rose-600" : ""}`}
                            />
                          </button>

                          <button
                            onClick={() => addToCart(stream)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl transition"
                          >
                            + السلة
                          </button>
                        </div>
                      </div>

                      {/* زر واتساب المباشر */}
                      <button
                        onClick={() => openWhatsApp(stream)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>اطلب مباشرة عبر واتساب</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* نافذة السلة */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-lg">
                سلة المشتريات ({cartItems.length})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                سلتك فارغة حالياً. أضف منتجات لطلبها!
              </p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl text-sm"
                    >
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.seller}</p>
                      </div>
                      <span className="font-bold text-rose-600 shrink-0 mr-2">
                        {item.price} درهم
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between font-bold text-base border-t border-slate-100 pt-3 mb-4">
                  <span>المجموع التقديري:</span>
                  <span className="text-rose-600">
                    {cartItems.reduce((sum, item) => sum + item.price, 0)} درهم
                  </span>
                </div>
                <button
                  onClick={() => setCartItems([])}
                  className="w-full text-xs text-slate-500 hover:text-rose-600 underline"
                >
                  إفراغ السلة
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* نافذة إضافة عرض جديد */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-lg">أضف عرضك على LiveSouk</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOffer} className="space-y-3 text-sm">
              <div>
                <label className="block font-medium mb-1">اسم المنتج أو العرض *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ساعة ذكية مقاومة للماء"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">اسم المتجر *</label>
                  <input
                    type="text"
                    required
                    placeholder="متجر الأمل"
                    value={newSeller}
                    onChange={(e) => setNewSeller(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">الثمن (بالدرهم) *</label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">المدينة</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                  >
                    {cities
                      .filter((c) => c !== "كل المدن")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">الفئة</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                  >
                    {categories
                      .filter((c) => c !== "الكل")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">رقم واتساب للتواصل</label>
                <input
                  type="tel"
                  placeholder="0600000000"
                  value={newWhatsapp}
                  onChange={(e) => setNewWhatsapp(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl mt-2 transition"
              >
                نشر العرض الآن
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
