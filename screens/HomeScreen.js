import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Animated,
  SafeAreaView,
} from "react-native";
import { fetchWeatherData } from "../services/api";

const HomeScreen = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const updateWeather = async () => {
      const data = await fetchWeatherData();
      setWeatherData(data);
    };

    updateWeather();
    const interval = setInterval(updateWeather, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (weatherData.length > 0) {
      const interval = setInterval(() => {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % weatherData.length);
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [weatherData, fadeAnim]);

  return (
    <ImageBackground
      source={require("../assets/Marché.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>
            NouGain{"\n"}A nou ossi nous gayn fé!
          </Text>
          <Button
            title="Visitez notre Marché"
            onPress={() => navigation.navigate("Shop")}
          />
          {weatherData.length > 0 && (
            <Animated.View
              style={[styles.weatherContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.weatherText}>
                {weatherData[currentIndex].city}: Max{" "}
                {weatherData[currentIndex].temp_max}, Min{" "}
                {weatherData[currentIndex].temp_min}
              </Text>
            </Animated.View>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© NouGain</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  weatherContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 18,
    color: "white",
  },
  footer: {
    padding: 10,
    backgroundColor: "#6200ea",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "white",
  },
});

export default HomeScreen;
