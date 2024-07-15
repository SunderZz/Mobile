const API_URL = "http://127.0.0.1:8000";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products/`);
  const data = await response.json();
  return data;
};

export const getProductDetail = async (id) => {
  const response = await fetch(`${API_URL}/products_by_id/?id=${id}`);
  const data = await response.json();
  return data;
};

export const getProductReviews = async (productId) => {
  const response = await fetch(`${API_URL}/get_notice_by_id?product=${productId}`);
  const data = await response.json();
  return data;
};

export const getProducerName = async (productId) => {
  const giveResponse = await fetch(`${API_URL}/give/${productId}`);
  const giveData = await giveResponse.json();
  const producerId = giveData.Id_Producers;

  const userResponse = await fetch(`${API_URL}/user_by_producer?producer_id=${producerId}`);
  const userData = await userResponse.json();
  return `${userData.F_Name} ${userData.Name}`;
};

export const fetchWeatherData = async () => {
  try {
    const response = await fetch(`${API_URL}/weather`);
    if (!response.ok) {
      throw new Error("weather errors");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
