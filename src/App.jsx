import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/home/Home';
import ProductList from './components/product/ProductList';
import ProductDetail from './components/product/ProductDetail';
import Cart from './components/cart/Cart';
import Checkout from './components/cart/Checkout';
import Success from './components/cart/Success';
import SocialFloatingButtons from './components/common/SocialFloatingButtons';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ProductForm from './components/admin/ProductForm';
import Orders from './components/admin/Orders';
import Settings from './components/admin/Settings';
import CategorySetup from './components/admin/CategorySetup';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/producto/nuevo" element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/producto/:id" element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/setup-categories" element={
          <ProtectedRoute>
            <AdminLayout>
              <CategorySetup />
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <SocialFloatingButtons />}
    </div>
  );
}

export default App;
