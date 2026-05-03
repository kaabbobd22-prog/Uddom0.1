import { Outlet } from 'react-router-dom';
import Header from '../components/Header';


export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Outlet এর জায়গায় রাউটার অনুযায়ী ভেতরের পেজগুলো রেন্ডার হবে */}
        <Outlet />
      </main>
    </div>
  );
}