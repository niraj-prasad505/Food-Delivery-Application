import { categories } from "../../data/foods";

const CategoryFilter = ({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 pt-2 [scrollbar-width:none]">

      {categories.map((category) => (

        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`
            flex shrink-0 items-center gap-2
            rounded-full border px-6 py-3
            text-sm font-medium
            transition h-12
            ${
              activeCategory === category.id
                ? "border-[#ff5b3d] bg-[#ff5b3d] text-white shadow-md"
                : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:shadow-md"
            }
          `}
        >

          <span className="text-lg">
            {category.icon}
          </span>

          {category.name}

        </button>

      ))}

      

    </div>
  );
};

export default CategoryFilter;