import { homeData } from "../data/homeData";

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
  // Later this can become:
  // const [homeData, setHomeData] = useState(null);
  // useEffect(() => { fetch("/api/home").then(r => r.json()).then(setHomeData); }, []);
  // The components below will keep working unchanged either way.

  if (!homeData) return <div>Loading...</div>;

  return (
    <main className="space-y-10">
      
      {/* Hero Banner */}
      <HeroSection hero={homeData.hero} />

      {/* Nearby Restaurants */}
      <NearbyRestaurants 
        restaurants={homeData.nearbyRestaurants || []} 
      />

      {/* Food Categories */}
      <FoodCategories
        categories={homeData.foodCategories || []}
        filters={homeData.categoryFilters || []}
      />

      {/* Popular Restaurants */}
      <PopularRestaurants
        restaurants={homeData.popularRestaurants || []}
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

      {/* Tips */}
      <FoodTips tips={homeData.tips || []} />
    </main>
  );
};

export default Home;