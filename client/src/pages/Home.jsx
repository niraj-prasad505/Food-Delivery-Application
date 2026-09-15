// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { homeData } from "../data/homeData";

// Fallback Data Sources
import { shopsData } from "../data/shopsData";

import HeroSection from "../components/home/HeroSection";
import NearbyRestaurants from "../components/home/NearbyRestaurants";
import FoodCategories from "../components/home/FoodCategories";
import PopularRestaurants from "../components/home/PopularRestaurants";
import AdvertisementSlider from "../components/home/AdvertisementSlider";
import OffersSection from "../components/home/OffersSection";
import OrderingSteps from "../components/home/OrderingSteps";
import ServiceBanner from "../components/home/ServiceBanner";

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live shops directly from MongoDB backend API
    fetch("http://localhost:5000/api/shops")
      .then((res) => res.json())
      .then((data) => {
        const shopList = Array.isArray(data) ? data : data.shops || data.data || [];
        if (shopList.length > 0) {
          setShops(shopList);
        } else {
          setShops(shopsData);
        }
      })
      .catch((err) => {
        console.warn("Backend API unavailable, falling back to local dataset:", err);
        setShops(shopsData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!homeData || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading SnackDrop...
      </div>
    );
  }

  return (
    <main className="space-y-10">
      
      {/* Hero Banner with active search redirection */}
      <HeroSection hero={homeData.hero} />

      {/* Nearby Restaurants (MongoDB dynamic data) */}
      <NearbyRestaurants 
        restaurants={shops} 
      />

      {/* Food Categories */}
      <FoodCategories
        categories={homeData.foodCategories || []}
        filters={homeData.categoryFilters || []}
      />

      {/* Popular Restaurants (MongoDB dynamic data) */}
      <PopularRestaurants
        restaurants={shops}
        filters={homeData.popularRestaurantFilters || []}
      />

      {/* Ads */}
      <AdvertisementSlider 
        advertisements={homeData.advertisements || []} 
      />

      {/* Offers */}
      <OffersSection offers={homeData.offers || []} />

      {/* How it works */}
      <OrderingSteps steps={homeData.orderingSteps || []} />

      {/* Service features */}
      <ServiceBanner service={homeData.serviceFeatures} />

    </main>
  );
};

export default Home;