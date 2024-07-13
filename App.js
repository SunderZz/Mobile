import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ShopScreen from "./screens/ShopScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import { Text, TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

const CustomHeaderBack = ({ navigation }) => (
  <TouchableOpacity
    style={{ flexDirection: "row", alignItems: "center" }}
    onPress={() => navigation.goBack()}
  >
    <Text style={{ marginLeft: 8 }}>← Retour au marché</Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Shop"
          component={ShopScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ navigation }) => ({
            headerLeft: () => <CustomHeaderBack navigation={navigation} />,
            headerTitle: "",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
