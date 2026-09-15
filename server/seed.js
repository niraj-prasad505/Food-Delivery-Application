const mongoose = require("mongoose");
// Adjust paths to your models if they are inside src/models/
const Shop = require("./src/models/Shop-model");
const Product = require("./src/models/Product-model");

// Inside seed.js
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food_delivery";

// 16 Restaurants Data
const shopsData = [
  { _id: "mock-1", name: "Domino's Pizza", rating: 4.5, reviewsCount: "1200+", deliveryTime: "20–40 mins", tags: ["Pizza", "Fast Food"], freeDelivery: true, minOrder: 199, city: "Amborkhana, Sylhet", address: "Central Road, Amborkhana, Sylhet", isOpen: true, description: "Delicious pizzas, sides and more.", banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80", icon: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" },
  { _id: "mock-2", name: "KFC", rating: 4.3, reviewsCount: "950+", deliveryTime: "25–35 mins", tags: ["Chicken", "Fast Food"], freeDelivery: true, minOrder: 199, city: "Amborkhana, Sylhet", address: "Zindabazar, Sylhet", isOpen: true, description: "Crispy fried chicken, buckets, burgers, and sides.", banner: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=1200&q=80", icon: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500&q=80" },
  { _id: "mock-3", name: "Behrouz Biryani", rating: 4.4, reviewsCount: "800+", deliveryTime: "30–45 mins", tags: ["Biryani", "Mughlai"], freeDelivery: true, minOrder: 299, city: "Amborkhana, Sylhet", address: "Nayasarak, Sylhet", isOpen: true, description: "Royal Mughlai biryanis cooked with aromatic spices.", banner: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80", icon: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" },
  { _id: "mock-4", name: "Subway Healthy Bowls", rating: 4.6, reviewsCount: "500+", deliveryTime: "20–30 mins", tags: ["Healthy", "Salads", "Sandwiches"], freeDelivery: true, minOrder: 249, city: "Amborkhana, Sylhet", address: "Mirabazar, Sylhet", isOpen: true, description: "Fresh custom sub sandwiches, salad bowls, and wraps.", banner: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80", icon: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
  { _id: "mock-5", name: "The Boba & Beverage Bar", rating: 4.7, reviewsCount: "410+", deliveryTime: "15–25 mins", tags: ["Beverages", "Smoothies", "Boba Tea"], freeDelivery: false, minOrder: 149, city: "Amborkhana, Sylhet", address: "Shibganj, Sylhet", isOpen: true, description: "Refreshing boba teas, fruit smoothies, and iced coffees.", banner: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&q=80", icon: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80" },
  { _id: "mock-6", name: "Wow! Momo", rating: 4.2, reviewsCount: "600+", deliveryTime: "20–30 mins", tags: ["Momos", "Chinese"], freeDelivery: true, minOrder: 199, city: "Amborkhana, Sylhet", address: "Chowhatta, Sylhet", isOpen: true, description: "Steamed, fried, and pan-fried momos with spicy chutney.", banner: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=1200&q=80", icon: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80" },
  { _id: "mock-7", name: "Burger King", rating: 4.4, reviewsCount: "1100+", deliveryTime: "20–30 mins", tags: ["Burger", "Fast Food"], freeDelivery: true, minOrder: 179, city: "Amborkhana, Sylhet", address: "City Centre, Amborkhana, Sylhet", isOpen: true, description: "Flame-grilled burgers, crispy fries, and cold beverages.", banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80", icon: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { _id: "mock-8", name: "Royal Indian Cuisine", rating: 4.6, reviewsCount: "750+", deliveryTime: "35–50 mins", tags: ["Indian", "Thali", "Curry"], freeDelivery: true, minOrder: 299, city: "Amborkhana, Sylhet", address: "Main Road, Amborkhana, Sylhet", isOpen: true, description: "Authentic Indian thalis, rich curries, and freshly baked naans.", banner: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80", icon: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
  { _id: "mock-9", name: "The Sugar Rush Sweets", rating: 4.8, reviewsCount: "320+", deliveryTime: "15–25 mins", tags: ["Desserts", "Cakes", "Ice Cream"], freeDelivery: false, minOrder: 129, city: "Amborkhana, Sylhet", address: "East Gate, Amborkhana, Sylhet", isOpen: true, description: "Decadent cakes, pastries, ice creams, and sweet delights.", banner: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80", icon: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80" },
  { _id: "mock-10", name: "Pizza Hut", rating: 4.4, reviewsCount: "1050+", deliveryTime: "25–35 mins", tags: ["Pizza", "Fast Food"], freeDelivery: true, minOrder: 229, city: "Zindabazar", address: "Zindabazar Circle, Sylhet", isOpen: true, description: "Pan pizzas, stuffed crusts, and cheesy garlic bread treats.", banner: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&q=80", icon: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&q=80" },
  { _id: "mock-11", name: "Wok & Roll Noodle House", rating: 4.5, reviewsCount: "480+", deliveryTime: "20–35 mins", tags: ["Chinese", "Asian", "Noodles"], freeDelivery: true, minOrder: 199, city: "Chowhatta", address: "Station Road, Chowhatta, Sylhet", isOpen: true, description: "Sizzling Hakka noodles, Manchurian bowls, and dim sums.", banner: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=80", icon: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80" },
  { _id: "mock-12", name: "Tandoori Nights", rating: 4.7, reviewsCount: "670+", deliveryTime: "30–45 mins", tags: ["Indian", "Kebabs", "Chicken"], freeDelivery: false, minOrder: 250, city: "Nayasarak", address: "College Road, Nayasarak, Sylhet", isOpen: true, description: "Smoky tandoori chicken, seekh kebabs, and rumali roti.", banner: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&q=80", icon: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80" },
  { _id: "mock-13", name: "Green Garden Salads & Juice", rating: 4.6, reviewsCount: "290+", deliveryTime: "15–25 mins", tags: ["Healthy", "Beverages", "Salads"], freeDelivery: true, minOrder: 149, city: "Mirabazar", address: "Eco Park Road, Mirabazar, Sylhet", isOpen: true, description: "Cold-pressed juices, quinoa salad bowls, and organic detox drinks.", banner: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80", icon: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80" },
  { _id: "mock-14", name: "Bawarchi Biryani Hub", rating: 4.3, reviewsCount: "920+", deliveryTime: "25–40 mins", tags: ["Biryani", "Indian"], freeDelivery: true, minOrder: 219, city: "Amborkhana, Sylhet", address: "West Point, Amborkhana, Sylhet", isOpen: true, description: "Authentic Hyderabadi & Kacchi biryani cooked in earthenware pots.", banner: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80", icon: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80" },
  { _id: "mock-15", name: "Choco Craze Bakery", rating: 4.9, reviewsCount: "530+", deliveryTime: "20–30 mins", tags: ["Desserts", "Cakes"], freeDelivery: false, minOrder: 199, city: "Shibganj", address: "Baker Street, Shibganj, Sylhet", isOpen: true, description: "Rich chocolate lava cakes, handcrafted brownies, and custom donuts.", banner: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80", icon: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" },
  { _id: "mock-16", name: "The Crunch Club Burger Studio", rating: 4.5, reviewsCount: "440+", deliveryTime: "20–30 mins", tags: ["Burger", "Fast Food"], freeDelivery: true, minOrder: 189, city: "Amborkhana, Sylhet", address: "Food Street, Amborkhana, Sylhet", isOpen: true, description: "Smash burgers, loaded cheese fries, and thick artisanal shakes.", banner: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200&q=80", icon: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&q=80" }
];

// 64 Foods Data
const foodsData = [
  { shopId: "mock-1", name: "Margherita Pizza", category: "pizza", cuisine: "Italian", restaurant: "Domino's Pizza", rating: 4.8, price: 199, originalPrice: 249, discount: "20% OFF", description: "Classic delight with 100% real mozzarella cheese.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80" },
  { shopId: "mock-1", name: "Farmhouse Pizza", category: "pizza", cuisine: "Italian", restaurant: "Domino's Pizza", rating: 4.6, price: 249, originalPrice: 299, discount: "16% OFF", description: "Loaded with crunchy veggies and mozzarella cheese.", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80" },
  { shopId: "mock-1", name: "Peppy Paneer Pizza", category: "pizza", cuisine: "Italian", restaurant: "Domino's Pizza", rating: 4.4, price: 249, originalPrice: 299, discount: "16% OFF", description: "Paneer cubes, capsicum, and spicy red paprika.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80" },
  { shopId: "mock-1", name: "Garlic Breadsticks", category: "pizza", cuisine: "Italian", restaurant: "Domino's Pizza", rating: 4.7, price: 99, originalPrice: 129, discount: "23% OFF", description: "Baked golden brown, seasoned with garlic butter.", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=80" },

  { shopId: "mock-2", name: "Crispy Fried Chicken (4 pcs)", category: "chicken", cuisine: "American", restaurant: "KFC", rating: 4.5, price: 299, originalPrice: 349, discount: "14% OFF", description: "Golden fried chicken coated in secret herbs & spices.", image: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80" },
  { shopId: "mock-2", name: "Zinger Crunch Burger", category: "burger", cuisine: "American", restaurant: "KFC", rating: 4.6, price: 189, originalPrice: 229, discount: "17% OFF", description: "Crispy chicken fillet with spicy mayo and lettuce.", image: "https://images.unsplash.com/photo-1615297928064-24977384d0da?w=800&q=80" },
  { shopId: "mock-2", name: "Hot Wings Bucket (8 pcs)", category: "chicken", cuisine: "American", restaurant: "KFC", rating: 4.7, price: 279, originalPrice: 329, discount: "15% OFF", description: "Spicy & crunchy chicken wings served piping hot.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80" },
  { shopId: "mock-2", name: "Chocolate Lava Cake", category: "dessert", cuisine: "American", restaurant: "KFC", rating: 4.8, price: 99, originalPrice: 119, discount: "16% OFF", description: "Warm chocolate cake filled with molten fudge.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80" },

  { shopId: "mock-3", name: "Royal Chicken Biryani", category: "biryani", cuisine: "Mughlai", restaurant: "Behrouz Biryani", rating: 4.7, price: 320, originalPrice: 380, discount: "15% OFF", description: "Slow-cooked basmati rice layered with succulent chicken.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" },
  { shopId: "mock-3", name: "Subz-E-Biryani (Veg)", category: "biryani", cuisine: "Mughlai", restaurant: "Behrouz Biryani", rating: 4.5, price: 269, originalPrice: 319, discount: "15% OFF", description: "Fragrant rice layered with fresh garden vegetables.", image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&q=80" },
  { shopId: "mock-3", name: "Murg Seekh Kebab", category: "chicken", cuisine: "Mughlai", restaurant: "Behrouz Biryani", rating: 4.6, price: 249, originalPrice: 289, discount: "13% OFF", description: "Minced chicken skewers seasoned with royal herbs.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80" },
  { shopId: "mock-3", name: "Gulab Jamun (2 pcs)", category: "dessert", cuisine: "Mughlai", restaurant: "Behrouz Biryani", rating: 4.9, price: 79, originalPrice: 99, discount: "20% OFF", description: "Soft milk dumplings soaked in cardamom sugar syrup.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80" },

  { shopId: "mock-4", name: "Roasted Chicken Sub", category: "healthy", cuisine: "American", restaurant: "Subway Healthy Bowls", rating: 4.6, price: 249, originalPrice: 289, discount: "13% OFF", description: "Oven roasted chicken breast with choice of veggies.", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80" },
  { shopId: "mock-4", name: "Paneer Tikka Salad Bowl", category: "healthy", cuisine: "American", restaurant: "Subway Healthy Bowls", rating: 4.7, price: 229, originalPrice: 269, discount: "14% OFF", description: "Grilled paneer tikka over fresh salad greens.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80" },
  { shopId: "mock-4", name: "Veggie Delight Sub", category: "healthy", cuisine: "American", restaurant: "Subway Healthy Bowls", rating: 4.4, price: 179, originalPrice: 209, discount: "14% OFF", description: "Crispy lettuce, tomatoes, cucumbers, and peppers.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80" },
  { shopId: "mock-4", name: "Oatmeal Raisin Cookie", category: "dessert", cuisine: "American", restaurant: "Subway Healthy Bowls", rating: 4.8, price: 69, originalPrice: 89, discount: "22% OFF", description: "Freshly baked chewy oat and raisin cookie.", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80" },

  { shopId: "mock-5", name: "Classic Brown Sugar Boba", category: "beverages", cuisine: "Asian", restaurant: "The Boba & Beverage Bar", rating: 4.8, price: 189, originalPrice: 229, discount: "17% OFF", description: "Fresh tapioca pearls in caramelized brown sugar milk.", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80" },
  { shopId: "mock-5", name: "Mango Passionfruit Smoothie", category: "beverages", cuisine: "Asian", restaurant: "The Boba & Beverage Bar", rating: 4.6, price: 169, originalPrice: 199, discount: "15% OFF", description: "Blended tropical fruit smoothie with chia seeds.", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80" },
  { shopId: "mock-5", name: "Iced Vietnamese Coffee", category: "beverages", cuisine: "Asian", restaurant: "The Boba & Beverage Bar", rating: 4.7, price: 149, originalPrice: 179, discount: "16% OFF", description: "Strong dark roast coffee with condensed milk.", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80" },
  { shopId: "mock-5", name: "Taro Milk Tea with Jelly", category: "beverages", cuisine: "Asian", restaurant: "The Boba & Beverage Bar", rating: 4.5, price: 179, originalPrice: 209, discount: "14% OFF", description: "Creamy purple taro tea with herbal grass jelly.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80" },

  { shopId: "mock-6", name: "Steamed Chicken Momos (8 pcs)", category: "chinese", cuisine: "Chinese", restaurant: "Wow! Momo", rating: 4.6, price: 169, originalPrice: 199, discount: "15% OFF", description: "Classic steamed dumplings filled with juicy chicken.", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80" },
  { shopId: "mock-6", name: "Pan-Fried Schezwan Momos", category: "chinese", cuisine: "Chinese", restaurant: "Wow! Momo", rating: 4.5, price: 189, originalPrice: 229, discount: "17% OFF", description: "Crispy fried momos tossed in spicy Schezwan sauce.", image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80" },
  { shopId: "mock-6", name: "Darjeeling Veg Momos (8 pcs)", category: "chinese", cuisine: "Chinese", restaurant: "Wow! Momo", rating: 4.4, price: 139, originalPrice: 169, discount: "17% OFF", description: "Light steamed dumplings with cabbage and paneer.", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80" },
  { shopId: "mock-6", name: "Chocolate Momo Delight", category: "dessert", cuisine: "Chinese", restaurant: "Wow! Momo", rating: 4.7, price: 119, originalPrice: 149, discount: "20% OFF", description: "Deep-fried sweet dumpling stuffed with molten chocolate.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80" },

  { shopId: "mock-7", name: "Classic Whopper Burger", category: "burger", cuisine: "American", restaurant: "Burger King", rating: 4.6, price: 179, originalPrice: 219, discount: "18% OFF", description: "Flame-grilled patty with juicy tomatoes and fresh lettuce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" },
  { shopId: "mock-7", name: "Crispy French Fries", category: "burger", cuisine: "American", restaurant: "Burger King", rating: 4.5, price: 89, originalPrice: 109, discount: "18% OFF", description: "Golden salted potato fries cooked crisp.", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&q=80" },
  { shopId: "mock-7", name: "Fiery Chicken Wrap", category: "chicken", cuisine: "American", restaurant: "Burger King", rating: 4.4, price: 159, originalPrice: 189, discount: "15% OFF", description: "Spicy crispy chicken strips wrapped in tortilla.", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80" },
  { shopId: "mock-7", name: "Chocolate Thickshake", category: "beverages", cuisine: "American", restaurant: "Burger King", rating: 4.7, price: 129, originalPrice: 149, discount: "13% OFF", description: "Creamy chocolate ice cream blended into a shake.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80" },

  { shopId: "mock-8", name: "Special Butter Chicken", category: "indian", cuisine: "Indian", restaurant: "Royal Indian Cuisine", rating: 4.8, price: 349, originalPrice: 399, discount: "12% OFF", description: "Tender chicken cooked in rich tomato butter gravy.", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80" },
  { shopId: "mock-8", name: "Paneer Butter Masala", category: "indian", cuisine: "Indian", restaurant: "Royal Indian Cuisine", rating: 4.7, price: 289, originalPrice: 329, discount: "12% OFF", description: "Cottage cheese cubes in aromatic cashew gravy.", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80" },
  { shopId: "mock-8", name: "Garlic Butter Naan", category: "indian", cuisine: "Indian", restaurant: "Royal Indian Cuisine", rating: 4.9, price: 59, originalPrice: 75, discount: "21% OFF", description: "Tandoor-baked flatbread brushed with garlic butter.", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80" },
  { shopId: "mock-8", name: "Sweet Mango Lassi", category: "beverages", cuisine: "Indian", restaurant: "Royal Indian Cuisine", rating: 4.8, price: 99, originalPrice: 119, discount: "16% OFF", description: "Thick chilled yogurt drink blended with mango pulp.", image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80" },

  { shopId: "mock-9", name: "Belgian Chocolate Truffle Cake", category: "dessert", cuisine: "Desserts", restaurant: "The Sugar Rush Sweets", rating: 4.9, price: 499, originalPrice: 599, discount: "16% OFF", description: "Rich layered dark chocolate sponge with ganache.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80" },
  { shopId: "mock-9", name: "Red Velvet Pastry Slice", category: "dessert", cuisine: "Desserts", restaurant: "The Sugar Rush Sweets", rating: 4.7, price: 139, originalPrice: 169, discount: "17% OFF", description: "Moist red velvet sponge with cream cheese frosting.", image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=80" },
  { shopId: "mock-9", name: "New York Cheesecake", category: "dessert", cuisine: "Desserts", restaurant: "The Sugar Rush Sweets", rating: 4.8, price: 219, originalPrice: 259, discount: "15% OFF", description: "Baked dense cream cheese on graham crust.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80" },
  { shopId: "mock-9", name: "Assorted Macarons Box (4 pcs)", category: "dessert", cuisine: "Desserts", restaurant: "The Sugar Rush Sweets", rating: 4.6, price: 249, originalPrice: 299, discount: "16% OFF", description: "French almond macaron shells with rich fillings.", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80" },

  { shopId: "mock-10", name: "Cheesy Pepperoni Pan Pizza", category: "pizza", cuisine: "Italian", restaurant: "Pizza Hut", rating: 4.5, price: 329, originalPrice: 389, discount: "15% OFF", description: "Crispy pan crust topped with pepperoni and cheese.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80" },
  { shopId: "mock-10", name: "Cheesy Garlic Bread", category: "pizza", cuisine: "Italian", restaurant: "Pizza Hut", rating: 4.6, price: 139, originalPrice: 169, discount: "17% OFF", description: "Garlic toast topped with melted mozzarella cheese.", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=80" },
  { shopId: "mock-10", name: "Spicy Chicken Supreme Pizza", category: "pizza", cuisine: "Italian", restaurant: "Pizza Hut", rating: 4.7, price: 379, originalPrice: 439, discount: "13% OFF", description: "Hot chicken sausage, peri-peri chicken, and onions.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" },
  { shopId: "mock-10", name: "Classic Cold Coffee", category: "beverages", cuisine: "American", restaurant: "Pizza Hut", rating: 4.4, price: 119, originalPrice: 139, discount: "14% OFF", description: "Chilled blended espresso with milk and vanilla.", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80" },

  { shopId: "mock-11", name: "Hakka Chicken Noodles", category: "chinese", cuisine: "Chinese", restaurant: "Wok & Roll Noodle House", rating: 4.6, price: 199, originalPrice: 239, discount: "16% OFF", description: "Wok-tossed stir fry noodles with chicken and veggies.", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80" },
  { shopId: "mock-11", name: "Crispy Chilli Paneer", category: "chinese", cuisine: "Chinese", restaurant: "Wok & Roll Noodle House", rating: 4.5, price: 219, originalPrice: 259, discount: "15% OFF", description: "Fried cottage cheese in spicy garlic soy gravy.", image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80" },
  { shopId: "mock-11", name: "Chicken Manchow Soup", category: "chinese", cuisine: "Chinese", restaurant: "Wok & Roll Noodle House", rating: 4.7, price: 139, originalPrice: 169, discount: "17% OFF", description: "Hot & sour dark soup topped with crispy fried noodles.", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" },
  { shopId: "mock-11", name: "Fried Veg Spring Rolls (4 pcs)", category: "chinese", cuisine: "Chinese", restaurant: "Wok & Roll Noodle House", rating: 4.4, price: 149, originalPrice: 179, discount: "16% OFF", description: "Crispy pastry rolls filled with seasoned Asian veggies.", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80" },

  { shopId: "mock-12", name: "Full Tandoori Chicken", category: "chicken", cuisine: "Indian", restaurant: "Tandoori Nights", rating: 4.8, price: 399, originalPrice: 469, discount: "14% OFF", description: "Whole chicken marinated in yogurt spices roasted in clay oven.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80" },
  { shopId: "mock-12", name: "Chicken Reshmi Kebab", category: "chicken", cuisine: "Indian", restaurant: "Tandoori Nights", rating: 4.7, price: 279, originalPrice: 329, discount: "15% OFF", description: "Melt-in-mouth chicken marinated in cashew cream marinade.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80" },
  { shopId: "mock-12", name: "Dal Makhani with Butter Roti", category: "indian", cuisine: "Indian", restaurant: "Tandoori Nights", rating: 4.6, price: 219, originalPrice: 259, discount: "15% OFF", description: "Overnight slow-cooked black lentils with cream and butter.", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80" },
  { shopId: "mock-12", name: "Masala Jaljeera Soda", category: "beverages", cuisine: "Indian", restaurant: "Tandoori Nights", rating: 4.5, price: 69, originalPrice: 89, discount: "22% OFF", description: "Tangy cumin and mint spiced sparkling drink.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80" },

  { shopId: "mock-13", name: "Avocado & Quinoa Salad Bowl", category: "healthy", cuisine: "Healthy", restaurant: "Green Garden Salads & Juice", rating: 4.8, price: 279, originalPrice: 329, discount: "15% OFF", description: "Sliced avocado, organic quinoa, cherry tomatoes, and kale.", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80" },
  { shopId: "mock-13", name: "ABC Cold-Pressed Juice (350ml)", category: "beverages", cuisine: "Healthy", restaurant: "Green Garden Salads & Juice", rating: 4.9, price: 139, originalPrice: 169, discount: "17% OFF", description: "Pure Apple, Beetroot, and Carrot immune booster blend.", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80" },
  { shopId: "mock-13", name: "Grilled Chicken Protein Bowl", category: "healthy", cuisine: "Healthy", restaurant: "Green Garden Salads & Juice", rating: 4.7, price: 299, originalPrice: 349, discount: "14% OFF", description: "Herbed chicken breast with brown rice and broccoli.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" },
  { shopId: "mock-13", name: "Chia Seed Berry Pudding", category: "dessert", cuisine: "Healthy", restaurant: "Green Garden Salads & Juice", rating: 4.6, price: 149, originalPrice: 179, discount: "16% OFF", description: "Almond milk chia pudding topped with blueberries.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80" },

  { shopId: "mock-14", name: "Special Kacchi Mutton Biryani", category: "biryani", cuisine: "Bangladeshi", restaurant: "Bawarchi Biryani Hub", rating: 4.6, price: 369, originalPrice: 429, discount: "14% OFF", description: "Tender marinated mutton dum-cooked with fragrant rice.", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80" },
  { shopId: "mock-14", name: "Chicken Roast Special", category: "chicken", cuisine: "Bangladeshi", restaurant: "Bawarchi Biryani Hub", rating: 4.5, price: 219, originalPrice: 259, discount: "15% OFF", description: "Rich fried chicken leg cooked in sweet onion gravy.", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80" },
  { shopId: "mock-14", name: "Borhani Drink (500ml)", category: "beverages", cuisine: "Bangladeshi", restaurant: "Bawarchi Biryani Hub", rating: 4.8, price: 79, originalPrice: 99, discount: "20% OFF", description: "Traditional spicy yogurt drink for digesting heavy meals.", image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80" },
  { shopId: "mock-14", name: "Shahi Firni Cup", category: "dessert", cuisine: "Bangladeshi", restaurant: "Bawarchi Biryani Hub", rating: 4.7, price: 89, originalPrice: 109, discount: "18% OFF", description: "Creamy ground rice pudding served in earthenware pot.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80" },

  { shopId: "mock-15", name: "Double Chocolate Brownie", category: "dessert", cuisine: "Desserts", restaurant: "Choco Craze Bakery", rating: 4.9, price: 119, originalPrice: 149, discount: "20% OFF", description: "Fudgy dark chocolate brownie with chocolate chips.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80" },
  { shopId: "mock-15", name: "Nutella Glazed Donut", category: "dessert", cuisine: "Desserts", restaurant: "Choco Craze Bakery", rating: 4.8, price: 99, originalPrice: 119, discount: "16% OFF", description: "Soft yeast ring donut dipped in rich Nutella hazelnut.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80" },
  { shopId: "mock-15", name: "Salted Caramel Cupcake", category: "dessert", cuisine: "Desserts", restaurant: "Choco Craze Bakery", rating: 4.6, price: 89, originalPrice: 109, discount: "18% OFF", description: "Vanilla cupcake with butter caramel swirl frosting.", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80" },
  { shopId: "mock-15", name: "Hot Chocolate mug with Marshmallows", category: "beverages", cuisine: "Desserts", restaurant: "Choco Craze Bakery", rating: 4.7, price: 159, originalPrice: 189, discount: "15% OFF", description: "Rich thick hot cocoa topped with fluffy mini marshmallows.", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80" },

  { shopId: "mock-16", name: "Double Smash Beef Burger", category: "burger", cuisine: "American", restaurant: "The Crunch Club Burger Studio", rating: 4.8, price: 269, originalPrice: 319, discount: "15% OFF", description: "Seared double beef patties with cheddar cheese slices.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80" },
  { shopId: "mock-16", name: "Loaded Cheese Fries", category: "burger", cuisine: "American", restaurant: "The Crunch Club Burger Studio", rating: 4.6, price: 179, originalPrice: 209, discount: "14% OFF", description: "Crispy fries smothered in liquid cheese and jalapenos.", image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80" },
  { shopId: "mock-16", name: "Crispy BBQ Chicken Wings (6 pcs)", category: "chicken", cuisine: "American", restaurant: "The Crunch Club Burger Studio", rating: 4.7, price: 239, originalPrice: 279, discount: "14% OFF", description: "Fried chicken wings glazed in smoky hickory BBQ sauce.", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80" },
  { shopId: "mock-16", name: "Oreo Cookie Milkshake", category: "beverages", cuisine: "American", restaurant: "The Crunch Club Burger Studio", rating: 4.9, price: 159, originalPrice: 189, discount: "15% OFF", description: "Thick vanilla milkshake blended with crushed Oreo cookies.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // Clear old records
    await Shop.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared old Shops and Products.");

    const shopIdMap = {};

    // 1. Insert 16 Shops
    for (const shop of shopsData) {
      const newShop = await Shop.create({
        name: shop.name,
        description: shop.description,
        icon: shop.icon,
        banner: shop.banner,
        images: [shop.banner, shop.icon],
        address: shop.address,
        city: shop.city,
        tags: shop.tags,
        rating: shop.rating,
        reviewsCount: shop.reviewsCount,
        deliveryTime: shop.deliveryTime,
        minOrder: shop.minOrder,
        freeDelivery: shop.freeDelivery,
        isOpen: shop.isOpen,
      });

      shopIdMap[shop._id] = newShop._id;
    }
    console.log(`Successfully seeded ${Object.keys(shopIdMap).length} Shops!`);

    // 2. Insert 64 Products
    const formattedProducts = foodsData.map((food) => ({
      shop: shopIdMap[food.shopId] || null,
      restaurant: food.restaurant,
      name: food.name,
      images: [food.image],
      price: food.price,
      originalPrice: food.originalPrice || 0,
      discount: food.discount || "",
      description: food.description,
      category: food.category,
      cuisine: food.cuisine || "General",
      rating: food.rating || 4.5,
    }));

    await Product.insertMany(formattedProducts);
    console.log(`Successfully seeded ${formattedProducts.length} Products!`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding Error:", err);
    mongoose.connection.close();
  }
}

seedDatabase();