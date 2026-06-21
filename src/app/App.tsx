import { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  Search, Mic, Camera, ShoppingCart, Bell, User, Menu, X,
  Star, Shield, FileText, Truck, Package, Plus, Upload, Clock,
  CreditCard, Check, Heart, Phone, Leaf, Wrench, Scissors,
  Bike, Sofa, Pill, ArrowLeft, LogOut, ShoppingBag,
  ChevronDown, Zap, MessageSquare, MapPin, RotateCcw, CheckCircle,
  Tag, ChevronRight, Send, Download, AlertCircle, Home, Eye, EyeOff
} from "lucide-react";
import { toast, Toaster } from "sonner";

// আপনার পেজ কম্পোনেন্টগুলো এখানে ইমপোর্ট হবে (নিচে উদাহরণস্বরূপ রাখা হয়েছে)
// import PostDashboard from "./pages/PostDashboard";
// import PaymentGate from "./pages/PaymentGate";

function App() {
  return (
    <Router>
      {/* Toaster পুরো অ্যাপে নোটিফিকেশন দেখানোর জন্য */}
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* আপনার রুটগুলো এখানে ডিফাইন করুন */}
          <Route path="/dashboard" element={<div>Post Dashboard Page</div>} />
          <Route path="/payment/:postId" element={<div>Payment Gateway Page</div>} />
          
          {/* ডিফল্ট রাউট */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
type Page = "home" | "auth" | "post" | "product" | "cart" | "checkout" | "invoice" | "bid" | "emergency" | "profile";
type Condition = "new" | "used" | "rent";
type SellerType = "shop" | "krishok" | "individual" | "online";

interface Product {
  id: number; name: string; price: number; image: string;
  condition: Condition; sellerType: SellerType; seller: string;
  rating: number; reviews: number; location: string; category: string; description: string;
}
interface CartItem extends Product { qty: number; }
interface InvoiceData {
  id: string; date: string; items: CartItem[]; total: number;
  payment: string; address: string; customer: string; phone: string;
}
interface BidItem { id: number; supplier: string; amount: number; note: string; confirmed: boolean; }
interface BidRequest { id: number; title: string; description: string; budget: number; bids: BidItem[]; status: string; }

const PRODUCTS: Product[] = [
  { id: 1, name: "অর্গানিক বাসমতি চাল (৫ কেজি)", price: 380, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format", condition: "new", sellerType: "krishok", seller: "রহিম কৃষক", rating: 4.8, reviews: 124, location: "রাজশাহী", category: "groceries", description: "সরাসরি খামার থেকে আনা তাজা অর্গানিক বাসমতি চাল। কোনো রাসায়নিক সার ব্যবহার হয়নি।" },
  { id: 2, name: "Samsung Galaxy A55 5G", price: 38000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format", condition: "new", sellerType: "shop", seller: "টেক ওয়ার্ল্ড", rating: 4.6, reviews: 89, location: "ঢাকা", category: "electronics", description: "১ বছরের অফিশিয়াল ওয়ারেন্টি, ৬.৬ ইঞ্চি AMOLED ডিসপ্লে, ৫০MP ক্যামেরা।" },
  { id: 3, name: "হস্তনির্মিত নকশিকাঁথা", price: 1800, image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop&auto=format", condition: "new", sellerType: "individual", seller: "সুমাইয়া হ্যান্ডিক্রাফট", rating: 5.0, reviews: 47, location: "রাজশাহী", category: "handicraft", description: "হাতে বোনা ঐতিহ্যবাহী নকশিকাঁথা। প্রতিটি পিস সম্পূর্ণ হস্তনির্মিত।" },
  { id: 4, name: "বাটিক শাড়ি (হাতে আঁকা)", price: 2500, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format", condition: "new", sellerType: "online", seller: "সাজগোজ অনলাইন", rating: 4.5, reviews: 203, location: "ঢাকা", category: "fashion", description: "সুতি কাপড়ে হাতে আঁকা বাটিক প্রিন্টের শাড়ি। একদম ইউনিক ডিজাইন।" },
  { id: 5, name: "HP Pavilion ল্যাপটপ (ব্যবহৃত)", price: 28000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format", condition: "used", sellerType: "individual", seller: "করিম সাহেব", rating: 4.2, reviews: 15, location: "চট্টগ্রাম", category: "electronics", description: "Core i5 10th Gen, 8GB RAM, 256GB SSD। ২ বছর ব্যবহৃত, ভালো কন্ডিশনে।" },
  { id: 6, name: "Canon 200D ক্যামেরা (ব্যবহৃত)", price: 45000, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&auto=format", condition: "used", sellerType: "individual", seller: "ফটোগ্রাফার জামাল", rating: 4.7, reviews: 23, location: "ঢাকা", category: "electronics", description: "মাত্র ৫,০০০ শট, সব একসেসরিজ সহ — ব্যাগ, লেন্স, চার্জার।" },
  { id: 7, name: "মাইক্রোবাস ভাড়া (প্রতিদিন)", price: 4000, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop&auto=format", condition: "rent", sellerType: "shop", seller: "সিটি রেন্টাল", rating: 4.4, reviews: 67, location: "ঢাকা", category: "automobile", description: "১২ সিটের মাইক্রোবাস, অভিজ্ঞ ড্রাইভার সহ, যেকোনো রুটে।" },
  { id: 8, name: "ইভেন্ট চেয়ার-টেবিল (ভাড়া)", price: 800, image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=400&h=400&fit=crop&auto=format", condition: "rent", sellerType: "shop", seller: "পার্টি সাপ্লাই", rating: 4.3, reviews: 41, location: "সিলেট", category: "home", description: "৫০ সেট চেয়ার ও ১০টি টেবিল। বিয়ে, জন্মদিন, অনুষ্ঠানের জন্য।" },
  { id: 9, name: "তাজা ইলিশ মাছ (১ কেজি)", price: 900, image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop&auto=format", condition: "new", sellerType: "krishok", seller: "মৎস্যজীবী সমিতি", rating: 4.9, reviews: 312, location: "বরিশাল", category: "fresh", description: "পদ্মা নদীর তাজা ইলিশ। আজ সকালে ধরা।" },
];

const CATEGORIES = [
  { id: "groceries", icon: ShoppingBag, label: "মুদি ও শুকনো খাবার", color: "#FF8F00", bg: "#FFF8E1" },
  { id: "fresh", icon: Leaf, label: "তাজা খাবার", color: "#2D8A4D", bg: "#E8F5E9" },
  { id: "fashion", icon: Scissors, label: "ফ্যাশন ও পোশাক", color: "#E91E63", bg: "#FCE4EC" },
  { id: "electronics", icon: Zap, label: "ইলেকট্রনিক্স", color: "#1565C0", bg: "#E3F2FD" },
  { id: "handicraft", icon: Star, label: "হস্তশিল্প", color: "#6A1B9A", bg: "#F3E5F5" },
  { id: "automobile", icon: Bike, label: "অটোমোবাইল", color: "#37474F", bg: "#ECEFF1" },
  { id: "home", icon: Sofa, label: "ঘর সাজানো", color: "#BF360C", bg: "#FBE9E7" },
  { id: "personal", icon: Heart, label: "ব্যক্তিগত যত্ন", color: "#AD1457", bg: "#FCE4EC" },
  { id: "kids", icon: Package, label: "কিডজ জোন", color: "#F57F17", bg: "#FFF9C4" },
  { id: "services", icon: Wrench, label: "সেবা সমূহ", color: "#00695C", bg: "#E0F2F1" },
  { id: "used", icon: RotateCcw, label: "ব্যবহৃত পণ্য", color: "#4E342E", bg: "#EFEBE9" },
  { id: "emergency", icon: Pill, label: "জরুরি / ওষুধ", color: "#C62828", bg: "#FFEBEE" },
];

const SERVICES = [
  { icon: Zap, label: "ইলেকট্রিক মিস্ত্রি", price: "৳২০০/ঘণ্টা", rating: 4.7, available: 12 },
  { icon: Wrench, label: "কাঠ মিস্ত্রি", price: "৳২৫০/ঘণ্টা", rating: 4.5, available: 8 },
  { icon: MapPin, label: "প্লাম্বার", price: "৳১৮০/ঘণ্টা", rating: 4.6, available: 15 },
  { icon: FileText, label: "টিউটর", price: "৳৩০০/ঘণ্টা", rating: 4.8, available: 25 },
  { icon: Truck, label: "অ্যাম্বুলেন্স", price: "সার্বক্ষণিক", rating: 4.9, available: 5 },
  { icon: Package, label: "ক্লিনার", price: "৳১৫০/ঘণ্টা", rating: 4.4, available: 18 },
];

const INITIAL_BIDS: BidRequest[] = [
  {
    id: 1, title: "১০০ কেজি বাসমতি চাল দরকার",
    description: "ভালো মানের বাসমতি চাল, ঢাকায় ডেলিভারি প্রয়োজন। বাজেট আলোচনাসাপেক্ষ।",
    budget: 12000, status: "open",
    bids: [
      { id: 1, supplier: "রহিম রাইস মিল", amount: 11500, note: "উচ্চমানের বাসমতি, ২ দিনে ডেলিভারি", confirmed: false },
      { id: 2, supplier: "গ্রীন ফার্ম হাউস", amount: 11800, note: "অর্গানিক বাসমতি, ফ্রি ডেলিভারি", confirmed: false },
    ]
  },
  {
    id: 2, title: "অফিসের জন্য ১০টি চেয়ার ক্রয় করতে চাই",
    description: "মাঝারি মানের আরামদায়ক অফিস চেয়ার, রাজশাহীতে ডেলিভারি।",
    budget: 25000, status: "open",
    bids: [
      { id: 3, supplier: "ফার্নি ওয়ার্ল্ড", amount: 22000, note: "নেট ব্যাক চেয়ার, ১ বছর ওয়ারেন্টি", confirmed: false },
    ]
  }
];

const fp = (n: number) => `৳${n.toLocaleString("en-IN")}`;

const condLabel: Record<Condition, string> = { new: "নতুন", used: "ব্যবহৃত", rent: "ভাড়া" };
const condColor: Record<Condition, string> = { new: "bg-emerald-100 text-emerald-800", used: "bg-amber-100 text-amber-800", rent: "bg-blue-100 text-blue-800" };
const sellerLabel: Record<SellerType, string> = { shop: "দোকান", krishok: "কৃষক", individual: "ব্যক্তিগত", online: "অনলাইন" };
const sellerColor: Record<SellerType, string> = { shop: "bg-purple-100 text-purple-800", krishok: "bg-green-100 text-green-800", individual: "bg-gray-100 text-gray-700", online: "bg-blue-100 text-blue-800" };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? "text-[#FFB300] fill-[#FFB300]" : "text-gray-300 fill-gray-200"} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </span>
  );
}

function ProductCard({ p, onView, onCart }: { p: Product; onView: () => void; onCart: () => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[rgba(45,138,77,0.12)] cursor-pointer group">
      <div className="relative overflow-hidden" style={{ background: "#f5faf5" }}>
        <img src={p.image} alt={p.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${condColor[p.condition]}`}>{condLabel[p.condition]}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sellerColor[p.sellerType]}`}>{sellerLabel[p.sellerType]}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); onCart(); }} className="absolute bottom-2 right-2 bg-[#2D8A4D] text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#256040]">
          <ShoppingCart size={14} />
        </button>
      </div>
      <div className="p-3" onClick={onView}>
        <p className="font-semibold text-[#212121] text-sm leading-tight mb-1 line-clamp-2">{p.name}</p>
        <Stars rating={p.rating} />
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
          <MapPin size={10} /><span>{p.location}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#2D8A4D] font-bold text-base">{fp(p.price)}</span>
          <button onClick={e => { e.stopPropagation(); onCart(); }} className="text-xs bg-[#FFB300] text-[#212121] font-semibold px-3 py-1 rounded-full hover:bg-[#FF8F00] transition-colors">
            কার্টে যোগ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productTab, setProductTab] = useState<Condition>("new");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [orderStatus, setOrderStatus] = useState<"pending" | "confirmed" | "shipped" | "delivered">("pending");
  const [bidRequests, setBidRequests] = useState<BidRequest[]>(INITIAL_BIDS);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [notifs, setNotifs] = useState<string[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    setMenuOpen(false);
    setShowPostMenu(false);
    setShowNotifs(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = (p: Product) => {
    if (!user) { toast.error("প্রথমে লগইন করুন"); navigate("auth"); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    toast.success(`"${p.name}" কার্টে যোগ হয়েছে!`);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const placeOrder = (payment: string, address: string) => {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const inv: InvoiceData = {
      id: `INV-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }),
      items: [...cart], total, payment, address,
      customer: user?.name || "অতিথি",
      phone: user?.phone || "",
    };
    setInvoiceData(inv);
    setCart([]);
    setOrderStatus("pending");
    navigate("invoice");
    const msg = `নতুন অর্ডার ${inv.id} — পেমেন্ট: ${payment} — মোট: ${fp(total)}`;
    setNotifs(n => [msg, ...n]);
    setNotifCount(c => c + 1);
    setTimeout(() => toast.success("ইনভয়েস তৈরি হয়েছে! অর্ডার প্রক্রিয়াধীন আছে ✅", { duration: 6000 }), 600);
  };

  const confirmBid = (reqId: number, bidId: number) => {
    setBidRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const bid = r.bids.find(b => b.id === bidId);
      if (!bid) return r;
      const msg = `বিড নিশ্চিত: ${bid.supplier} — ${fp(bid.amount)}। ইনভয়েস তৈরি হচ্ছে...`;
      setNotifs(n => [msg, ...n]);
      setNotifCount(c => c + 1);
      toast.success("বিড নিশ্চিত হয়েছে! ইনভয়েস তৈরি হচ্ছে... 📄", { duration: 5000 });
      return { ...r, status: "confirmed", bids: r.bids.map(b => ({ ...b, confirmed: b.id === bidId })) };
    }));
  };

  // ─── NAV ───────────────────────────────────────────────────────────────────
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function Navbar() {
    return (
      <header className="sticky top-0 z-50 bg-[#2D8A4D] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#FFB300] rounded-lg flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide hidden sm:block">সহজ বাজার</span>
          </button>

          <div className="flex-1 mx-2 hidden md:flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
            <Search size={16} className="ml-3 text-gray-400 flex-shrink-0" />
            <input placeholder="পণ্য বা সেবা খুঁজুন..." className="flex-1 px-3 py-2 text-sm outline-none bg-transparent" />
            <button className="bg-[#FFB300] text-white px-4 py-2 text-sm font-semibold hover:bg-[#FF8F00] transition-colors">খুঁজুন</button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Post button */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!user) { toast.error("পোস্ট করতে লগইন করুন"); navigate("auth"); return; }
                  setShowPostMenu(v => !v);
                }}
                className="flex items-center gap-1 bg-[#FFB300] text-[#212121] font-bold px-3 py-1.5 rounded-full text-sm hover:bg-[#FF8F00] transition-colors"
              >
                <Plus size={14} /><span className="hidden sm:inline">পোস্ট করুন</span>
              </button>
              {showPostMenu && (
                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[160px] z-50">
                  {["পণ্য বিক্রি করুন", "সেবা দিন", "রিকোয়েস্ট পাঠান"].map((label, i) => (
                    <button key={i} onClick={() => { setShowPostMenu(false); navigate(i === 2 ? "bid" : "post"); }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] rounded-lg transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency */}
            <button onClick={() => navigate("emergency")} className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1.5 rounded-full text-xs font-bold hover:bg-red-700 transition-colors">
              <AlertCircle size={13} /><span className="hidden sm:inline">জরুরি</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifs(v => !v)} className="relative text-white hover:text-[#FFB300] transition-colors">
                <Bell size={20} />
                {notifCount > 0 && <span className="absolute -top-1 -right-1 bg-[#FFB300] text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center">{notifCount}</span>}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[260px] max-h-72 overflow-auto z-50">
                  <div className="px-4 py-2 border-b text-sm font-semibold text-gray-700">নোটিফিকেশন</div>
                  {notifs.length === 0 ? <p className="px-4 py-3 text-sm text-gray-400">কোনো নোটিফিকেশন নেই</p> : notifs.map((n, i) => (
                    <div key={i} className="px-4 py-2.5 text-xs text-gray-700 border-b hover:bg-gray-50">{n}</div>
                  ))}
                  {notifCount > 0 && <button onClick={() => setNotifCount(0)} className="w-full text-center text-xs text-[#2D8A4D] py-2 hover:bg-gray-50">সব পড়া হয়েছে</button>}
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => navigate("cart")} className="relative text-white hover:text-[#FFB300] transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#FFB300] text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
            </button>

            {/* User */}
            {user ? (
              <button onClick={() => navigate("profile")} className="text-white hover:text-[#FFB300] transition-colors flex items-center gap-1">
                <div className="w-7 h-7 bg-[#FFB300] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <button onClick={() => navigate("auth")} className="text-white text-sm font-medium hover:text-[#FFB300] transition-colors flex items-center gap-1">
                <User size={18} /><span className="hidden sm:inline">লগইন</span>
              </button>
            )}

            <button onClick={() => setMenuOpen(v => !v)} className="text-white md:hidden">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-white rounded-xl overflow-hidden">
            <Search size={15} className="ml-3 text-gray-400" />
            <input placeholder="পণ্য বা সেবা খুঁজুন..." className="flex-1 px-2 py-2 text-sm outline-none" />
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#256040] px-4 py-3 space-y-2">
            {[["home","হোম"],["bid","বিড জোন"],["emergency","জরুরি সেবা"],user ? ["profile","আমার প্রোফাইল"] : ["auth","লগইন / রেজিস্ট্রেশন"]].map(([p,l]) => (
              <button key={p} onClick={() => navigate(p as Page)} className="w-full text-left text-white text-sm py-1.5 hover:text-[#FFB300] transition-colors">{l}</button>
            ))}
            {user && <button onClick={() => { setUser(null); navigate("home"); }} className="w-full text-left text-red-300 text-sm py-1.5">লগআউট</button>}
          </div>
        )}
      </header>
    );
  }

  // ─── HOME PAGE ─────────────────────────────────────────────────────────────
  function HomePage() {
    const [search, setSearch] = useState("");
    const [listening, setListening] = useState(false);

    const handleVoice = () => {
      setListening(true);
      toast("ভয়েস কমান্ড শুনছি... 🎤", { duration: 2000 });
      setTimeout(() => setListening(false), 2000);
    };

    return (
      <div>
        {/* Hero */}
        <section className="bg-[#2D8A4D] px-4 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #FFB300 1px, transparent 1px), radial-gradient(circle at 80% 20%, #FFB300 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-3xl mx-auto">
            <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
              সব সমস্যার সমাধান,
            </h1>
            <h1 className="text-[#FFB300] font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              এখন আপনার হাতের মুঠোয়।
            </h1>
            <p className="text-green-100 text-base mb-8">পণ্য কিনুন, বিক্রি করুন, সেবা নিন — সব একটি প্ল্যাটফর্মে</p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl shadow-2xl flex items-center overflow-hidden max-w-2xl mx-auto border-2 border-[#FFB300]">
              <Search size={18} className="ml-4 text-gray-400 flex-shrink-0" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="আপনার যা প্রয়োজন লিখুন অথবা ভয়েস কমান্ড দিন..."
                className="flex-1 px-3 py-4 text-sm outline-none bg-transparent"
              />
              <div className="flex items-center gap-2 pr-2">
                <button onClick={handleVoice} className={`p-2.5 rounded-full transition-colors ${listening ? "bg-red-500 text-white" : "bg-[#FFB300] text-white hover:bg-[#FF8F00]"}`} title="ভয়েস কমান্ড">
                  <Mic size={16} />
                </button>
                <button className="p-2.5 bg-[#2D8A4D] text-white rounded-full hover:bg-[#256040] transition-colors" title="ছবি আপলোড">
                  <Camera size={16} />
                </button>
                <button className="bg-[#2D8A4D] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#256040] transition-colors">
                  খুঁজুন
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {["ইলিশ মাছ", "স্মার্টফোন", "কৃষক থেকে কিনুন", "বাড়ি ভাড়া"].map(q => (
                <button key={q} onClick={() => setSearch(q)} className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">{q}</button>
              ))}
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="bg-white border-b border-[rgba(45,138,77,0.12)]">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { icon: Shield, label: "নিরাপদ বিডিং", color: "#2D8A4D" },
              { icon: CheckCircle, label: "ভেরিফাইড সাপ্লাইয়ার", color: "#1565C0" },
              { icon: FileText, label: "ইন্সট্যান্ট ইনভয়েস", color: "#FF8F00" },
              { icon: Truck, label: "দ্রুত ডেলিভারি", color: "#6A1B9A" },
              { icon: Phone, label: "২৪/৭ সাপোর্ট", color: "#C62828" },
              { icon: RotateCcw, label: "সহজ রিটার্ন", color: "#00695C" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-[10px] text-gray-600 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Category grid */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-[#212121] mb-5">ক্যাটাগরি অনুযায়ী কিনুন</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
            {CATEGORIES.map(({ id, icon: Icon, label, color, bg }) => (
              <button key={id} onClick={() => id === "emergency" ? navigate("emergency") : null}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5 col-span-2 sm:col-span-2 md:col-span-2"
                style={{ background: bg }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${color}22` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <span className="text-[10px] font-semibold text-center leading-tight" style={{ color }}>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Bid Zone CTA */}
        <section className="mx-4 mb-8 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #2D8A4D 0%, #1b5e20 100%)" }}>
          <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Zap size={12} /> নতুন ফিচার
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Request-to-Bid বিডিং সিস্টেম</h2>
              <p className="text-green-100 text-sm max-w-md">আপনার রিকোয়েস্ট দিন, সাপ্লায়াররা প্রতিযোগিতামূলক মূল্যে বিড করবে।<br />সেরা দামে পান আপনার প্রয়োজনীয় পণ্য।</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("bid")} className="bg-[#FFB300] text-[#212121] font-bold px-6 py-3 rounded-xl hover:bg-[#FF8F00] transition-colors">
                রিকোয়েস্ট দিন →
              </button>
              <button onClick={() => navigate("bid")} className="border border-white text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                বিডগুলো দেখুন
              </button>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#212121]">পণ্য সমূহ</h2>
            <div className="flex bg-white rounded-xl p-1 border border-[rgba(45,138,77,0.2)] shadow-sm">
              {(["new","used","rent"] as Condition[]).map(tab => (
                <button key={tab} onClick={() => setProductTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${productTab === tab ? "bg-[#2D8A4D] text-white" : "text-gray-500 hover:text-[#2D8A4D]"}`}>
                  {condLabel[tab]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PRODUCTS.filter(p => p.condition === productTab).map(p => (
              <ProductCard key={p.id} p={p}
                onView={() => { setSelectedProduct(p); navigate("product"); }}
                onCart={() => addToCart(p)} />
            ))}
            {PRODUCTS.filter(p => p.condition === productTab).length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400">এই ক্যাটাগরিতে কোনো পণ্য নেই</div>
            )}
          </div>
        </section>

        {/* Services */}
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-[#212121] mb-5">সেবা সমূহ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {SERVICES.map(({ icon: Icon, label, price, rating, available }) => (
                <button key={label} onClick={() => { if (!user) { toast.error("লগইন করুন"); navigate("auth"); } else toast.success(`${label} সেবা বুক হচ্ছে...`); }}
                  className="bg-[#E8F5E9] rounded-2xl p-4 text-center hover:bg-[#c8e6c9] transition-colors hover:shadow-md">
                  <div className="w-12 h-12 bg-[#2D8A4D] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="text-xs font-bold text-[#212121]">{label}</p>
                  <p className="text-[10px] text-[#2D8A4D] font-medium mt-0.5">{price}</p>
                  <Stars rating={rating} />
                  <p className="text-[9px] text-gray-400 mt-1">{available} জন উপলব্ধ</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1b5e20] text-white py-10 mt-0">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#FFB300] rounded-lg flex items-center justify-center"><ShoppingBag size={16} className="text-white" /></div>
                <span className="font-bold text-lg">সহজ বাজার</span>
              </div>
              <p className="text-green-200 text-xs leading-relaxed">বাংলাদেশের সবচেয়ে বড় সামাজিক মার্কেটপ্লেস। কৃষক থেকে শুরু করে বড় দোকান — সবাইকে একই প্ল্যাটফর্মে।</p>
            </div>
            {[
              { title: "পণ্য", links: ["নতুন পণ্য","ব্যবহৃত পণ্য","ভাড়া","বিডিং জোন"] },
              { title: "সেবা", links: ["ইলেকট্রিক","প্লাম্বিং","টিউটর","জরুরি সেবা"] },
              { title: "সাহায্য", links: ["যোগাযোগ","নীতিমালা","সাপোর্ট","FAQ"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold mb-3 text-[#FFB300]">{title}</h4>
                {links.map(l => <p key={l} className="text-green-200 text-xs mb-1.5 hover:text-white cursor-pointer">{l}</p>)}
              </div>
            ))}
          </div>
          <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-green-800 text-center text-green-300 text-xs">
            © ২০২৫ সহজ বাজার। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </footer>
      </div>
    );
  }

  // ─── AUTH ─────────────────────────────────────────────────────────────────
  function AuthPage() {
    const [form, setForm] = useState({ name: "", phone: "", pass: "", otp: "" });
    const [step, setStep] = useState<"form" | "otp">("form");
    const [showPass, setShowPass] = useState(false);

    const handleLogin = () => {
      if (!form.phone || !form.pass) { toast.error("সব তথ্য পূরণ করুন"); return; }
      setUser({ name: form.phone.startsWith("01") ? "ব্যবহারকারী" : form.name, phone: form.phone });
      toast.success("সফলভাবে লগইন হয়েছে! স্বাগতম 👋");
      navigate("home");
    };

    const handleRegister = () => {
      if (!form.name || !form.phone || !form.pass) { toast.error("সব তথ্য পূরণ করুন"); return; }
      if (step === "form") {
        setStep("otp");
        toast.success(`${form.phone} নম্বরে OTP পাঠানো হয়েছে`);
        return;
      }
      if (form.otp !== "1234") { toast.error("OTP ভুল! (টেস্টের জন্য: 1234)"); return; }
      setUser({ name: form.name, phone: form.phone });
      const msg = `নতুন রেজিস্ট্রেশন: ${form.name} (${form.phone})`;
      setNotifs(n => [msg, ...n]);
      toast.success("রেজিস্ট্রেশন সফল! আপনাকে স্বাগতম 🎉");
      navigate("home");
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-[#2D8A4D] p-6 text-center">
            <div className="w-14 h-14 bg-[#FFB300] rounded-full flex items-center justify-center mx-auto mb-3">
              <User size={26} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-xl">সহজ বাজারে স্বাগতম</h2>
            <p className="text-green-100 text-sm mt-1">লগইন বা নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>

          <div className="flex border-b">
            {(["login","register"] as const).map(tab => (
              <button key={tab} onClick={() => { setAuthTab(tab); setStep("form"); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${authTab === tab ? "text-[#2D8A4D] border-b-2 border-[#2D8A4D]" : "text-gray-400"}`}>
                {tab === "login" ? "লগইন" : "নতুন অ্যাকাউন্ট"}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {authTab === "register" && step === "form" && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">আপনার নাম</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="যেমন: মোঃ রহিম উদ্দিন"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] focus:ring-2 focus:ring-[#2D8A4D]/20 transition" />
              </div>
            )}

            {step === "form" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">মোবাইল নম্বর</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] focus:ring-2 focus:ring-[#2D8A4D]/20 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">পাসওয়ার্ড</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={form.pass} onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] focus:ring-2 focus:ring-[#2D8A4D]/20 transition pr-10" />
                    <button onClick={() => setShowPass(v => !v)} className="absolute right-3 top-3 text-gray-400">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
              </>
            )}

            {step === "otp" && (
              <div>
                <p className="text-sm text-gray-600 mb-3">{form.phone} নম্বরে OTP পাঠানো হয়েছে। (টেস্ট OTP: 1234)</p>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">OTP কোড দিন</label>
                <input value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value }))}
                  placeholder="4 সংখ্যার OTP"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] focus:ring-2 focus:ring-[#2D8A4D]/20 transition text-center text-2xl tracking-widest" maxLength={4} />
              </div>
            )}

            <button onClick={authTab === "login" ? handleLogin : handleRegister}
              className="w-full bg-[#2D8A4D] text-white font-bold py-3.5 rounded-xl hover:bg-[#256040] transition-colors">
              {authTab === "login" ? "লগইন করুন" : step === "form" ? "OTP পাঠান" : "নিশ্চিত করুন"}
            </button>

            {authTab === "login" && (
              <div className="text-center">
                <button onClick={() => { setAuthTab("register"); setStep("form"); }} className="text-[#2D8A4D] text-sm hover:underline">
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">লগইন করলে আপনি আমাদের <span className="text-[#2D8A4D]">শর্তাবলী</span> এবং <span className="text-[#2D8A4D]">গোপনীয়তা নীতি</span> মেনে নিচ্ছেন।</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── POST PRODUCT ─────────────────────────────────────────────────────────
  function PostProductPage() {
    const [form, setForm] = useState({ sellerType: "", condition: "new" as Condition, name: "", desc: "", price: "", duration: "7", payMethod: "", image: "" });
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const durations = [{ v: "7", l: "১ সপ্তাহ" },{ v: "14", l: "২ সপ্তাহ" },{ v: "30", l: "১ মাস" },{ v: "90", l: "৩ মাস" }];
    const boostPrices: Record<string, number> = { "7": 0, "14": 50, "30": 150, "90": 400 };

    const handleSubmit = () => {
      if (!form.sellerType || !form.name || !form.price || !form.payMethod) { toast.error("সব তথ্য পূরণ করুন"); return; }
      const msg = `নতুন পোস্ট অনুমোদনের অপেক্ষায়: "${form.name}" — ${fp(Number(form.price))}`;
      setNotifs(n => [msg, ...n]);
      setNotifCount(c => c + 1);
      setSubmitted(true);
      toast.success("পোস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদনের পর প্রকাশিত হবে। ✅");
    };

    if (submitted) return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-[#2D8A4D]" /></div>
          <h2 className="text-xl font-bold text-[#212121] mb-2">পোস্ট জমা হয়েছে!</h2>
          <p className="text-gray-500 text-sm mb-6">আপনার পোস্টটি অ্যাডমিনের কাছে পাঠানো হয়েছে। অনুমোদন হলে আপনাকে SMS জানানো হবে।</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-amber-700 mb-2">পোস্টের সারসংক্ষেপ</p>
            <p className="text-sm text-gray-700"><span className="font-medium">পণ্য:</span> {form.name}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">মূল্য:</span> {fp(Number(form.price))}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">অবস্থা:</span> {condLabel[form.condition]}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">স্ট্যাটাস:</span> <span className="text-amber-600 font-semibold">Pending</span></p>
          </div>
          <button onClick={() => navigate("home")} className="bg-[#2D8A4D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#256040] transition-colors">হোমে ফিরুন</button>
        </div>
      </div>
    );

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 text-[#2D8A4D] text-sm font-medium mb-5 hover:underline"><ArrowLeft size={16} />ফিরে যান</button>
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-[#2D8A4D] px-6 py-5">
            <h1 className="text-white font-bold text-xl">নতুন পোস্ট যোগ করুন</h1>
            <p className="text-green-100 text-sm">আপনার পণ্য বা সেবা বিজ্ঞাপন দিন</p>
          </div>
          <div className="p-6 space-y-5">
            {/* Seller type */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">আপনি কে? <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[["shop","দোকান / শপ","🏪"],["online","অনলাইন বিজনেস","💻"],["individual","ব্যক্তিগত","👤"],["krishok","কৃষক","🌾"]].map(([v,l,em]) => (
                  <button key={v} onClick={() => setForm(f => ({ ...f, sellerType: v }))}
                    className={`border-2 rounded-xl py-2.5 text-center text-xs font-semibold transition-colors ${form.sellerType === v ? "border-[#2D8A4D] bg-[#E8F5E9] text-[#2D8A4D]" : "border-gray-200 text-gray-600 hover:border-[#2D8A4D]/50"}`}>
                    <div className="text-xl mb-1">{em}</div>{l}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">পণ্যের অবস্থা <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                {(["new","used","rent"] as Condition[]).map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, condition: c }))}
                    className={`flex-1 border-2 rounded-xl py-2 text-sm font-semibold transition-colors ${form.condition === c ? "border-[#2D8A4D] bg-[#E8F5E9] text-[#2D8A4D]" : "border-gray-200 text-gray-500 hover:border-[#2D8A4D]/50"}`}>
                    {condLabel[c]}
                  </button>
                ))}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">পণ্যের ছবি</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) { setForm(f => ({ ...f, image: URL.createObjectURL(file) })); toast.success("ছবি আপলোড হয়েছে"); }
              }} />
              <button onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-[#2D8A4D]/40 rounded-2xl py-8 text-center hover:border-[#2D8A4D] transition-colors bg-[#f5faf5]">
                {form.image ? (
                  <img src={form.image} className="h-24 mx-auto rounded-xl object-cover" alt="preview" />
                ) : (
                  <>
                    <Upload size={24} className="text-[#2D8A4D] mx-auto mb-2" />
                    <p className="text-sm text-gray-500">ছবি আপলোড করুন</p>
                    <p className="text-xs text-gray-400">JPG, PNG — সর্বোচ্চ ৫MB</p>
                  </>
                )}
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">পণ্যের নাম <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="যেমন: Samsung Galaxy A55 (নতুন, সিলড)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition" />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">বিবরণ</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition h-24 resize-none" />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">মূল্য (৳) <span className="text-red-500">*</span></label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition" />
            </div>

            {/* Duration (like Facebook boost) */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">বিজ্ঞাপনের মেয়াদ</label>
              <div className="grid grid-cols-4 gap-2">
                {durations.map(({ v, l }) => (
                  <button key={v} onClick={() => setForm(f => ({ ...f, duration: v }))}
                    className={`border-2 rounded-xl py-2.5 text-center transition-colors ${form.duration === v ? "border-[#2D8A4D] bg-[#E8F5E9] text-[#2D8A4D]" : "border-gray-200 text-gray-500"}`}>
                    <p className="text-xs font-bold">{l}</p>
                    <p className="text-[10px] text-gray-400">{boostPrices[v] === 0 ? "বিনামূল্যে" : `৳${boostPrices[v]}`}</p>
                  </button>
                ))}
              </div>
              {Number(form.duration) > 7 && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                  বাড়তি মেয়াদের জন্য বুস্ট ফি: ৳{boostPrices[form.duration]}। পেমেন্ট নিচে নির্বাচন করুন।
                </div>
              )}
            </div>

            {/* Payment */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">পেমেন্ট পদ্ধতি <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {[["bkash","bKash","01XXXXXXXXX","#E91E8C"],["nagad","Nagad","01XXXXXXXXX","#FF6600"],["bank","ব্যাংক ট্রান্সফার","হিসাব নম্বর দিন","#1565C0"]].map(([v,l,hint,c]) => (
                  <label key={v} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${form.payMethod === v ? "border-[#2D8A4D] bg-[#E8F5E9]" : "border-gray-200 hover:border-[#2D8A4D]/50"}`}>
                    <input type="radio" name="pay" value={v} checked={form.payMethod === v} onChange={() => setForm(f => ({ ...f, payMethod: v }))} className="accent-[#2D8A4D]" />
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: c }}>
                      <CreditCard size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{l}</p>
                      <p className="text-[10px] text-gray-400">{hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} className="w-full bg-[#2D8A4D] text-white font-bold py-4 rounded-xl hover:bg-[#256040] transition-colors text-base">
              পোস্ট জমা দিন →
            </button>
            <p className="text-xs text-gray-400 text-center">অ্যাডমিন অনুমোদনের পর আপনার পোস্ট প্রকাশিত হবে</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── PRODUCT DETAIL ────────────────────────────────────────────────────────
  function ProductDetailPage() {
    const p = selectedProduct;
    if (!p) return null;
    const [qty, setQty] = useState(1);
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 text-[#2D8A4D] text-sm font-medium mb-5 hover:underline"><ArrowLeft size={16} />পণ্যের তালিকায় ফিরুন</button>
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-[#f5faf5] flex items-center justify-center p-6 min-h-72">
              <img src={p.image} alt={p.name} className="max-h-72 rounded-2xl object-contain" />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${condColor[p.condition]}`}>{condLabel[p.condition]}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sellerColor[p.sellerType]}`}>{sellerLabel[p.sellerType]}</span>
              </div>
              <h1 className="text-2xl font-bold text-[#212121] mb-2">{p.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Stars rating={p.rating} />
                <span className="text-sm text-gray-400">({p.reviews} রিভিউ)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <MapPin size={13} /><span>{p.location}</span>
                <span className="mx-2">•</span>
                <span>বিক্রেতা: <span className="text-[#2D8A4D] font-semibold">{p.seller}</span></span>
              </div>
              <div className="text-3xl font-bold text-[#2D8A4D] mb-2">{fp(p.price)}</div>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{p.description}</p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-medium text-gray-600">পরিমাণ:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1,q-1))} className="px-3 py-2 text-gray-500 hover:bg-gray-50">−</button>
                  <span className="px-4 py-2 font-semibold text-sm">{qty}</span>
                  <button onClick={() => setQty(q => q+1)} className="px-3 py-2 text-gray-500 hover:bg-gray-50">+</button>
                </div>
                <span className="text-sm text-gray-400">মোট: {fp(p.price * qty)}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => {
                  for (let i = 0; i < qty; i++) addToCart(p);
                }} className="flex-1 bg-[#FFB300] text-[#212121] font-bold py-3 rounded-xl hover:bg-[#FF8F00] transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />কার্টে যোগ
                </button>
                <button onClick={() => {
                  addToCart(p);
                  navigate("cart");
                }} className="flex-1 bg-[#2D8A4D] text-white font-bold py-3 rounded-xl hover:bg-[#256040] transition-colors">
                  এখনই কিনুন
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[["🛡️","নিরাপদ পেমেন্ট"],["🔄","সহজ রিটার্ন"],["🚚","দ্রুত ডেলিভারি"]].map(([e,l]) => (
                  <div key={l} className="bg-[#E8F5E9] rounded-xl p-2">
                    <div className="text-lg">{e}</div>
                    <div className="text-[10px] text-gray-600">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CART ─────────────────────────────────────────────────────────────────
  function CartPage() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 text-[#2D8A4D] text-sm font-medium mb-5 hover:underline"><ArrowLeft size={16} />কেনাকাটা চালিয়ে যান</button>
        <h1 className="text-2xl font-bold text-[#212121] mb-5">আমার কার্ট ({cartCount}টি পণ্য)</h1>
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center">
            <ShoppingCart size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">আপনার কার্ট খালি। কেনাকাটা শুরু করুন!</p>
            <button onClick={() => navigate("home")} className="mt-4 bg-[#2D8A4D] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#256040] transition-colors text-sm">পণ্য দেখুন</button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#212121] line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.seller}</p>
                  <p className="text-[#2D8A4D] font-bold text-sm mt-1">{fp(item.price)} × {item.qty} = {fp(item.price * item.qty)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} className="px-2 py-1 hover:bg-gray-50">−</button>
                    <span className="px-2 py-1 font-semibold">{item.qty}</span>
                    <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} className="px-2 py-1 hover:bg-gray-50">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><X size={16} /></button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex justify-between text-sm text-gray-500 mb-1"><span>সাবটোটাল</span><span>{fp(total)}</span></div>
              <div className="flex justify-between text-sm text-gray-500 mb-3"><span>ডেলিভারি চার্জ</span><span className="text-green-600">বিনামূল্যে</span></div>
              <div className="flex justify-between font-bold text-lg text-[#212121] border-t pt-3"><span>মোট</span><span className="text-[#2D8A4D]">{fp(total)}</span></div>
              <button onClick={() => navigate("checkout")} className="w-full mt-4 bg-[#2D8A4D] text-white font-bold py-3.5 rounded-xl hover:bg-[#256040] transition-colors">
                অর্ডার দিন →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── CHECKOUT ─────────────────────────────────────────────────────────────
  function CheckoutPage() {
    const [addr, setAddr] = useState("");
    const [payMethod, setPayMethod] = useState("");
    const [payNum, setPayNum] = useState("");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate("cart")} className="flex items-center gap-2 text-[#2D8A4D] text-sm font-medium mb-5 hover:underline"><ArrowLeft size={16} />কার্টে ফিরুন</button>
        <h1 className="text-2xl font-bold text-[#212121] mb-6">অর্ডার নিশ্চিত করুন</h1>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-3">ডেলিভারি ঠিকানা</h3>
            <textarea value={addr} onChange={e => setAddr(e.target.value)}
              placeholder="বিস্তারিত ঠিকানা লিখুন — বাড়ি নং, রাস্তা, এলাকা, জেলা..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition h-24 resize-none" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-3">পেমেন্ট পদ্ধতি (ম্যানুয়াল)</h3>
            <div className="space-y-2">
              {[["bkash","bKash","#E91E8C"],["nagad","Nagad","#FF6600"],["bank","ব্যাংক ট্রান্সফার","#1565C0"]].map(([v,l,c]) => (
                <label key={v} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${payMethod === v ? "border-[#2D8A4D] bg-[#E8F5E9]" : "border-gray-200 hover:border-[#2D8A4D]/50"}`}>
                  <input type="radio" name="pm" value={v} checked={payMethod === v} onChange={() => setPayMethod(v)} className="accent-[#2D8A4D]" />
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>{l.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{l}</p>
                    {payMethod === v && <input value={payNum} onChange={e => setPayNum(e.target.value)}
                      placeholder={v === "bank" ? "হিসাব নম্বর লিখুন" : "01XXXXXXXXX"}
                      className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#2D8A4D]" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between font-bold text-lg"><span>মোট পরিশোধ</span><span className="text-[#2D8A4D]">{fp(total)}</span></div>
          </div>

          <button onClick={() => {
            if (!addr) { toast.error("ডেলিভারি ঠিকানা দিন"); return; }
            if (!payMethod) { toast.error("পেমেন্ট পদ্ধতি বেছে নিন"); return; }
            placeOrder(payMethod, addr);
          }} className="w-full bg-[#2D8A4D] text-white font-bold py-4 rounded-xl hover:bg-[#256040] transition-colors text-base">
            অর্ডার নিশ্চিত করুন ✓
          </button>
          <p className="text-xs text-gray-400 text-center">অর্ডার দেওয়ার পরে স্বয়ংক্রিয়ভাবে ইনভয়েস তৈরি হবে</p>
        </div>
      </div>
    );
  }

  // ─── INVOICE ──────────────────────────────────────────────────────────────
  function InvoicePage() {
    if (!invoiceData) return null;
    const statuses = ["pending","confirmed","shipped","delivered"];
    const statusLabels: Record<string, string> = { pending:"অপেক্ষায়", confirmed:"নিশ্চিত", shipped:"পথে", delivered:"পৌঁছে গেছে" };
    const statusColors: Record<string, string> = { pending:"text-amber-600 bg-amber-50", confirmed:"text-blue-600 bg-blue-50", shipped:"text-purple-600 bg-purple-50", delivered:"text-green-600 bg-green-50" };
    const statusIdx = statuses.indexOf(orderStatus);

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 text-[#2D8A4D] text-sm font-medium mb-5 hover:underline"><ArrowLeft size={16} />হোমে ফিরুন</button>

        {/* Success banner */}
        <div className="bg-[#2D8A4D] rounded-2xl p-5 mb-5 text-center text-white">
          <CheckCircle size={36} className="mx-auto mb-2" />
          <h2 className="font-bold text-lg">অর্ডার সফলভাবে নিশ্চিত হয়েছে!</h2>
          <p className="text-green-100 text-sm">ইনভয়েস নম্বর: {invoiceData.id}</p>
        </div>

        {/* Order tracking */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h3 className="font-semibold text-gray-700 mb-4">অর্ডার ট্র্যাকিং</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 z-0" />
            <div className="absolute left-0 top-4 h-0.5 bg-[#2D8A4D] z-0 transition-all" style={{ width: `${(statusIdx / (statuses.length - 1)) * 100}%` }} />
            {statuses.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${i <= statusIdx ? "bg-[#2D8A4D] border-[#2D8A4D]" : "bg-white border-gray-200"}`}>
                  {i < statusIdx ? <Check size={14} className="text-white" /> : <div className={`w-2 h-2 rounded-full ${i === statusIdx ? "bg-white" : "bg-gray-300"}`} />}
                </div>
                <span className="text-[9px] text-gray-500 text-center leading-tight">{statusLabels[s]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {statuses.map((s, i) => i > statusIdx && i === statusIdx + 1 && (
              <button key={s} onClick={() => { setOrderStatus(s as any); const msg = `অর্ডার ${invoiceData.id}: ${statusLabels[s]}`; setNotifs(n => [msg,...n]); setNotifCount(c => c+1); toast.success(`অর্ডার স্ট্যাটাস আপডেট: ${statusLabels[s]}`); }}
                className="text-xs bg-[#2D8A4D] text-white px-4 py-2 rounded-full hover:bg-[#256040] transition-colors">
                পরবর্তী ধাপ: {statusLabels[s]}
              </button>
            ))}
            {orderStatus === "delivered" && <div className="text-sm text-green-600 font-semibold flex items-center gap-1"><CheckCircle size={16} />ডেলিভারি সম্পন্ন!</div>}
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#f5faf5] border-b border-[rgba(45,138,77,0.15)] px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">ইনভয়েস নম্বর</p>
              <p className="font-bold text-[#2D8A4D] font-mono">{invoiceData.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">তারিখ</p>
              <p className="text-sm font-semibold text-gray-700">{invoiceData.date}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[orderStatus]}`}>{statusLabels[orderStatus]}</span>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div><p className="text-xs text-gray-400 mb-0.5">গ্রাহক</p><p className="font-semibold text-gray-700">{invoiceData.customer}</p><p className="text-xs text-gray-400">{invoiceData.phone}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">ঠিকানা</p><p className="font-semibold text-gray-700 text-xs leading-relaxed">{invoiceData.address}</p></div>
            </div>
            <table className="w-full text-sm mb-4">
              <thead><tr className="border-b"><th className="text-left py-2 text-xs text-gray-400 font-medium">পণ্য</th><th className="text-center py-2 text-xs text-gray-400 font-medium">পরিমাণ</th><th className="text-right py-2 text-xs text-gray-400 font-medium">মূল্য</th></tr></thead>
              <tbody>
                {invoiceData.items.map((item: CartItem) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-2.5 text-gray-700 text-xs">{item.name}</td>
                    <td className="py-2.5 text-center text-gray-500 text-xs">{item.qty}</td>
                    <td className="py-2.5 text-right font-semibold text-[#212121] text-xs">{fp(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-[#E8F5E9] rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1"><span>সাবটোটাল</span><span>{fp(invoiceData.total)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 mb-1"><span>ডেলিভারি</span><span className="text-green-600">বিনামূল্যে</span></div>
              <div className="flex justify-between font-bold text-base text-[#2D8A4D] border-t border-green-200 pt-2 mt-2"><span>মোট</span><span>{fp(invoiceData.total)}</span></div>
              <div className="mt-2 text-xs text-gray-500">পেমেন্ট: {invoiceData.payment === "bkash" ? "bKash" : invoiceData.payment === "nagad" ? "Nagad" : "ব্যাংক ট্রান্সফার"}</div>
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-3">
            <button onClick={() => { toast.success("ইনভয়েস ডাউনলোড হচ্ছে..."); }} className="flex-1 border border-[#2D8A4D] text-[#2D8A4D] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#E8F5E9] transition-colors flex items-center justify-center gap-2">
              <Download size={15} />ডাউনলোড
            </button>
            <button onClick={() => { navigate("home"); toast.success("কেনাকাটার জন্য ধন্যবাদ! 🎉"); }} className="flex-1 bg-[#2D8A4D] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#256040] transition-colors">
              সম্পন্ন করুন ✓
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── BID ZONE ─────────────────────────────────────────────────────────────
  function BidZonePage() {
    const [showForm, setShowForm] = useState(false);
    const [newReq, setNewReq] = useState({ title: "", desc: "", budget: "" });
    const [expandedBid, setExpandedBid] = useState<number | null>(null);

    const submitRequest = () => {
      if (!newReq.title || !newReq.budget) { toast.error("শিরোনাম এবং বাজেট দিন"); return; }
      if (!user) { toast.error("লগইন করুন"); navigate("auth"); return; }
      setBidRequests(prev => [...prev, { id: Date.now(), title: newReq.title, description: newReq.desc, budget: Number(newReq.budget), bids: [], status: "open" }]);
      setNewReq({ title: "", desc: "", budget: "" });
      setShowForm(false);
      toast.success("রিকোয়েস্ট সফলভাবে পোস্ট হয়েছে! সাপ্লায়াররা শীঘ্রই বিড করবে।");
      setNotifs(n => [`নতুন রিকোয়েস্ট: "${newReq.title}" — বাজেট: ${fp(Number(newReq.budget))}`, ...n]);
      setNotifCount(c => c + 1);
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#212121]">বিডিং জোন</h1>
            <p className="text-sm text-gray-500">রিকোয়েস্ট দিন, সাপ্লায়াররা সেরা দামে বিড করবে</p>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="bg-[#FFB300] text-[#212121] font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#FF8F00] transition-colors flex items-center gap-2">
            <Plus size={16} />রিকোয়েস্ট দিন
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">নতুন রিকোয়েস্ট</h3>
            <div className="space-y-3">
              <input value={newReq.title} onChange={e => setNewReq(f => ({ ...f, title: e.target.value }))}
                placeholder="কী দরকার? (যেমন: ১০০ কেজি আম)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition" />
              <textarea value={newReq.desc} onChange={e => setNewReq(f => ({ ...f, desc: e.target.value }))}
                placeholder="বিস্তারিত বিবরণ, ডেলিভারি স্থান, সময়সীমা..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition h-20 resize-none" />
              <input type="number" value={newReq.budget} onChange={e => setNewReq(f => ({ ...f, budget: e.target.value }))}
                placeholder="বাজেট (৳)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D8A4D] transition" />
              <div className="flex gap-3">
                <button onClick={submitRequest} className="flex-1 bg-[#2D8A4D] text-white font-bold py-3 rounded-xl hover:bg-[#256040] transition-colors text-sm">রিকোয়েস্ট পাঠান</button>
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">বাতিল</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {bidRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 cursor-pointer" onClick={() => setExpandedBid(expandedBid === req.id ? null : req.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${req.status === "open" ? "bg-green-100 text-green-700" : req.status === "confirmed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {req.status === "open" ? "বিড চলছে" : req.status === "confirmed" ? "নিশ্চিত" : "সম্পন্ন"}
                      </span>
                      <span className="text-xs text-gray-400">{req.bids.length}টি বিড</span>
                    </div>
                    <h3 className="font-semibold text-[#212121]">{req.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{req.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">বাজেট</p>
                    <p className="font-bold text-[#2D8A4D]">{fp(req.budget)}</p>
                    <ChevronRight size={16} className={`text-gray-400 ml-auto mt-1 transition-transform ${expandedBid === req.id ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </div>

              {expandedBid === req.id && req.bids.length > 0 && (
                <div className="border-t border-gray-50 px-5 pb-5">
                  <p className="text-xs font-semibold text-gray-400 mb-3 mt-3">সাপ্লায়ারদের বিড</p>
                  <div className="space-y-3">
                    {req.bids.map(bid => (
                      <div key={bid.id} className={`border rounded-xl p-3 ${bid.confirmed ? "border-[#2D8A4D] bg-[#E8F5E9]" : "border-gray-100"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-[#212121]">{bid.supplier}</span>
                          <span className="font-bold text-[#2D8A4D]">{fp(bid.amount)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{bid.note}</p>
                        {!bid.confirmed && req.status === "open" && (
                          <button onClick={() => confirmBid(req.id, bid.id)}
                            className="w-full bg-[#FFB300] text-[#212121] text-xs font-bold py-2 rounded-lg hover:bg-[#FF8F00] transition-colors">
                            এই বিড নিশ্চিত করুন ✓
                          </button>
                        )}
                        {bid.confirmed && <div className="flex items-center gap-1 text-xs text-[#2D8A4D] font-semibold"><CheckCircle size={12} />বিড নিশ্চিত হয়েছে — ইনভয়েস তৈরি হচ্ছে</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {expandedBid === req.id && req.bids.length === 0 && (
                <div className="border-t border-gray-50 px-5 pb-4 pt-3 text-center text-sm text-gray-400">
                  এখনো কোনো বিড আসেনি। অপেক্ষা করুন...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── EMERGENCY ────────────────────────────────────────────────────────────
  function EmergencyPage() {
    const [presImg, setPresImg] = useState<string | null>(null);
    const [medicineName, setMedicineName] = useState("");
    const [ordered, setOrdered] = useState(false);
    const camRef = useRef<HTMLInputElement>(null);
    const fileRef2 = useRef<HTMLInputElement>(null);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 text-[#2D8A4D] text-sm font-medium mb-5 hover:underline"><ArrowLeft size={16} />হোমে ফিরুন</button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24} className="text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-[#212121]">জরুরি সেবা</h1>
            <p className="text-sm text-red-600 font-medium">২৪/৭ সার্বক্ষণিক সেবা</p>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[["🚑","অ্যাম্বুলেন্স","999","bg-red-600"],["🚒","ফায়ার সার্ভিস","199","bg-orange-600"],["👮","পুলিশ","100","bg-blue-700"]].map(([e,l,n,c]) => (
            <a key={l} href={`tel:${n}`} className={`${c} text-white rounded-2xl p-4 text-center hover:opacity-90 transition-opacity`}>
              <div className="text-2xl mb-1">{e}</div>
              <p className="font-bold text-sm">{l}</p>
              <p className="text-xs opacity-80">{n}</p>
            </a>
          ))}
        </div>

        {/* Pharmacy */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="bg-red-50 border-b border-red-100 px-5 py-4 flex items-center gap-3">
            <Pill size={20} className="text-red-600" />
            <div>
              <h2 className="font-bold text-red-800">অনলাইন ফার্মেসি</h2>
              <p className="text-xs text-red-500">প্রেসক্রিপশন আপলোড করুন বা ওষুধের নাম লিখুন</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* Prescription camera */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">প্রেসক্রিপশন ছবি তুলুন বা আপলোড করুন</p>
              <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setPresImg(URL.createObjectURL(f)); toast.success("প্রেসক্রিপশন আপলোড হয়েছে"); }
              }} />
              <input ref={fileRef2} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setPresImg(URL.createObjectURL(f)); toast.success("প্রেসক্রিপশন আপলোড হয়েছে"); }
              }} />
              <div className="flex gap-3">
                <button onClick={() => camRef.current?.click()} className="flex-1 border-2 border-dashed border-red-300 rounded-xl py-4 text-center hover:border-red-500 transition-colors bg-red-50">
                  <Camera size={22} className="text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-red-600 font-semibold">ক্যামেরায় তুলুন</p>
                </button>
                <button onClick={() => fileRef2.current?.click()} className="flex-1 border-2 border-dashed border-gray-200 rounded-xl py-4 text-center hover:border-gray-400 transition-colors">
                  <Upload size={22} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 font-semibold">গ্যালারি থেকে</p>
                </button>
              </div>
              {presImg && (
                <div className="mt-3 relative">
                  <img src={presImg} alt="prescription" className="w-full max-h-40 object-cover rounded-xl" />
                  <button onClick={() => setPresImg(null)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                </div>
              )}
            </div>

            {/* Medicine search */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">অথবা ওষুধের নাম লিখুন</p>
              <div className="flex gap-2">
                <input value={medicineName} onChange={e => setMedicineName(e.target.value)}
                  placeholder="যেমন: Napa, Amoxicillin, Pantoprazole..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition" />
                <button className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors"><Search size={16} /></button>
              </div>
            </div>

            {(presImg || medicineName) && !ordered && (
              <button onClick={() => {
                if (!user) { toast.error("অর্ডার করতে লগইন করুন"); navigate("auth"); return; }
                setOrdered(true);
                const msg = `ফার্মেসি অর্ডার: ${medicineName || "প্রেসক্রিপশন অনুযায়ী"} — ২ ঘণ্টায় ডেলিভারি`;
                setNotifs(n => [msg, ...n]);
                setNotifCount(c => c + 1);
                toast.success("ওষুধের অর্ডার নেওয়া হয়েছে! ২ ঘণ্টার মধ্যে পৌঁছে দেওয়া হবে 💊");
              }} className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Send size={16} />ওষুধ অর্ডার করুন (২ ঘণ্টায় ডেলিভারি)
              </button>
            )}
            {ordered && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-700">অর্ডার নিশ্চিত!</p>
                <p className="text-xs text-green-500">ফার্মাসিস্ট আপনার প্রেসক্রিপশন যাচাই করছে। ২ ঘণ্টায় ডেলিভারি।</p>
              </div>
            )}
          </div>
        </div>

        {/* Other emergency services */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Truck, title: "রেন্টাল কার (জরুরি)", desc: "৩০ মিনিটে গাড়ি", color: "#1565C0", action: "গাড়ি ডাকুন" },
            { icon: Phone, title: "ডাক্তার পরামর্শ", desc: "অনলাইন কনসালটেশন", color: "#6A1B9A", action: "পরামর্শ নিন" },
          ].map(({ icon: Icon, title, desc, color, action }) => (
            <button key={title} onClick={() => { if (!user) { toast.error("লগইন করুন"); navigate("auth"); } else toast.success(`${title} সেবা বুক হচ্ছে...`); }}
              className="bg-white rounded-2xl shadow-sm p-4 text-left hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-bold text-sm text-[#212121]">{title}</p>
              <p className="text-xs text-gray-400 mb-3">{desc}</p>
              <span className="text-xs font-bold" style={{ color }}>{action} →</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── PROFILE ──────────────────────────────────────────────────────────────
  function ProfilePage() {
    if (!user) { navigate("auth"); return null; }
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#212121] mb-6">আমার প্রোফাইল</h1>
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
          <div className="bg-[#2D8A4D] p-6 text-center">
            <div className="w-16 h-16 bg-[#FFB300] rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-white font-bold text-lg">{user.name}</h2>
            <p className="text-green-100 text-sm">{user.phone}</p>
          </div>
          <div className="p-5 space-y-3">
            {[["🛒","আমার অর্ডার","cart"],["❤️","পছন্দের পণ্য","home"],["📦","আমার পোস্ট","post"],["🏆","বিডিং ইতিহাস","bid"]].map(([e,l,p]) => (
              <button key={l} onClick={() => navigate(p as Page)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#E8F5E9] transition-colors text-left">
                <span className="text-xl">{e}</span>
                <span className="text-sm font-medium text-gray-700">{l}</span>
                <ChevronRight size={14} className="text-gray-300 ml-auto" />
              </button>
            ))}
            <button onClick={() => { setUser(null); navigate("home"); toast.success("সফলভাবে লগআউট হয়েছে"); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left text-red-500">
              <LogOut size={18} />
              <span className="text-sm font-medium">লগআউট</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Hind Siliguri', 'Inter', sans-serif" }} className="min-h-screen bg-[#E8F5E9]">
      <Toaster position="top-center" richColors closeButton />
      <Navbar />
      <main>
        {page === "home" && <HomePage />}
        {page === "auth" && <AuthPage />}
        {page === "post" && <PostProductPage />}
        {page === "product" && <ProductDetailPage />}
        {page === "cart" && <CartPage />}
        {page === "checkout" && <CheckoutPage />}
        {page === "invoice" && <InvoicePage />}
        {page === "bid" && <BidZonePage />}
        {page === "emergency" && <EmergencyPage />}
        {page === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}
