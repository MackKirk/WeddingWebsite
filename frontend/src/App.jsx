import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import StoryPage from './pages/StoryPage'
import InfoPage from './pages/InfoPage'
import TimelinePage from './pages/TimelinePage'
import GalleryPage from './pages/GalleryPage'
import GiftsPage from './pages/GiftsPage'
import RSVPPage from './pages/RSVPPage'
import AdminLogin from './admin/LoginPage'
import AdminDashboard from './admin/Dashboard'
import ProtectedRoute from './admin/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/gifts" element={<GiftsPage />} />
                <Route path="/rsvp" element={<RSVPPage />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

