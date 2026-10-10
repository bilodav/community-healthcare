import { Routes, Route } from "react-router";
import "./App.css";
import Header from "./components/common/Header";
import Landing from "./pages/Landing";
import Footer from "./components/common/Footer";
import NotFound from "./pages/NotFound";
import Listing from "./pages/Listing";
import Booking from "./pages/Booking";

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
