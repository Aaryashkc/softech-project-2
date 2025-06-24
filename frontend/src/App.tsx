import { Route, Routes, useLocation } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import Achievement from "./pages/Achievement"
import Journey from "./pages/Journey"
import Contact from "./pages/Contact"
import EventsPage from "./pages/EventPage"
import NewsPage from "./pages/NewsPage"
import Gallery from "./pages/Gallery"
import { Toaster } from "react-hot-toast"
import AdminDashboard from "./admin/pages/Dashboard"

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/events" element={<EventsPage/>} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/achievements" element={<Achievement/>} />
          <Route path="/contact" element={<Contact />} />

          {/* admin routes */}
          <Route path="/admin" element={<AdminDashboard />}/>

        </Routes>
      </main>
      <Footer />
      <Toaster/>
    </div>
  )
}

export default App
