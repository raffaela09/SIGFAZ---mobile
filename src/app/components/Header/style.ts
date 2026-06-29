import { StyleSheet } from "react-native"
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight + 15,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cbd5e1',
        paddingBottom: 15
    },
    boxLeft:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})

export default styles