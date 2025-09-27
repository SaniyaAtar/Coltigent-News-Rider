import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeaderAd from "./components/HeaderAd";
import NewsHub from "./components/NewsHub";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import VideoNews from "./components/VideoNews";
import VideoDetail from "./components/VideoDetail";
import OldNewsDetail from "./components/OldNewsDetail";
import EducationDetail from "./components/EducationDetail";
import NewsDetail from "./components/NewsDetail";
import ScrollToTop from "./components/ScrollToTop";
import OldNewsPage from "./pages/OldNews";
import CategoryPage from "./pages/CategoryPage";
import National from "./pages/National";
import World from "./pages/World";
import Sports from "./pages/Sports";
import Business from "./pages/Business";
import Education from "./pages/Education";
import TrendingAPI from "./pages/TrendingAPI";
import Trending from "./pages/Trending";
import TrendingDetail from "./components/TrendingDetail";
import TrendingNewsDetail from "./components/TrendingNewsDetail";
import BreakingNewsDetail from "./components/BreakingNewsDetail";
import CategoryNewsDetail from "./components/CategoryNewsDetail";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PublicCommunityReportDetail from "./components/PublicCommunityReportDetail";

const App: React.FC = () => {
  console.log('App component rendering - starting render');
  
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <HeaderAd />
      <NewsHub />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Category Routes */}
        <Route path="/national" element={<National />} />
        <Route path="/world" element={<World />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/business" element={<Business />} />
        <Route path="/education" element={<Education />} />
        <Route path="/local" element={<CategoryPage />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/public" element={<CategoryPage />} />
        <Route path="/health" element={<CategoryPage />} />
        <Route path="/technology" element={<CategoryPage />} />
        <Route path="/tech" element={<CategoryPage />} />
        <Route path="/entertainment" element={<CategoryPage />} />
        <Route path="/politics" element={<CategoryPage />} />
        <Route path="/science" element={<CategoryPage />} />
        <Route path="/environment" element={<CategoryPage />} />
        {/* API Routes */}
        <Route path="/trending-api" element={<TrendingAPI />} />
        {/* Other Routes */}
        <Route path="/videos" element={<VideoNews />} />
        <Route path="/old-news" element={<OldNewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/old-news/:id" element={<OldNewsDetail />} />
        <Route path="/education/:id" element={<EducationDetail/>} />
        <Route path="/trending/:id" element={<TrendingDetail />} />
        <Route path="/trending/detail/:id" element={<TrendingNewsDetail />} />
        <Route path="/breaking-news/:id" element={<BreakingNewsDetail />} />
        <Route path="/category-news/:id" element={<CategoryNewsDetail />} />
        <Route path="/public-report/:id" element={<PublicCommunityReportDetail />} />
        {/* Support Routes */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
