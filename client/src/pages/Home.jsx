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

  return (
    <main>
      
      <HeroSection hero={homeData.hero} />
      <NearbyRestaurants restaurants={homeData.nearbyRestaurants} />
      <FoodCategories
        categories={homeData.foodCategories}
        filters={homeData.categoryFilters}
      />
      <PopularRestaurants
        restaurants={homeData.popularRestaurants}
        filters={homeData.popularRestaurantFilters}
      />
      <AdvertisementSlider advertisements={homeData.advertisements} />
      <OffersSection offers={homeData.offers} />
      <OrderingSteps steps={homeData.orderingSteps} />
      <ServiceBanner service={homeData.serviceFeatures} />
      <FoodTips tips={homeData.tips} />
    </main>
  );
};

export default Home;