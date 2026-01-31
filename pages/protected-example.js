import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Profile - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile - ROBOHATCH</title>
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-6 py-8 sm:px-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-sm font-medium text-gray-500">Name</h2>
                  <p className="mt-1 text-lg text-gray-900">{user.name || 'N/A'}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-sm font-medium text-gray-500">Email</h2>
                  <p className="mt-1 text-lg text-gray-900">{user.email || 'N/A'}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-sm font-medium text-gray-500">Phone</h2>
                  <p className="mt-1 text-lg text-gray-900">{user.phone || 'N/A'}</p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-sm font-medium text-gray-500">Account ID</h2>
                  <p className="mt-1 text-sm text-gray-600 font-mono">{user.id || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
