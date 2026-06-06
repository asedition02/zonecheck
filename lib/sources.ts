export type Region = "usa" | "europe" | "asia";
export type Category = "technology" | "startup" | "drone";

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rss: string;
  region: Region;
  categories: Category[];
  logo?: string;
}

export const sources: NewsSource[] = [
  // ===== USA (10) =====
  {
    id: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com",
    rss: "https://techcrunch.com/feed/",
    region: "usa",
    categories: ["technology", "startup"],
  },
  {
    id: "theverge",
    name: "The Verge",
    url: "https://www.theverge.com",
    rss: "https://www.theverge.com/rss/index.xml",
    region: "usa",
    categories: ["technology"],
  },
  {
    id: "wired",
    name: "Wired",
    url: "https://www.wired.com",
    rss: "https://www.wired.com/feed/rss",
    region: "usa",
    categories: ["technology", "startup"],
  },
  {
    id: "venturebeat",
    name: "VentureBeat",
    url: "https://venturebeat.com",
    rss: "https://venturebeat.com/feed/",
    region: "usa",
    categories: ["technology", "startup"],
  },
  {
    id: "engadget",
    name: "Engadget",
    url: "https://www.engadget.com",
    rss: "https://www.engadget.com/rss.xml",
    region: "usa",
    categories: ["technology", "drone"],
  },
  {
    id: "arstechnica",
    name: "Ars Technica",
    url: "https://arstechnica.com",
    rss: "https://feeds.arstechnica.com/arstechnica/index",
    region: "usa",
    categories: ["technology"],
  },
  {
    id: "recode",
    name: "Vox / Recode",
    url: "https://www.vox.com/recode",
    rss: "https://www.vox.com/rss/index.xml",
    region: "usa",
    categories: ["technology", "startup"],
  },
  {
    id: "businessinsider",
    name: "Business Insider Tech",
    url: "https://www.businessinsider.com",
    rss: "https://feeds.businessinsider.com/custom/all",
    region: "usa",
    categories: ["technology", "startup"],
  },
  {
    id: "dronedj",
    name: "DroneDJ",
    url: "https://dronedj.com",
    rss: "https://dronedj.com/feed/",
    region: "usa",
    categories: ["drone"],
  },
  {
    id: "suasnews",
    name: "sUAS News",
    url: "https://www.suasnews.com",
    rss: "https://www.suasnews.com/feed/",
    region: "usa",
    categories: ["drone"],
  },

  // ===== EUROPE (10) =====
  {
    id: "sifted",
    name: "Sifted",
    url: "https://sifted.eu",
    rss: "https://sifted.eu/wp-json/wp/v2/posts?_embed&per_page=20&_fields=link,title,date,excerpt,_embedded",
    region: "europe",
    categories: ["startup", "technology"],
  },
  {
    id: "euractiv",
    name: "Euractiv Tech",
    url: "https://www.euractiv.com",
    rss: "https://www.euractiv.com/sections/tech/feed/",
    region: "europe",
    categories: ["technology"],
  },
  {
    id: "techeu",
    name: "Tech.eu",
    url: "https://tech.eu",
    rss: "https://tech.eu/feed/",
    region: "europe",
    categories: ["startup", "technology"],
  },
  {
    id: "tnw",
    name: "The Next Web",
    url: "https://thenextweb.com",
    rss: "https://thenextweb.com/feed/",
    region: "europe",
    categories: ["technology", "startup"],
  },
  {
    id: "eu-startups",
    name: "EU-Startups",
    url: "https://www.eu-startups.com",
    rss: "https://www.eu-startups.com/feed/",
    region: "europe",
    categories: ["startup"],
  },
  {
    id: "computerweekly",
    name: "Computer Weekly",
    url: "https://www.computerweekly.com",
    rss: "https://www.computerweekly.com/rss/IT-news.xml",
    region: "europe",
    categories: ["technology"],
  },
  {
    id: "zdnet-eu",
    name: "ZDNet",
    url: "https://www.zdnet.com",
    rss: "https://www.zdnet.com/news/rss.xml",
    region: "europe",
    categories: ["technology"],
  },
  {
    id: "dronebelow",
    name: "Drone Below",
    url: "https://dronebelow.com",
    rss: "https://dronebelow.com/feed/",
    region: "europe",
    categories: ["drone"],
  },
  {
    id: "silicon",
    name: "Silicon Republic",
    url: "https://www.siliconrepublic.com",
    rss: "https://www.siliconrepublic.com/feed",
    region: "europe",
    categories: ["technology", "startup"],
  },
  {
    id: "techinasia-eu",
    name: "Verdict",
    url: "https://www.verdict.co.uk",
    rss: "https://www.verdict.co.uk/feed/",
    region: "europe",
    categories: ["technology", "startup"],
  },

  // ===== ASIA (10) =====
  {
    id: "techinasia",
    name: "Tech in Asia",
    url: "https://www.techinasia.com",
    rss: "https://www.techinasia.com/feed",
    region: "asia",
    categories: ["technology", "startup"],
  },
  {
    id: "kr-asia",
    name: "KrASIA",
    url: "https://kr.asia",
    rss: "https://kr.asia/feed",
    region: "asia",
    categories: ["startup", "technology"],
  },
  {
    id: "dealstreetasia",
    name: "DealStreetAsia",
    url: "https://www.dealstreetasia.com",
    rss: "https://www.dealstreetasia.com/feed/",
    region: "asia",
    categories: ["startup"],
  },
  {
    id: "nikkei",
    name: "Nikkei Asia Tech",
    url: "https://asia.nikkei.com",
    rss: "https://asia.nikkei.com/rss/feed/technology",
    region: "asia",
    categories: ["technology"],
  },
  {
    id: "scmp",
    name: "SCMP Tech",
    url: "https://www.scmp.com",
    rss: "https://www.scmp.com/rss/5/feed",
    region: "asia",
    categories: ["technology"],
  },
  {
    id: "e27",
    name: "e27",
    url: "https://e27.co",
    rss: "https://e27.co/feed/",
    region: "asia",
    categories: ["startup", "technology"],
  },
  {
    id: "yourstory",
    name: "YourStory",
    url: "https://yourstory.com",
    rss: "https://yourstory.com/feed",
    region: "asia",
    categories: ["startup"],
  },
  {
    id: "digitalnewsasia",
    name: "Digital News Asia",
    url: "https://www.digitalnewsasia.com",
    rss: "https://www.digitalnewsasia.com/rss.xml",
    region: "asia",
    categories: ["technology", "startup"],
  },
  {
    id: "dronelife-asia",
    name: "DroneLife",
    url: "https://dronelife.com",
    rss: "https://dronelife.com/feed/",
    region: "asia",
    categories: ["drone"],
  },
  {
    id: "technode",
    name: "TechNode (China)",
    url: "https://technode.com",
    rss: "https://technode.com/feed/",
    region: "asia",
    categories: ["technology", "startup"],
  },
];

export const regionLabels: Record<Region, string> = {
  usa: "🇺🇸 Amerika",
  europe: "🇪🇺 Avrupa",
  asia: "🌏 Asya",
};

export const categoryLabels: Record<Category, string> = {
  technology: "Teknoloji",
  startup: "Startup",
  drone: "Drone",
};

export const categoryColors: Record<Category, string> = {
  technology: "bg-blue-100 text-blue-800",
  startup: "bg-purple-100 text-purple-800",
  drone: "bg-green-100 text-green-800",
};
