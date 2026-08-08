export const MESES_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  
  export const obterAnoMes = (timestamp) => {
    const data = new Date(timestamp || Date.now());
    return { ano: data.getFullYear(), mes: data.getMonth() };
  };
  
  export const chaveAnoMes = (ano, mes) => `${ano}-${String(mes).padStart(2, '0')}`;
  
  export const labelMes = (ano, mes) => `${MESES_PT[mes]} de ${ano}`;
  
  export const filtrarGastosPorMes = (gastos, ano, mes) => {
    return gastos.filter((g) => {
      const data = new Date(g.dataGasto || 0);
      return data.getFullYear() === ano && data.getMonth() === mes;
    });
  };
  
  export const listarMesesComGastos = (gastos) => {
    const chaves = new Set();
  
    gastos.forEach((g) => {
      const { ano, mes } = obterAnoMes(g.dataGasto);
      chaves.add(chaveAnoMes(ano, mes));
    });
  
    const atual = obterAnoMes(Date.now());
    chaves.add(chaveAnoMes(atual.ano, atual.mes));
  
    const lista = [...chaves].map((chave) => {
      const [anoTexto, mesTexto] = chave.split('-');
      return { ano: parseInt(anoTexto, 10), mes: parseInt(mesTexto, 10) };
    });
  
    return lista.sort((a, b) => (a.ano !== b.ano ? b.ano - a.ano : b.mes - a.mes));
  };