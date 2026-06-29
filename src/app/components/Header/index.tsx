import styles from './style'
import { View, Text, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

interface HeaderProps {
    title: string,
    icon: React.ReactNode
}

export default function Header({title, icon}: HeaderProps) {
    return (
       <View style={styles.container}>
            <View style={styles.boxLeft}>
                <Pressable>
                    <Ionicons name="chevron-back-sharp" size={20} color="#565D6DFF" />
                </Pressable>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View>
                {icon}
            </View>
       </View> 
    )
}