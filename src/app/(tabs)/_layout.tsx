import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#22C358FF', tabBarInactiveTintColor: '#565D6DFF', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="fazendas"
        options={{
          title: 'Fazendas',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="map-marked-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="talhoes"
        options={{
          title: 'Talhoes',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="layer-group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="culturas"
        options={{
          title: 'Culturas',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="seedling" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: 'Gastos',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="money" color={color} />,
        }}
      />
      <Tabs.Screen
        name="lucro"
        options={{
          title: 'Lucro',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="bar-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}
