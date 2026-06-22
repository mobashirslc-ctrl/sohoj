import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
// আপনার তৈরি করা firebase.ts থেকে db ইমপোর্ট করুন
import { db } from "../services/firebase"; 
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "firebase/firestore";

const PostDashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);

  // Firestore থেকে রিয়েল-টাইম ডাটা আনা
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

  // পোস্ট রিমুভ করার ফাংশন
  const removePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("পোস্টটি সফলভাবে রিমুভ করা হয়েছে");
    } catch (error) {
      toast.error("রিমুভ করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">আমার পোস্টসমূহ</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              {/* Firestore-এ expiry থাকলে তা এখানে দেখাবে */}
              <p className="text-sm text-gray-500">মেয়াদ: {post.expiry || "N/A"}</p>
            </div>
            <div className="flex items-center gap-3">
              {post.status === "pending" && <span className="text-yellow-600 flex items-center gap-1"><AlertCircle size={16}/> পেন্ডিং</span>}
              {post.status === "active" && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> সক্রিয়</span>}
              <button onClick={() => removePost(post.id)} className="text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDashboard;