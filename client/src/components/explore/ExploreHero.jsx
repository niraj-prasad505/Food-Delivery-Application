import { Search } from "lucide-react";

const ExploreHero = ({ search, setSearch }) => {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-8 pt-14 lg:grid-cols-2 lg:px-8 lg:pt-16">

      {/* LEFT */}
      <div>

        <p className="mb-3 text-xs font-semibold tracking-[3px] text-[#ff5b3d]">
          GOOD FOOD, BETTER MOOD
        </p>

        <h1 className="text-4xl font-bold leading-tight tracking-[-1px] text-[#17191c] sm:text-4xl lg:text-5xl">
          Explore{" "}
          <span className="font-bold text-[#ff5b3d]">
            Delicious Foods
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-[#687586] sm:text-medium">
          Discover a wide variety of cuisines from the best restaurants
          in your city. Find your next favorite meal, anytime!
        </p>

        {/* SEARCH */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 flex h-14 w-full max-w-2xl items-center gap-3 rounded-full border border-gray-200 bg-white p-1.5 pl-5 shadow-[0_8px_25px_rgba(0,0,0,0.07)]"
        >

          <Search
            size={22}
            className="shrink-0 text-[#ff5b3d]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for dishes, cuisines or restaurants..."
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="h-11 rounded-full bg-[#ff5b3d] px-7 font-bold text-white transition hover:bg-[#f45135]"
          >
            Search
          </button>
          

        </form>

      </div>

      {/* RIGHT */}
      <div className="relative flex min-h-75 items-center justify-center">

        {/* Background shape */}
        <div className="absolute h-67.5 w-105 rotate-[-5deg] rounded-[55%_35%_50%_40%] bg-[#fff3ed] sm:h-77.5 sm:w-125" />

        {/* Food */}
        <img
          src="https://img.magnific.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Delicious pasta"
          className="relative h-57.5 w-57.5 rounded-full border-[6px] border-white object-cover shadow-2xl sm:h-72.5 sm:w-72.5"
        />

        {/* Text */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-[-5deg] font-serif text-lg italic leading-7 sm:right-8 sm:text-2xl">
          Good
          <br />
          Food
          <br />
          Good Mood
        </div>

      </div>

    </section>
  );
};

export default ExploreHero;