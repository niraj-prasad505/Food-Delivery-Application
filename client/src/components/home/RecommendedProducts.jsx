import { Heart, Plus } from "lucide-react";

const RecommendedProducts = ({ products }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-gray-900">
          Recommended For You
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Food we think you'll love
        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((product) => (
          <div
            key={product._id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="relative h-48">

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              <button
                className="
                  absolute right-3 top-3 flex h-9 w-9
                  items-center justify-center rounded-full
                  bg-white text-gray-500 shadow-sm
                  hover:text-red-500
                "
              >
                <Heart size={17} />
              </button>

            </div>

            <div className="p-4">

              <h3 className="font-semibold text-gray-900">
                {product.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {product.restaurantName}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <span className="font-bold text-[#ff6840]">
                  ${product.price}
                </span>

                <button
                  className="
                    flex items-center gap-1 rounded-full
                    bg-[#ff6840] px-4 py-2 text-xs
                    font-semibold text-white
                    hover:bg-[#f4512e]
                  "
                >
                  <Plus size={15} />
                  Add
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default RecommendedProducts;