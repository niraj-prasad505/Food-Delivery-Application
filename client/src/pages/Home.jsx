import { homeData } from "../data/homeData";

// Centralized Data Sources
import { shopsData } from "../data/shopsData";
import { foodsData } from "../data/foodsData";

import HeroSection from "../components/home/HeroSection";
import NearbyRestaurants from "../components/home/NearbyRestaurants";
import FoodCategories from "../components/home/FoodCategories";
import PopularRestaurants from "../components/home/PopularRestaurants";
import AdvertisementSlider from "../components/home/AdvertisementSlider";
import OffersSection from "../components/home/OffersSection";
import OrderingSteps from "../components/home/OrderingSteps";
import ServiceBanner from "../components/home/ServiceBanner";
import FoodTips from "../components/home/FoodTips";

const Home = () => {

  if (!homeData) return <div>Loading...</div>;

  // Use shopsData for restaurants list; fallback to homeData if needed
  const displayShops = shopsData.length > 0 ? shopsData : (homeData.nearbyRestaurants || []);

  return (
    <main className="space-y-10">
      
      {/* Hero Banner */}
      <HeroSection hero={homeData.hero} />

      {/* Nearby Restaurants */}
      <NearbyRestaurants 
        restaurants={displayShops} 
      />

      {/* Food Categories */}
      <FoodCategories
        categories={homeData.foodCategories || []}
        filters={homeData.categoryFilters || []}
      />

      {/* Popular Restaurants */}
      <PopularRestaurants
        restaurants={displayShops}
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