import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity, Modal, Alert } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import TalhaoCard from "../components/Container";
import Header from "../components/Header";
import Pill from "../components/Pill";
import FloatingButton from "../components/FloatingButton";

export default function Tab() {
  const [talhoes, setTalhoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFiltro, setSelectedFiltro] = useState("Todos");
  const [atividadeModalVisible, setAtividadeModalVisible] = useState(false);
  const [selectedTalhaoId, setSelectedTalhaoId] = useState<number | null>(null);
  const [atividadeDesc, setAtividadeDesc] = useState("");

  const fetchTalhoes = async () => {
    try {
      setLoading(true);
      const API_URL = "http://localhost:8000/talhoes/";
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        // O backend retorna um array de arrays: [id, area, tipoCultura, idade, volumeEstimado, idFazenda]
        setTalhoes(data);
      }
    } catch (error) {
      console.error("Erro ao buscar talhões", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTalhoes();
    }, [])
  );

  // Filtra os talhões de acordo com o texto digitado na busca (baseado na cultura/nome) e filtro
  const filteredTalhoes = talhoes.filter((item) => {
    const nomeOuCultura = item[2] ? item[2].toLowerCase() : "";
    const matchesSearch = nomeOuCultura.includes(searchText.toLowerCase());
    const matchesFiltro = selectedFiltro === "Todos" || (item[2] && item[2].toLowerCase() === selectedFiltro.toLowerCase());
    return matchesSearch && matchesFiltro;
  });

  const saveAtividade = async () => {
    if(!atividadeDesc) return;
    try {
      await fetch("http://localhost:8000/atividades/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "Geral",
          data: new Date().toISOString().split('T')[0],
          talhao: `Talhão #${selectedTalhaoId}`,
          descricao: atividadeDesc
        })
      });
      Alert.alert("Sucesso", "Atividade registrada!");
      setAtividadeModalVisible(false);
      setAtividadeDesc("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível registrar a atividade.");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gestão de Talhões"
        icon={
          <TouchableOpacity onPress={() => Alert.alert("Filtro", "Selecione uma categoria nas opções abaixo.")}>
            <FontAwesome name="filter" size={24} color="rgb(199, 200, 204)" />
          </TouchableOpacity>
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
            placeholder="Buscar talhão pelo nome/cultura..."
            style={styles.TextBox}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.viewPill}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          {["Todos", "Soja", "Milho", "Algodão", "Preparação"].map((filtro) => (
            <TouchableOpacity key={filtro} onPress={() => setSelectedFiltro(filtro)}>
              <Pill 
                text={filtro} 
                backgroundColor={selectedFiltro === filtro ? "#22C358FF" : "#E5E7EB"} 
                textColor={selectedFiltro === filtro ? "#FFFFFF" : "#000000"} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.result}>
          <Text style={styles.titleResult}>RESULTADOS ({filteredTalhoes.length})</Text>
          <Text style={styles.titleGreen}>Ver mapa</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
        ) : filteredTalhoes.length === 0 ? (
          <Text style={{ marginTop: 20, color: "#6B7280" }}>Nenhum talhão encontrado.</Text>
        ) : (
          filteredTalhoes.map((item, index) => {
            const id = item[0];
            const area = item[1];
            const cultura = item[2];
            const volume = item[4];

            return (
              <TalhaoCard
                key={id || index}
                nome={cultura || `Talhão #${id}`} // Usa a cultura como nome
                area={`${area} ha`}
                coordenadas="Lat: --, Lng: --"
                status="Ativo"
                cultura={cultura || "Não informada"}
                estimativa={`${volume} kg/ha`}
                onEdit={() => {
                  router.push({
                    pathname: "/new",
                    params: { talhaoData: JSON.stringify(item) }
                  });
                }}
                onAtividade={() => {
                  setSelectedTalhaoId(id);
                  setAtividadeModalVisible(true);
                }}
                onDelete={() => {
                  Alert.alert(
                    "Excluir Talhão",
                    `Deseja realmente excluir este talhão?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      { 
                        text: "Excluir", 
                        style: "destructive",
                        onPress: async () => {
                          try {
                            const response = await fetch(`http://localhost:8000/talhoes/${id}`, { method: 'DELETE' });
                            if(response.ok) {
                              fetchTalhoes();
                            } else {
                              Alert.alert("Erro", "Não foi possível excluir.");
                            }
                          } catch (e) {
                            Alert.alert("Erro", "Falha ao excluir.");
                          }
                        } 
                      }
                    ]
                  );
                }}
              />
            );
          })
        )}
      </ScrollView>

      <FloatingButton onPress={() => router.push("/new")} />

      {/* Modal de Atividade */}
      <Modal visible={atividadeModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Atividade</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="Descrição da atividade..." 
              value={atividadeDesc}
              onChangeText={setAtividadeDesc}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setAtividadeModalVisible(false)} style={styles.modalBtnCancel}>
                <Text style={{color: '#6B7280'}}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveAtividade} style={styles.modalBtnSave}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  modalBtnCancel: {
    padding: 10,
  },
  modalBtnSave: {
    backgroundColor: '#22C358FF',
    padding: 10,
    borderRadius: 8,
  }, 
  fab: {
  position: "absolute",
  right: 20,
  bottom: 20,
  backgroundColor: "#22C358FF",
  width: 56,
  height: 56,
  borderRadius: 28,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 5,
},
});
