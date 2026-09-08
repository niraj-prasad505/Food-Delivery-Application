const getHomeData = async () => {
  const response = await fetch("/api/home");

  if (!response.ok) {
    throw new Error("Failed to fetch home data");
  }

  return response.json();
};

export default getHomeData;