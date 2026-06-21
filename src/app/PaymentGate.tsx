import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Send } from "lucide-react";

const PaymentGate = () => {
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return toast.error("ট্রানজেকশন আইডি প্রদান করুন");
    
    // এখানে পেমেন্ট ইনফো Firestore-এ সেভ হবে
    toast.success("পেমেন্ট সাবমিট হয়েছে, অ্যাডমিন ভেরিফিকেশনের অপেক্ষায়");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CreditCard /> পেমেন্ট ভেরিফিকেশন
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="ট্রানজেকশন আইডি লিখুন (Bkash/Nagad)" 
          className="w-full p-3 border rounded-lg"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2">
          <Send size={18}/> পেমেন্ট কনফার্ম করুন
        </button>
      </form>
    </div>
  );
};

export default PaymentGate;