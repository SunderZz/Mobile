import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  FlatList,
  useWindowDimensions,
} from "react-native";
import {
  getProductDetail,
  getProductReviews,
  getProducerName,
  getProductImage,
} from "../services/api";

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [producerName, setProducerName] = useState("");
  const [loading, setLoading] = useState(true);
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      const productData = await getProductDetail(productId);
      const imageUrl = await getProductImage(productId);
      setProduct({ ...productData, imageUrl });

      const reviewsData = await getProductReviews(productId);
      setReviews(reviewsData || []);

      const producerData = await getProducerName(productId);
      setProducerName(producerData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const openProductLink = () => {
    const url = `http://localhost:5173/#/ProductDetail/${productId}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      <Image
        source={{ uri: product.imageUrl || "https://via.placeholder.com/300" }}
        style={styles.productImage}
      />
      <TouchableOpacity onPress={openProductLink}>
        <Text style={styles.productName}>{product.Name}</Text>
      </TouchableOpacity>
      {product.Description && (
        <Text style={styles.productDescription}>{product.Description}</Text>
      )}
      <Text style={styles.productPrice}>Prix: {product.Price_ht} €</Text>
      {product.Discount !== null && product.Discount > 0 && (
        <Text style={styles.productDiscount}>
          Promotion: {product.Discount}%
        </Text>
      )}
      <Text style={styles.producerName}>Producteur: {producerName}</Text>
      <Text style={styles.reviewsTitle}>Avis:</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {reviews.length === 0 && (
        <Text style={styles.noReviews}>Pas de commentaire pour ce produit</Text>
      )}
    </View>
  );

  return (
    <FlatList
      style={{ height: windowHeight - 60 }}
      data={reviews}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <View style={styles.review}>
          <Text style={styles.reviewTitle}>{item.Title}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.Notice_date).toLocaleDateString()}
          </Text>
          <Text style={styles.reviewText}>{item.Notice}</Text>
          <Text style={styles.reviewRating}>Note: {item.Note}/10</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  backText: {
    fontSize: 16,
    color: "#6200ea",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#6200ea",
    paddingHorizontal: 16,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  productDiscount: {
    fontSize: 16,
    color: "red",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  producerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  noReviews: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  review: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 4,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    height: 50,
  },
});

export default ProductDetailScreen;
