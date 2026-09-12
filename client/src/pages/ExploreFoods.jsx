import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import ExploreHero from "../components/explore/ExploreHero";
import CategoryFilter from "../components/explore/CategoryFilter";
import FoodGrid from "../components/explore/FoodGrid";

import { foods } from "../data/foods";

const ExploreFoods = () => {

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [sort, setSort] =
    useState("popularity");

  const [favorites, setFavorites] =
    useState(new Set());

  const [cartItems, setCartItems] =
    useState([]);

  // =============================
  // FILTER + SEARCH + SORT
  // =============================

  const filteredFoods = useMemo(() => {

    let result = foods.filter((food) => {

      const categoryMatch =
        activeCategory === "all" ||
        food.category === activeCategory;

      const searchText = `
        ${food.name}
        ${food.cuisine}
        ${food.restaurant}
      `.toLowerCase();

      const searchMatch =
        searchText.includes(
          search.toLowerCase().trim()
        );

      return categoryMatch && searchMatch;
    });

    // SORT

    if (sort === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    return result;

  }, [
    search,
    activeCategory,
    sort,
  ]);

  // =============================
  // FAVORITE
  // =============================

  const handleFavorite = (id) => {

    setFavorites((previous) => {

      const updated =
        new Set(previous);

      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }

      return updated;
    });

  };

  // =============================
  // CART
  // =============================

  const handleAddToCart = (food) => {

    setCartItems((previous) => [
      ...previous,
      food,
    ]);

    console.log(
      "Added to cart:",
      food
    );
  };

  return (

    <div className="min-h-screen bg-white">

      {/* HERO */}

      <ExploreHero
        search={search}
        setSearch={setSearch}
      />

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">

        {/* CATEGORIES */}

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* HEADING */}

        <div className="mb-5 mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <h2 className="text-2xl font-bold tracking-tight text-[#17191c] sm:text-3xl">
              Popular Foods
            </h2>

            <p className="mt-1 text-sm text-[#687586]">
              Handpicked dishes from top restaurants near you
            </p>

          </div>

          {/* SORT */}

          <div className="relative flex h-12 items-center gap-1 rounded-xl border border-gray-200 px-4 text-sm text-gray-700">

            <span>
              Sort by:
            </span>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="appearance-none bg-transparent pr-5 font-medium outline-none"
            >

              <option value="popularity">
                Popularity
              </option>

              <option value="rating">
                Rating
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-2"
            />

          </div>

        </div>

        {/* FOODS */}

        <FoodGrid
          foods={filteredFoods}
          favorites={favorites}
          onFavorite={handleFavorite}
          onAddToCart={handleAddToCart}
        />

      </section>

      {/* SIMPLE CART STATUS */}

      {cartItems.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 rounded-full bg-[#17191c] px-5 py-3 text-sm font-semibold text-white shadow-xl">

          🛒 {cartItems.length} item
          {cartItems.length > 1 ? "s" : ""}

        </div>
      )}

    </div>
  );
};

export default ExploreFoods;