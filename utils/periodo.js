export const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const inicioDoDia = (data) => {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
};

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

export const filtrarGastosRecentes = (gastos) => {
  const hojeInicio = inicioDoDia(Date.now()).getTime();
  const ontemInicio = hojeInicio - 24 * 60 * 60 * 1000;

  const hoje = [];
  const ontem = [];

  gastos.forEach((g) => {
    const data = g.dataGasto || 0;
    if (data >= hojeInicio) {
      hoje.push(g);
    } else if (data >= ontemInicio) {
      ontem.push(g);
    }
  });

  const porDataDesc = (a, b) => (b.dataGasto || 0) - (a.dataGasto || 0);
  hoje.sort(porDataDesc);
  ontem.sort(porDataDesc);

  const secoes = [];
  if (hoje.length > 0) secoes.push({ title: 'Hoje', data: hoje });
  if (ontem.length > 0) secoes.push({ title: 'Ontem', data: ontem });
  return secoes;
};

export const agruparGastosPorMes = (gastos) => {
  const grupos = {};

  gastos.forEach((g) => {
    const { ano, mes } = obterAnoMes(g.dataGasto);
    const chave = chaveAnoMes(ano, mes);
    if (!grupos[chave]) {
      grupos[chave] = { ano, mes, data: [] };
    }
    grupos[chave].data.push(g);
  });

  const secoes = Object.values(grupos).map((grupo) => {
    const dataOrdenada = [...grupo.data].sort((a, b) => (b.dataGasto || 0) - (a.dataGasto || 0));
    const total = dataOrdenada.reduce((soma, item) => soma + item.valor, 0);
    return { title: labelMes(grupo.ano, grupo.mes), total, data: dataOrdenada };
  });

  return secoes.sort((a, b) => (b.data[0]?.dataGasto || 0) - (a.data[0]?.dataGasto || 0));
};