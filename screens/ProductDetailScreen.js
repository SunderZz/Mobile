import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { getProductDetail } from "../services/api";

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      const data = await getProductDetail(productId);
      setProduct(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/default_product.png")}
        style={styles.productImage}
      />
      <TouchableOpacity onPress={openProductLink}>
        <Text style={styles.productName}>{product.Name}</Text>
      </TouchableOpacity>
      {product.Description && (
        <Text style={styles.productDescription}>{product.Description}</Text>
      )}
      <Text style={styles.productPrice}>Price: {product.Price_ht} €</Text>
      {product.Discount !== null && product.Discount > 0 && (
        <Text style={styles.productDiscount}>Promotion: {product.Discount}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  backButton: {
    marginBottom: 20,
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
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productDiscount: {
    fontSize: 16,
    color: "red",
    marginBottom: 8,
  },
});

export default ProductDetailScreen;
