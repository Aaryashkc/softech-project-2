import type React from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
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
import Vlog from "./pages/Vlog"
import { Toaster } from "react-hot-toast"
import AdminDashboard from "./admin/pages/Dashboard"
import EventManagement from "./admin/pages/EventManagement"
import GalleryManagement from "./admin/pages/GalleryManagement"
import InterviewManagement from "./admin/pages/InterviewManagement"
import NewsManagement from "./admin/pages/NewsManagement"
import AdminLogin from "./admin/auth/AdminLogin"
import { useAuthStore } from "./stores/useAuthStore"
import { useEffect } from "react"
import { LoaderCircle } from "lucide-react"
import AddEventPage from "./admin/components/AddEventPage"
import AddGalleryPage from "./admin/components/AddGalleryPage"
import AddInterviewPage from "./admin/components/AddInterviewPage"
import AddNewsPage from "./admin/components/AddNewsPage"
import EditGalleryPage from "./admin/pages/EditGalleryPage"
import PopupModal from "./components/PopupModel"
import Sahitya from "./pages/Sahitya"

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const {
    authUser,
    checkAuth,
    isCheckingAuth
  } = useAuthStore();
  
  const protectedRoutes = [
    "/admin",
    "/admin/login",
    "/eventmanagement",
    "/gallerymanagement",
    "/interviewmanagement",
    "/newsmanagement",
    "/admin/add-event",
    "/admin/add-gallery",
    "/admin/add-interview",
    "/admin/add-news",
    "/admin/gallery/edit"
  ];

  // Helper to check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    if (isProtectedRoute) {
      checkAuth();
    }
  }, [checkAuth, isProtectedRoute]);

  if (isProtectedRoute && isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='size-20 animate-spin text-red-700' />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        {!isAdminRoute && <PopupModal />}
        
        <Routes>
          {/* public routes */}
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/events" element={<EventsPage/>} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/vlogs" element={<Vlog />} />
          <Route path="/sahitya" element={<Sahitya />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/achievements" element={<Achievement/>} />
          <Route path="/contact" element={<Contact />} />

          {/* admin routes */}
          <Route path="/admin" element={authUser? <AdminDashboard /> :<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={!authUser?<AdminLogin />:<Navigate to="/admin" />}/>
          <Route path="/eventmanagement" element={authUser?<EventManagement />:<Navigate to="/admin/login" />}/>
          <Route path="/gallerymanagement" element={authUser?<GalleryManagement />:<Navigate to="/admin/login" />}/>
          <Route path="/interviewmanagement" element={authUser?<InterviewManagement />:<Navigate to="/admin/login" />}/>
          <Route path="/newsmanagement" element={authUser?<NewsManagement />:<Navigate to="/admin/login" />}/>
          {/* pages  */}
          <Route path="/admin/add-event" element={authUser?<AddEventPage />:<Navigate to="/admin/login" />}/>
          <Route path="/admin/add-gallery" element={authUser?<AddGalleryPage />:<Navigate to="/admin/login" />}/>
          <Route path="/admin/add-interview" element={authUser?<AddInterviewPage />:<Navigate to="/admin/login" />}/>
          <Route path="/admin/add-news" element={authUser?<AddNewsPage />:<Navigate to="/admin/login" />}/>
          <Route path="/admin/gallery/edit/:id" element={authUser?<EditGalleryPage />:<Navigate to="/admin/login" />}/>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster/>
    </div>
  )
}

export default App
