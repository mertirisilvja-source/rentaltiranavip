import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar.jsx";
import Footer from "./Components/Layout/Footer.jsx";
import Scroll from "./Components/Scroll.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Terms from "./Pages/Terms.jsx";
import Privacy from "./Pages/Privacy.jsx";

import AvailableCarsPage from "./Pages/AvailableCarsPage.jsx";
import CarDetailsPage from "./Pages/CarDetailsPage.jsx";
import ReservationCheckoutPage from "./Pages/ReservationCheckoutPage.jsx";

import AdminLogin from "./Pages/AdminLogin.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Scroll />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* booking flow */}
          <Route path="/cars" element={<AvailableCarsPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/reservation" element={<ReservationCheckoutPage />} />

          {/* info pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
                <h1 className="text-6xl font-bold text-[#caa24a]">404</h1>
                <p className="mt-4 text-xl text-white/70">Page not found</p>
                <p className="mt-2 text-sm text-white/50">The page you're looking for doesn't exist.</p>
                <div className="mt-8 flex gap-4">
                  <a href="/" className="rounded-xl bg-[#caa24a] px-6 py-3 font-semibold text-black hover:brightness-110">
                    Go Home
                  </a>
                  <a href="/cars" className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">
                    View Cars
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;