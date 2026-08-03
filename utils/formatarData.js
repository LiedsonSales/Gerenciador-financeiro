export const formatarData = (timestamps) => {
    const data = new Date(timestamps);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${dataFormatada} às ${horaFormatada}`;
};