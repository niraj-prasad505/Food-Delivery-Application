import { ShoppingCart } from "lucide-react";

const TrendingProducts = ({ products }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Trending Now
        </h2>

        <button className="text-sm font-semibold text-[#ff6840]">
          View All
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((product) => (
          <div
            key={product._id}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
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

                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#ff6840] hover:bg-[#ff6840] hover:text-white">
                  <ShoppingCart size={17} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default TrendingProducts;