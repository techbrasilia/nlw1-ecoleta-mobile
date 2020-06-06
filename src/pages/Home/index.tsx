import React, { useState, useEffect, ChangeEvent } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  ImageBackground,
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  id: number;
  nome: string;
}

interface Estado {
  label: string;
  value: string;
}

interface Cidade {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [ufs, setUfs] = useState<Estado[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [ufsTemp, setUfsTemp] = useState<string[]>([]);

  const [cities, setCities] = useState<Cidade[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  const [citiesTemp, setCitiesTemp] = useState<IBGECityResponse[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);

        setUfsTemp(ufInitials);
      });
  }, []);

  useEffect(() => {
    const estados = ufsTemp.map((estado) => {
      return {
        label: estado,
        value: estado,
      };
    });
    setUfs(estados);
  }, [ufsTemp]);

  useEffect(() => {
    if (selectedUf === "0") return;

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cities = response.data;
        setCitiesTemp(cities);
      });
  }, [selectedUf]);

  useEffect(() => {
    const cidades = citiesTemp.map((city) => {
      return {
        label: city.nome,
        value: city.nome,
      };
    });
    setCities(cidades);
  }, [citiesTemp]);

  function handleSelectUf(uf: string) {
    // console.log("uf selecionada", uf);
    setSelectedUf(uf);
  }

  function handleSelectCity(city: string) {
    // const city = event.target.value;
    console.log("cidade selecionada", city);
    setSelectedCity(city);
  }

  function handleNavigateToPoints() {
    navigation.navigate("Points", { uf: selectedUf, city: selectedCity });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos.
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{ label: "Selecione uma UF" }}
            items={ufs}
            style={pickerSelectStyles}
            value={selectedUf}
            onValueChange={(value) => handleSelectUf(value)}
          />

          <RNPickerSelect
            placeholder={{ label: "Selecione uma cidade" }}
            items={cities}
            style={pickerSelectStyles}
            value={selectedCity}
            onValueChange={(value) => handleSelectCity(value)}
            // Icon={() => {
            //   return <Icon name="arrow-down" size={24} color="gray" />;
            // }}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 10,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon

    height: 60,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
});

export default Home;
