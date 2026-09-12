import {
  Heart,
  Star,
  Clock,
} from "lucide-react";

const FoodCard = ({
  food,
  isFavorite,
  onFavorite,
  onAddToCart,
}) => {

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_7px_22px_rgba(28,32,37,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE */}
      <div className="relative">

        <img
          src={food.image}
          alt={food.name}
          className="aspect-[1.7] w-full object-cover"
        />

        {/* FAVORITE */}
        <button
          onClick={() => onFavorite(food.id)}
          className={`
            absolute right-3 top-3
            grid h-10 w-10 place-items-center
            rounded-full bg-white shadow-md
            transition
            ${
              isFavorite
                ? "text-red-500"
                : "text-[#ff7158]"
            }
          `}
        >

          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
          />

        </button>

      </div>

      {/* CONTENT */}
      <div className="p-3.5">

        <h3 className="truncate text-base font-bold text-[#17191c]">
          {food.name}
        </h3>

        <p className="mt-1 truncate text-xs text-[#788493]">
          {food.cuisine}

          <span className="mx-1">
            •
          </span>

          {food.restaurant}
        </p>

        {/* INFO */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[#596677]">

          <span className="flex items-center gap-1">
            <Star
              size={15}
              fill="currentColor"
              className="text-[#ffae19]"
            />

            {food.rating}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={15} />

            {food.deliveryTime}
          </span>

        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between gap-2">

          <strong className="text-lg font-bold text-[#ff5b3d]">
            ৳ {food.price}
          </strong>

          <button
            onClick={() => onAddToCart(food)}
            className="rounded-full bg-[#ff5b3d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#f45135]"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </article>
  );
};

export default FoodCard;