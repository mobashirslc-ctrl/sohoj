import { useState } from "react";
import { toast } from "sonner";
// Firebase ইমপোর্ট
import { db } from "../services/firebase"; 
import { collection, addDoc } from "firebase/firestore";

const PostForm = () => {
  const [formData, setFormData] = useState({
    sellerType: "",
    condition: "নতুন",
    name: "",
    description: "",
    price: "",
    duration: "১ সপ্তাহ",
    paymentMethod: ""
  });

  // আপডেট করা handleSubmit ফাংশন
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // বেসিক ভ্যালিডেশন
    if (!formData.sellerType || !formData.name || !formData.price || !formData.paymentMethod) {
      toast.error("অনুগ্রহ করে সব প্রয়োজনীয় তথ্য (*) পূরণ করুন!");
      return;
    }

    try {
      // Firebase-এ ডাটা পাঠানো
      await addDoc(collection(db, "products"), {
        ...formData,
        status: "pending",
        createdAt: new Date(),
      });
      
      toast.success("পোস্ট সফলভাবে জমা হয়েছে!");

      // ফর্ম রিসেট করা
      setFormData({
        sellerType: "",
        condition: "নতুন",
        name: "",
        description: "",
        price: "",
        duration: "১ সপ্তাহ",
        paymentMethod: ""
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("পোস্ট করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-sm border max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700">পণ্য বিক্রয় করুন</h2>

      {/* আপনি কে */}
      <div className="mb-4">
        <label className="block font-bold mb-2">আপনি কে? *</label>
        <div className="grid grid-cols-5 gap-2">
          {["দোকান", "অনলাইন", "ব্যক্তিগত", "কৃষক", "Student"].map((type) => (
            <button type="button" key={type} onClick={() => setFormData({...formData, sellerType: type})} 
            className={`p-2 border rounded text-xs ${formData.sellerType === type ? 'bg-green-50 border-green-500' : ''}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* পণ্যের অবস্থা */}
      <div className="mb-4">
        <label className="block font-bold mb-2">পণ্যের অবস্থা *</label>
        <div className="flex gap-2">
          {["নতুন", "ব্যবহৃত", "ভাড়া"].map((cond) => (
            <button type="button" key={cond} onClick={() => setFormData({...formData, condition: cond})} 
            className={`p-2 border rounded w-full ${formData.condition === cond ? 'bg-green-50 border-green-500' : ''}`}>
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* অন্যান্য ফিল্ডস */}
      <input className="w-full p-2 border mb-4 rounded" placeholder="পণ্যের নাম *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <textarea className="w-full p-2 border mb-4 rounded h-24" placeholder="বিবরণ" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
      <input className="w-full p-2 border mb-4 rounded" type="number" placeholder="মূল্য (৳) *" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />

      {/* বিজ্ঞাপনের মেয়াদ */}
      <div className="mb-4">
        <label className="block font-bold mb-2">বিজ্ঞাপনের মেয়াদ</label>
        <div className="grid grid-cols-4 gap-2">
          {["১ সপ্তাহ", "২ সপ্তাহ", "১ মাস", "৩ মাস"].map((dur) => (
            <button type="button" key={dur} onClick={() => setFormData({...formData, duration: dur})}
            className={`p-2 border rounded text-xs ${formData.duration === dur ? 'bg-green-50 border-green-500' : ''}`}>
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* পেমেন্ট পদ্ধতি */}
      <div className="mb-4">
        <label className="block font-bold mb-2">পেমেন্ট পদ্ধতি *</label>
        {["bKash", "Nagad", "ব্যাংক ট্রান্সফার"].map((method) => (
          <label key={method} className="flex items-center p-3 border rounded mb-2 cursor-pointer">
            <input type="radio" name="payment" checked={formData.paymentMethod === method} onChange={() => setFormData({...formData, paymentMethod: method})} className="mr-2" />
            {method}
          </label>
        ))}
      </div>

      <button type="submit" className="w-full bg-green-700 text-white py-3 rounded font-bold hover:bg-green-800 transition">
        পণ্য পোস্ট জমা দিন →
      </button>
    </form>
  );
};

export default PostForm;