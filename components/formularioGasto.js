import { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const FormularioGasto = ({ aoAdicionar}) => {
    const [descricaoTexto, setdescricaoTexto] = useState('');
    const [valorTexto, setValorTexto] = useState('');
    const [categoriaTexto, setcategoriaTexto] = useState('');

    const handleAdicionar = () => {
        const valorNumero = parseFloat(valorTexto) || 0;

        if (descricaoTexto.trim() === '' || categoriaTexto.trim() === '' || valorNumero <= 0) {
            return
        }

        aoAdicionar({
            descricao: descricaoTexto,
            valor: valorNumero,
            categoria: categoriaTexto,
        });

        setdescricaoTexto('');
        setValorTexto('');
        setcategoriaTexto('');
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricaoTexto}
                onChangeText={setdescricaoTexto}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor"
                value={valorTexto}
                onChangeText={setValorTexto}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Categoria"
                value={categoriaTexto}
                onChangeText={setcategoriaTexto}
            />
            <Button title="Adicionar gasto" onPress={handleAdicionar}/>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        width: '100%',
        marginTop: 10,
    },
});


export default FormularioGasto;