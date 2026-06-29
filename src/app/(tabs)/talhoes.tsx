import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import TalhaoCard from "../components/Container";
import Header from "../components/Header";
import Pill from "../components/Pill";

export default function Tab() {
  return (
    <View style={styles.container}>
      <Header
        title="Gestão de Talhões"
        icon={
          <FontAwesome name="filter" size={24} color="rgb(199, 200, 204)" />
        }
      />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          gap: 20,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.viewText}>
          <FontAwesome5 name="search" size={20} color="#565D6DFF" />
          <TextInput
            placeholder="Buscar talhão pelo nome..."
            style={styles.TextBox}
          />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.viewPill}
          contentContainerStyle={{ gap: 10 }}
        >
          <Pill text="Todos" backgroundColor="#22C358FF" textColor="#FFFFFF" />
          <Pill text="Soja" />
          <Pill text="Milho" />
          <Pill text="Algodão" />
          <Pill text="Preparação" />
        </ScrollView>
        <View style={styles.result}>
          <Text style={styles.titleResult}>RESULTADOS (3)</Text>
          <Text style={styles.titleGreen}>Ver mapa</Text>
        </View>
        <TalhaoCard
          nome="Talhão Sul 04"
          area="120 ha"
          coordenadas="-23.5612, -46.6401"
          status="Plantio"
          cultura="Milho"
          estimativa="8.500 kg/ha"
          onEdit={() => console.log("Clicou em editar")}
          onAtividade={() => console.log("Clicou em atividade")}
        />
        <TalhaoCard
          nome="Talhão Sul 04"
          area="120 ha"
          coordenadas="-23.5612, -46.6401"
          status="Plantio"
          cultura="Milho"
          estimativa="8.500 kg/ha"
          onEdit={() => console.log("Clicou em editar")}
          onAtividade={() => console.log("Clicou em atividade")}
        />
        <TalhaoCard
          nome="Talhão Sul 04"
          area="120 ha"
          coordenadas="-23.5612, -46.6401"
          status="Plantio"
          cultura="Milho"
          estimativa="8.500 kg/ha"
          onEdit={() => console.log("Clicou em editar")}
          onAtividade={() => console.log("Clicou em atividade")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TextBox: {
    width: "90%",
    backgroundColor: "#ffff",
  },
  viewText: {
    width: "95%",
    backgroundColor: "#ffff",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingLeft: 10,
  },
  scrollView: {},
  viewPill: {
    width: "100%",
    padding: 10,
  },
  result: {
    width: "95%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleResult: {
    fontWeight: "bold",
    color: "rgb(107, 107, 107)",
  },
  titleGreen: {
    fontWeight: "bold",
    color: "#22C358FF",
  },
});
