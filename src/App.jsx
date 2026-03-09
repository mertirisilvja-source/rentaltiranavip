import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Footer from "./Components/Layout/Footer.jsx";
import Scroll from "./Components/Scroll.jsx";
import CarCollections from "./Components/CarCollections.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Scroll />
      {/* page content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarCollections />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
