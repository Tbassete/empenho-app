import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../App.css';
import logo from '../assets/SapaRed.png';
const INTERVALO = 2 * 60;
const ALTURA_RESERVADA_VH = 12;
const ALTURA_THEAD_VH = 4;

function A() {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [countdown, setCountdown] = useState(INTERVALO);
    const countdownRef = useRef(INTERVALO);

    // const isDecimal = (cod) => {
    //     const prefixo = String(cod).substring(0, 3);
    //     return prefixo === '171' 
    //     // || prefixo === '172';
    // };

const formatarNumero = (valor, cod, comUnidade = false) => {
    const v = parseFloat(valor);
    if (isNaN(v)) return '0';

    const prefixo = String(cod).substring(0, 3);
    const ehDecimal = prefixo === '171';
    const unidade = prefixo === '171' ? 'KG' : 'UN';

    if (ehDecimal) {
        const numero = v.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        return comUnidade ? `${unidade} ${numero}` : numero;
    } else {
        const numero = Math.round(v).toLocaleString('pt-BR');
        return comUnidade ? `${unidade} ${numero}` : numero;
    }
};

    const maiorDiferenca = useMemo(() => {
        const negativos = dados.filter(item => item.xDIFERENCA <= 0);
        if (negativos.length === 0) return 1;
        return Math.abs(Math.min(...negativos.map(item => parseFloat(item.xDIFERENCA))));
    }, [dados]);

    const getCorDiferenca = (valor) => {
        const v = parseFloat(valor);
        if (v === 0) return { color: '#f0a500', fontWeight: '700' };
        const intensidade = Math.min(1, Math.abs(v) / maiorDiferenca);
        const g = Math.round(153 - 153 * intensidade);
        return { color: `rgb(255, ${g}, 0)`, fontWeight: '700' };
    };

    const fetchDados = useCallback(() => {
        axios.get('http://172.26.0.131:3004/consulta-d4b2')
            .then(res => {
                const filtrados = res.data
                    .filter(item => item.xDIFERENCA <= 0)
                    .sort((a, b) => parseFloat(a.xDIFERENCA) - parseFloat(b.xDIFERENCA));
                setDados(filtrados);
                setErro(null);
            })
            .catch(err => {
                setErro('Erro ao carregar os dados.');
                console.error(err);
            })
            .finally(() => setLoading(false));

        countdownRef.current = INTERVALO;
        setCountdown(INTERVALO);
    }, []);

    useEffect(() => {
        fetchDados();
        const intervaloFetch = setInterval(() => { fetchDados(); }, INTERVALO * 1000);
        const intervaloCron = setInterval(() => {
            countdownRef.current -= 1;
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => {
            clearInterval(intervaloFetch);
            clearInterval(intervaloCron);
        };
    }, [fetchDados]);

    const formatarTempo = (segundos) => {
        const m = Math.floor(segundos / 60).toString().padStart(2, '0');
        const s = (segundos % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const estiloCelula = useMemo(() => {
        const totalLinhas = dados.length || 1;
        const alturaDisponivel = 100 - ALTURA_RESERVADA_VH - ALTURA_THEAD_VH;
        const alturaTr = alturaDisponivel / totalLinhas;
        const fonteTd = Math.max(0.9, Math.min(2.2, alturaTr * 0.45));
        const fonteTh = Math.max(0.8, Math.min(1.6, alturaTr * 0.35));
        const paddingV = Math.max(0.1, Math.min(1.0, alturaTr * 0.15));
        return {
            tr: { height: `${alturaTr}vh` },
            td: { fontSize: `${fonteTd}vh`, padding: `${paddingV}vh 0.8vw` },
            th: { fontSize: `${fonteTh}vh`, padding: `${paddingV}vh 0.8vw` },
        };
    }, [dados.length]);

    if (loading) return <p className="home-loading">Carregando...</p>;
    if (erro)    return <p className="home-erro">{erro}</p>;

    return (
        <div className="home-container">
            
            <h2 className="home-titulo">Materiais com Saldo Crítico</h2>
            <p className="home-subtitulo">
                Exibindo itens com diferença zero ou negativa · Próxima atualização em{' '}
                <span className="cronometro">{formatarTempo(countdown)}</span>
            </p>
            <img src={logo} alt="Logo Sapa" className="logo" />

            <div className="tabela-wrapper">
                <table className="tabela">
                    <thead>
                        <tr>
                            <th style={estiloCelula.th}>Código</th>
                            <th style={estiloCelula.th}>Local</th>
                            <th style={estiloCelula.th}>Empenho</th>
                            <th style={estiloCelula.th}>Saldo</th>
                            <th style={estiloCelula.th}>Diferença</th>
                            <th style={estiloCelula.th}>Loc 10</th>
                            <th style={estiloCelula.th}>Loc 20</th>
                            <th style={estiloCelula.th}>Loc 60</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((item, index) => (
                            <tr
                                key={index}
                                style={estiloCelula.tr}
                                className={item.xDIFERENCA < 0 ? 'linha-negativa' : 'linha-zero'}
                            >
                                <td style={estiloCelula.td}>{item.D4_COD}</td>
                                <td style={estiloCelula.td}>{item.D4_LOCAL}</td>
                                <td style={estiloCelula.td}>{formatarNumero(item.xD4_QUANT, item.D4_COD)}</td>
                                <td style={estiloCelula.td}>{formatarNumero(item.xB2_QATU, item.D4_COD)}</td>
<td style={{ ...estiloCelula.td, ...getCorDiferenca(item.xDIFERENCA) }}>
    {formatarNumero(item.xDIFERENCA, item.D4_COD, true)}
</td>
                                <td style={estiloCelula.td}>{formatarNumero(item.SALDO_LOCAL_10 ?? 0, item.D4_COD)}</td>
                                <td style={estiloCelula.td}>{formatarNumero(item.SALDO_LOCAL_20 ?? 0, item.D4_COD)}</td>
                                <td style={estiloCelula.td}>{formatarNumero(item.SALDO_LOCAL_60 ?? 0, item.D4_COD)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {dados.length === 0
                ? <p className="home-vazio">Nenhuma máquina encontrada com diferença zero ou negativa.</p>
                : <p className="home-rodape">{dados.length} registro(s) encontrado(s)</p>
            }
        </div>
    );
}

export default A;