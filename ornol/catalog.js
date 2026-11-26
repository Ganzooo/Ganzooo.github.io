export const films = [
  {
    id: "sarnii-tsaana",
    title: "Сарны цаана",
    titleLines: ["Сарны", "цаана"],
    genre: "Зөгнөлт",
    summary: "Үл таних дохионы мөрөөр саран дээр буусан нисгэгч эзгүй мэт санагдах орчныг ажиглана.",
    hero: "assets/sar-hero.webp",
    cover: "assets/sarnii-tsaana.webp",
    focal: "60% 48%",
    mobileFocal: "72% 38%",
    source: "https://commons.wikimedia.org/wiki/File:Mitten-astronaut.webm",
    sourceTitle: "Mitten Astronaut",
    episodes: [
      { title: "Үл таних дохио", seconds: 9, file: "videos/sarnii-tsaana-1.mp4", captions: "assets/sar-1.vtt" },
      { title: "Хоосон хаяа", seconds: 8, file: "videos/sarnii-tsaana-2.mp4", locked: true }
    ]
  },
  {
    id: "neon-hot",
    title: "Неон хот",
    titleLines: ["Неон", "хот"],
    genre: "Драм",
    summary: "Бороонд норсон Токиогийн гудамжаар нэгэн эмэгтэй алхана. Хотын гэрэл алхам бүрд өөр өнгөөр тусна.",
    hero: "assets/neon-hot-wide.webp",
    cover: "assets/neon-hot.webp",
    focal: "57% 43%",
    mobileFocal: "53% 40%",
    source: "https://commons.wikimedia.org/wiki/File:OpenAI_Sora_in_Action-_Tokyo_Walk.webm",
    sourceTitle: "Tokyo Walk",
    episodes: [{ title: "Шөнийн гудамж", seconds: 60, file: "videos/neon-hot.mp4", locked: true }]
  },
  {
    id: "tsasan-erin",
    title: "Цасан эрин",
    titleLines: ["Цасан", "эрин"],
    genre: "Адал явдал",
    summary: "Эрт цагийн мамонтууд сүргээрээ цаст хөндийг туулна. Алсад уулс, ойрхон цасан шуурга.",
    hero: "assets/tsasan-erin-wide.webp",
    cover: "assets/tsasan-erin.webp",
    focal: "58% 51%",
    mobileFocal: "58% 48%",
    source: "https://commons.wikimedia.org/wiki/File:Wooly_Mammoth_by_OpenAI_Sora.webm",
    sourceTitle: "Wooly Mammoth",
    episodes: [{ title: "Цаст хөндий", seconds: 10, file: "videos/tsasan-erin.mp4" }]
  },
  {
    id: "suulchiin-galt-tereg",
    title: "Сүүлчийн галт тэрэг",
    genre: "Адал явдал",
    summary: "Уурын тэрэг ногоон хөндийг дамнасан чулуун гүүрээр өнгөрнө.",
    cover: "assets/suulchiin-galt-tereg.webp",
    source: "https://commons.wikimedia.org/wiki/File:Photoreal-train.webm",
    sourceTitle: "Photoreal Train",
    episodes: [{ title: "Хөндийг туулах нь", seconds: 9, file: "videos/suulchiin-galt-tereg.mp4" }]
  },
  {
    id: "dalain-irmeg",
    title: "Далайн ирмэг",
    genre: "Байгаль",
    summary: "Жаргах нар далайн хадан эргийг шаргалтуулна. Давалгаа хормойг нь цагаан хөөсөөр хучна.",
    cover: "assets/dalain-irmeg.webp",
    source: "https://commons.wikimedia.org/wiki/File:Big-sur.webm",
    sourceTitle: "Big Sur",
    episodes: [{ title: "Хадан эрэг", seconds: 9, file: "videos/dalain-irmeg.mp4" }]
  },
  {
    id: "altan-mur",
    title: "Алтан мөр",
    genre: "Түүхэн",
    summary: "Калифорнийн алтны халуурлын үеийн сууринг хуучны бичлэгийн өнгө аясаар дүрсэлжээ.",
    cover: "assets/altan-mur.webp",
    source: "https://commons.wikimedia.org/wiki/File:OpenAI_Sora_in_Action-_Gold_Rush.webm",
    sourceTitle: "Gold Rush",
    episodes: [{ title: "Алтны эрэл", seconds: 25, file: "videos/altan-mur.mp4", locked: true }]
  }
];

export const plans = [
  { id: "single", label: "Нэг кино", duration: "24 цаг", days: 1, price: 3900, single: true },
  { id: "day", label: "Бүх кино", duration: "24 цаг", days: 1, price: 6900 },
  { id: "week", label: "Бүх кино", duration: "7 хоног", days: 7, price: 8900 },
  { id: "month", label: "Бүх кино", duration: "30 хоног", days: 30, price: 11900 },
  { id: "two-months", label: "Бүх кино", duration: "60 хоног", days: 60, price: 15900 },
  { id: "year", label: "Бүх кино", duration: "365 хоног", days: 365, price: 19900 }
];
