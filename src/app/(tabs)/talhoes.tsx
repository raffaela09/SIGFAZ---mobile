import { View, Text, StyleSheet, ScrollView, TextInput  } from 'react-native';
import Header from '../components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

export default function Tab() {
  return (
    <View style={styles.container}>
        <Header title="Gestão de Talhões" icon={<FontAwesome name="filter" size={24} color="rgb(199, 200, 204)" />} />
        <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 20, paddingTop: 10 }}>
            <View style={styles.viewText}>
                <FontAwesome5 name="search" size={20} color="#565D6DFF" />
                <TextInput placeholder='Buscar talhão pelo nome...' style={styles.TextBox} />
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TextBox:{
    width: '90%',
    backgroundColor: '#ffff',
  },
  viewText:{
    width: '95%',
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingLeft: 10
  },
  scrollView:{
    
  }
});