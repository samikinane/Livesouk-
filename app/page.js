"use client";
import React, { useState } from "react";
import { ShoppingBag, Radio, Search, Heart, Eye, Sparkles } from "lucide-react";

const SAMPLE_STREAMS = [
  {
    id: 1,
    title: "عرض مباشر: ملابس تقليدية وعصرية بأثمنة مناسبة",
    seller: "متجر الأناقة",
    viewers: 342,
    category: "ملابس",
    price: "199 درهم",
    isLive: true,
    color: "from-rose-500 to-orange-400",
  },
  {
    id: 2,
    title: "تخفيضات مباشرة على الإكسسوارات والهواتف",
    seller: "تيك ماروك",
    viewers: 518,
    category: "إلكترونيات",
    price: "149 درهم",
    isLive: true,
    color: "from-blue-600 to-indigo-500",
  },
  {
    id: 3,
    title: "منتجات العناية الطبيعية والزيوت المغربية الأصيلة",
    seller: "تعاونية الأطلس",
    viewers: 215,
    category: "تجميل",
    price: "85 درهم",
    isLive: true,
    color: "from-emerald-500 to-teal-600",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const categories = ["الكل", "ملابس", "إلكترونيات", "تجميل", "منزل"];

  const filteredStreams = SAMPLE_STREAMS.filter((item) => {
    const matchesCat =
      selectedCategory === "الكل" || item.category === selectedCategory;
    const matchesSearch =
      item.title.includes(searchQuery) || item.seller.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 text-white p-2 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Live<span className="text-rose-600">Souk</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="ابحث عن بث مباشر أو متجر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 rounded-full pr-9 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* بانر ترحيبي */}
        <div className="bg-gradient-to-l from-rose-600 to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-md">
          <div className="flex items-center gap-2 text-rose-100 text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>تسوق وتفاعل مباشرة مع البائعين</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">اكتشف عروض LiveSouk الحية</h2>
          <p className="text-rose-50 text-sm max-w-lg">
            شاهد المنتجات على المباشر، اسأل البائع، واطلب بضغطة زر واحدة.
          </p>
        </div>

        {/* التصنيفات */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* شبكة البث المباشر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStreams.map((stream) => (
            <div
              key={stream.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div
                className={`h-44 bg-gradient-to-br ${stream.color} p-4 flex flex-col justify-between text-white relative`}
              >
                <div className="flex justify-between items-center">
                  <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    مباشر
                  </span>
                  <span className="bg-black/40 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {stream.viewers}
                  </span>
                </div>
                <div>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {stream.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{stream.seller}</p>
                  <h3 className="font-bold text-slate-900 leading-snug mb-3">
                    {stream.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="font-bold text-rose-600">{stream.price}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCartCount((c) => c + 1)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition"
                    >
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
