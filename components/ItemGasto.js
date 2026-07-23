import { StyleSheet, Text, View,  } from 'react-native';

const ItemGasto = ({descricao, valor, categoria}) => {
    return (
        <View style={styles.linha}>
            <Text style={styles.descicao}>{descricao} ({categoria})</Text>
            <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    descicao: {
        fontSize: 16
    },
    valor: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default ItemGasto;