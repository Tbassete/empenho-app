import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import '../App.css';

const INTERVALO = 2 * 60;

function Home() {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [countdown, setCountdown] = useState(INTERVALO);
    const countdownRef = useRef(INTERVALO);

    const fetchDados = useCallback(() => {
        axios.get('http://localhost:3004/consulta-d4b2')
            .then(res => {
                const filtrados = res.data
                    .filter(item => item.xDIFERENCA <= 20)
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

        const intervaloFetch = setInterval(() => {
            fetchDados();
            console.log("atualizou!")
        }, INTERVALO * 1000);

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

    if (loading) return <p className="home-loading">Carregando...</p>;
    if (erro)    return <p className="home-erro">{erro}</p>;

    return (
        <div className="home-container">
            <h2 className="home-titulo">Controle de abastecimento de produção</h2>
            <p className="home-subtitulo">
                Exibindo itens com diferença zero ou negativa · Próxima atualização em{' '}
                <span className="cronometro">{formatarTempo(countdown)}</span>
            </p>

            <div className="tabela-wrapper">
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            {/* <th>Chave</th> */}
                            <th>Local</th>
                            <th>Empenho</th>
                            <th>Saldo Atual</th>
                            <th>Diferença</th>
                            <th>Qntd 10</th>
                            <th>Qntd 20</th>
                            <th>Qntd 60</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((item, index) => (
                            <tr
                                key={index}
                                className={item.xDIFERENCA < 0 ? 'linha-negativa' : 'linha-zero'}
                            >
                                <td>{item.D4_COD}</td>
                                {/* <td>{item.CHAVE}</td> */}
                                <td>{item.D4_LOCAL}</td>
                                <td>{item.xD4_QUANT}</td>
                                <td>{item.xB2_QATU}</td>
                                <td className={item.xDIFERENCA < 0 ? 'badge-negativo' : 'badge-zero'}>
                                    {parseFloat(item.xDIFERENCA).toFixed(3)}
                                </td>
                                <td>{item.SALDO_LOCAL_10 != null ? parseFloat(item.SALDO_LOCAL_10).toFixed(3) : '0.000'}</td>
                                <td>{item.SALDO_LOCAL_20 != null ? parseFloat(item.SALDO_LOCAL_20).toFixed(3) : '0.000'}</td>
                                <td>{item.SALDO_LOCAL_60 != null ? parseFloat(item.SALDO_LOCAL_60).toFixed(3) : '0.000'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {dados.length === 0
                ? <p className="home-vazio">Nenhum produto encontrada com diferença zero ou negativa.</p>
                : <p className="home-rodape">{dados.length} registro(s) encontrado(s)</p>
            }
        </div>
    );
}

export default Home;