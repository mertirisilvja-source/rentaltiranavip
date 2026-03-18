import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar.jsx";
import Footer from "./Components/Layout/Footer.jsx";
import Scroll from "./Components/Scroll.jsx";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";

import AvailableCarsPage from "./Pages/AvailableCarsPage.jsx";
import CarDetailsPage from "./Pages/CarDetailsPage.jsx";
import ReservationCheckoutPage from "./Pages/ReservationCheckoutPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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

          {/* simple 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-black pt-28 text-center text-white">
                <p className="text-white/70">Faqja nuk u gjet.</p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
