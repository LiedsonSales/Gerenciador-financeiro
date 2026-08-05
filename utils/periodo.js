export const inicioDoDia = (data) => {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const calcularIntervalo = (periodo) => {
    const agora = new Date();
    let inicio;

    if (periodo === 'semana') {
        const diaSemana = agora.getDay();
        inicio = new Date(agora);
        inicio.setDate(agora.getDate() - diaSemana);
    } else if (periodo === 'mes') {
        inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
    } else {
        inicio = new Date(agora.getFullYear(), 0, 1);
    }

    return { inicio: inicioDoDia(inicio).getTime(), fim: agora.getTime() };
};

export const filtrarGastosPorPeriodo = (gastos, periodo) => {
    const { inicio, fim } = calcularIntervalo(periodo);
    return gastos.filter((g) => {
        const dataReferencia = g.dataGasto || 0;
        return dataReferencia >= inicio && dataReferencia <= fim;
    });
};

export const rendaProporcionalAoPeriodo = (rendaMensal, periodo) => {
    if (periodo === 'semana') return rendaMensal / 4.345;
    if (periodo === 'ano') return rendaMensal * 12;
    return rendaMensal;
};