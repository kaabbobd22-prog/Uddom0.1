import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function SellerStore() {
  const { id } = useParams(); // URL থেকে সেলার আইডি নিবে
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await axios.get(`[https://uddom0-1.onrender.com](https://uddom0-1.onrender.com)/api/seller/${id}`);
        setSellerInfo(res.data.seller);
        setSellerProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Store load error:", err);
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [id]);

  if (loading) return <div>Loading Store...</div>;
  if (!sellerInfo) return <div>Store Not Found</div>;

  // এখন return-এর ভেতরে sellerInfo.storeName, sellerInfo.banner ইত্যাদি ব্যবহার করুন
}