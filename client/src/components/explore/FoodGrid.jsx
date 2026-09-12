import FoodCard from "./FoodCard";

const FoodGrid = ({
  foods,
  favorites,
  onFavorite,
  onAddToCart,
}) => {

  if (foods.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">

        <div className="text-4xl">
          🍽️
        </div>

        <h3 className="mt-3 text-lg font-bold">
          No food found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try another food or category.
        </p>

      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

      {foods.map((food) => (

        <FoodCard
          key={food.id}
          food={food}
          isFavorite={favorites.has(food.id)}
          onFavorite={onFavorite}
          onAddToCart={onAddToCart}
        />

      ))}

    </div>
  );
};

export default FoodGrid;