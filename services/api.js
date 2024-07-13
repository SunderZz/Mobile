const API_URL = "http://127.0.0.1:8000";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products/`);
  const data = await response.json();
  console.log(data)
  return data;
};

export const getProductDetail = async (id) => {
  const response = await fetch(`${API_URL}/products_by_id/?id=${id}`);
  const data = await response.json();
  return data;
};

export const fetchWeatherData = async () => {
  try {
    const response = await fetch(`${API_URL}/weather`);
    if (!response.ok) {
      throw new Error("weather errors");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return [];
  }
};
