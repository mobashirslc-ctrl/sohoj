import { useState } from "react";
import { Clock, CheckCircle, AlertCircle, Trash2, CreditCard } from "lucide-react";
import { toast } from "sonner";

const PostDashboard = () => {
  const [posts] = useState([
    { id: "1", title: "Web Dev Project", status: "pending", expiry: "2026-07-01" },
    { id: "2", title: "UI/UX Design", status: "active", expiry: "2026-08-15" }
  ]);

  const removePost = (id: string) => {
    toast.success("পোস্টটি সফলভাবে রিমুভ করা হয়েছে");
    // এখানে Firebase delete logic বসবে
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">আমার পোস্টসমূহ</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">মেয়াদ: {post.expiry}</p>
            </div>
            <div className="flex items-center gap-3">
              {post.status === "pending" && <span className="text-yellow-600 flex items-center gap-1"><AlertCircle size={16}/> পেন্ডিং</span>}
              {post.status === "active" && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> সক্রিয়</span>}
              <button onClick={() => removePost(post.id)} className="text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDashboard;