// src/data/homeData.js
//
// Centralized dummy data for the FoodEx homepage.
// Later this entire object can be replaced with data fetched from
// `GET /api/home`, without changing any component code — every
// component below only consumes data through props.

export const homeData = {
  hero: {
    title: "Hungry? Let's Deliver Happiness to Your",
    highlight: "Doorstep!",
    description:
      "Explore a world of flavors from the best restaurants in your city. Whether you're craving something new or your favorite comfort food, we've got you covered with quick and easy delivery.",
    suggestedSearches: ["Pizza", "Burger", "Biryani", "Chicken"],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  },

  nearbyRestaurants: [
    {
      id: 1,
      name: "Domino's Pizza",
      image:
        "https://images.unsplash.com/photo-1571066811602-716837d681de?w=200&q=80",
      category: "Pizza",
      deliveryTime: "20-30 min",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Arby's",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80",
      category: "Fast Food",
      deliveryTime: "15-25 min",
      rating: 4.3,
    },
    {
      id: 3,
      name: "Bone's Kitchen",
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80",
      category: "BBQ",
      deliveryTime: "25-35 min",
      rating: 4.6,
    },
    {
      id: 4,
      name: "Burger King",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
      category: "Burgers",
      deliveryTime: "18-28 min",
      rating: 4.4,
    },
    {
      id: 5,
      name: "Krispy Kreme",
      image:
        "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=200&q=80",
      category: "Desserts",
      deliveryTime: "10-20 min",
      rating: 4.7,
    },
  ],

  foodCategories: [
    {
      id: 1,
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=400&q=80",
      restaurantCount: 12,
    },
    {
      id: 2,
      name: "Broast",
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
      restaurantCount: 13,
    },
    {
      id: 3,
      name: "Chicken",
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
      restaurantCount: 14,
    },
    {
      id: 4,
      name: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      restaurantCount: 15,
    },
    {
      id: 5,
      name: "Desserts",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
      restaurantCount: 9,
    },
    {
      id: 6,
      name: "Pasta",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
      restaurantCount: 8,
    },
  ],

  categoryFilters: ["All", "Healthy", "Italian", "Asian", "Mexican"],

  popularRestaurants: [
    {
      id: 1,
      name: "Verde Table",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      cuisine: "Healthy Bowls",
      rating: 4.8,
      deliveryTime: "25 min",
      priceRange: "$$",
      isFavorite: true,
    },
    {
      id: 2,
      name: "The Burger Yard",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
      cuisine: "Fast Food",
      rating: 4.6,
      deliveryTime: "20 min",
      priceRange: "$$",
      isFavorite: false,
    },
    {
      id: 3,
      name: "Sushi Zen",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
      cuisine: "Japanese",
      rating: 4.9,
      deliveryTime: "30 min",
      priceRange: "$$$",
      isFavorite: false,
    },
    {
      id: 4,
      name: "Sweet Tooth Cafe",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80",
      cuisine: "Desserts",
      rating: 4.7,
      deliveryTime: "22 min",
      priceRange: "$",
      isFavorite: false,
    },
    {
      id: 5,
      name: "Spice Route",
      image:
        "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80",
      cuisine: "Indian",
      rating: 4.5,
      deliveryTime: "28 min",
      priceRange: "$$",
      isFavorite: false,
    },
    {
      id: 6,
      name: "Trattoria Bella",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
      cuisine: "Italian",
      rating: 4.6,
      deliveryTime: "26 min",
      priceRange: "$$",
      isFavorite: false,
    },
  ],

  popularRestaurantFilters: [
    "All",
    "Fast Food",
    "Vegetarian",
    "Family Dining",
    "Dessert Shops",
  ],

  advertisements: [
    {
      id: 1,
      title: "Special Offers from Your Favorite Restaurants!",
      description:
        "Discover limited-time deals and unbeatable prices. These deals are too good to miss out on.",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
      buttonText: "See More Deals",
      buttonLink: "/offers",
    },
    {
      id: 2,
      title: "Get 50% Off Your First Order",
      description:
        "New to FoodEx? Sign up today and enjoy half price on your very first order from any partner restaurant.",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
      buttonText: "Order Now",
      buttonLink: "/foods",
    },
    {
      id: 3,
      title: "Free Delivery on Weekends",
      description:
        "Skip the delivery fee every Saturday and Sunday on orders over $15. More reasons to treat yourself.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
      buttonText: "Explore Restaurants",
      buttonLink: "/restaurants",
    },
  ],

  offers: [
    {
      id: 1,
      title: "50% OFF",
      description: "On your first order",
      image:
        "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&q=80",
      restaurantName: "Domino's Pizza",
      code: "WELCOME50",
    },
    {
      id: 2,
      title: "Buy 1 Get 1",
      description: "On all desserts, this week only",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
      restaurantName: "Sweet Tooth Cafe",
      code: "SWEET2",
    },
    {
      id: 3,
      title: "20% OFF",
      description: "On orders above $25",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
      restaurantName: "Verde Table",
      code: "SAVE20",
    },
    {
      id: 4,
      title: "Free Delivery",
      description: "No delivery fee this weekend",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
      restaurantName: "Sushi Zen",
      code: "FREESHIP",
    },
  ],

  orderingSteps: [
    {
      id: 1,
      icon: "Utensils",
      title: "Choose Your Food",
      description:
        "Browse a wide selection of restaurants and pick the dishes you're craving right now.",
    },
    {
      id: 2,
      icon: "Wallet",
      title: "Cash on Delivery",
      description:
        "Enjoy the convenience of paying when delivery arrives, or pay online with ease.",
    },
    {
      id: 3,
      icon: "PackageCheck",
      title: "Receive Order",
      description:
        "Sit back, relax, and wait for your food to arrive at your doorstep. Track your order in real time and enjoy your meal!",
    },
  ],

  serviceFeatures: {
    heading: "Got You Covered 24/7!",
    description:
      "Day or night, get your favorite meals delivered right to your doorstep. Discover top restaurants and never miss a craving, anytime, anywhere.",
    buttonText: "Search Restaurants",
    image:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&q=80",
  },

  tips: [
    {
      id: 1,
      title: "Best Food Deals This Month",
      description:
        "The biggest discounts and offers you shouldn't miss out on this month.",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
      readTime: "4 min read",
    },
    {
      id: 2,
      title: "How to Customize Your Orders Like a Pro",
      description:
        "Make your meals just the way you like them with these simple customization tips.",
      image:
        "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=500&q=80",
      readTime: "5 min read",
    },
    {
      id: 3,
      title: "Top 10 Late-Night Eats for Food Lovers",
      description:
        "Craving a midnight snack? Here's the best late-night food you can order around the clock.",
      image:
        "https://images.unsplash.com/photo-1571066811602-716837d681de?w=500&q=80",
      readTime: "6 min read",
    },
  ],
};