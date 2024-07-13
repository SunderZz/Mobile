import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getProducts } from "../services/api";

const ShopScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortOption]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(searchQuery);
      let filteredProducts = data;

      if (searchQuery.length >= 2) {
        filteredProducts = data.filter(
          (product) =>
            product &&
            product.Name &&
            product.Name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (sortOption === "croissant") {
        filteredProducts.sort((a, b) => a.Price_ht - b.Price_ht);
      } else if (sortOption === "décroissant") {
        filteredProducts.sort((a, b) => b.Price_ht - a.Price_ht);
      } else if (sortOption === "promotion") {
        filteredProducts = filteredProducts.filter(
          (product) => product.Discount && product.Discount > 0
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      setErrorMessage(
        "Erreurs lors de la Récupération des produits: " + error.message
      );
      console.error("Erreur lors de la Récupération des produits:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleProductPress = (productId) => {
    navigation.navigate("ProductDetail", { productId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => handleProductPress(item.Id_Product)}
    >
      <Image
        source={require("../assets/default_product.png")}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.Name}</Text>
        <Text style={styles.productPrice}>{item.Price_ht} €</Text>
        {item.Discount !== null && item.Discount > 0 && (
          <Text style={styles.productDiscount}>
            Promotion: {item.Discount}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const { height: windowHeight } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NouGain</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>
      <Picker
        selectedValue={sortOption}
        style={styles.picker}
        onValueChange={(itemValue) => setSortOption(itemValue)}
      >
        <Picker.Item label="prix croissant" value="croissant" />
        <Picker.Item label="prix décroissant" value="décroissant" />
        <Picker.Item label="promotion" value="promotion" />
      </Picker>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {products.length > 0 ? (
        <FlatList
          style={{ height: windowHeight - 60 }}
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.Id_Product.toString()}
          onScroll={(event) => {}}
        />
      ) : (
        <Text style={styles.noResults}>Produit non trouvé.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDiscount: {
    fontSize: 14,
    color: "red",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#999",
  },
});

export default ShopScreen;
