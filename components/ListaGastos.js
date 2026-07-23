import { FlatList, Text, StyleSheet } from "react-native";
import { ItemGasto } from './ItemGasto';

const ListaGasto = ({gastos, total}) => {
    return (
        <FlatList
            data={gastos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <ItemGasto
                    descricao={item.descricao}
                    valor={item.valor}
                    categoria={item.categoria}
                />
            )}
        />
    )
}

export default ListaGasto;