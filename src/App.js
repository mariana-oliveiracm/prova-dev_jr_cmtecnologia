import "./App.css"
import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "./components/Button";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import { CSVLink } from "react-csv";

function App() {

    const [dadosPaises, setDadosPaises] = useState("");
    const [isSinglePais, setIsSinglePais] = useState(false);
    const [chartCurrentPaisCasos, setChartCurrentPaisCasos] = useState("");
    const [chartCurrentPaisMortes, setChartCurrentPaisMortes] = useState("");
    const [chartCurrentPaisRecuperados, setChartCurrentPaisRecuperados] = useState("");
    const [isComparativo, setIsComparativo] = useState(false);
    const [chartComparativoCasos, setChartComparativoCasos] = useState("");
    const [chartComparativoMortes, setChartComparativoMortes] = useState("");
    const [chartComparativoRecuperados, setChartComparativoRecuperados] = useState("");
    const [csvDataCasos, setCsvDataCasos] = useState("");
    const [csvDataMortes, setCsvDataMortes] = useState("");
    const [csvDataRecuperados, setCsvDataRecuperados] = useState("");
    const [csvDataComparativoCasos, setCsvDataComparativoCasos] = useState("");
    const [csvDataComparativoMortes, setCsvDataComparativoMortes] = useState("");
    const [csvDataComparativoRecuperados, setCsvDataComparativoRecuperados] = useState("");

    useEffect(async() => {
        const request = await getDadosPaises();
        setDadosPaises(request);
    }, []);

    const handleDadosBrasil = async (pais) => {
        const dadosDetalhadosBrasil = await getDadosPais(pais);
        const lineChartBrasilCasos = setLineChartData(dadosDetalhadosBrasil, "casos");
        setChartCurrentPaisCasos(lineChartBrasilCasos);
        const lineChartBrasilMortes = setLineChartData(dadosDetalhadosBrasil, "mortes");
        setChartCurrentPaisMortes(lineChartBrasilMortes);
        const lineChartBrasilRecuperados = setLineChartData(dadosDetalhadosBrasil, "recuperados");
        setChartCurrentPaisRecuperados(lineChartBrasilRecuperados);

        setIsSinglePais(true);
        setIsComparativo(false);
        setDownloadSinglePais(pais, dadosDetalhadosBrasil);        

    };

    const handleDataIndia = async (pais) => {
        const dadosDetalhadosIndia = await getDadosPais(pais);
        const lineChartIndiaCasos = setLineChartData(dadosDetalhadosIndia, "casos");
        setChartCurrentPaisCasos(lineChartIndiaCasos);
        const lineChartIndiaMortes = setLineChartData(dadosDetalhadosIndia, "mortes");
        setChartCurrentPaisMortes(lineChartIndiaMortes);
        const lineChartIndiaRecuperados = setLineChartData(dadosDetalhadosIndia, "recuperados");
        setChartCurrentPaisRecuperados(lineChartIndiaRecuperados);

        setIsSinglePais(true);
        setIsComparativo(false);
        setDownloadSinglePais(pais, dadosDetalhadosIndia);
    };

    const handleDataEUA = async (pais) => {
        const dadosDetalhadosEUA = await getDadosPais(pais);
        const lineChartEUACasos = setLineChartData(dadosDetalhadosEUA, "casos");
        setChartCurrentPaisCasos(lineChartEUACasos);
        const lineChartEUAMortes = setLineChartData(dadosDetalhadosEUA, "mortes");
        setChartCurrentPaisMortes(lineChartEUAMortes);
        const lineChartEUARecuperados = setLineChartData(dadosDetalhadosEUA, "recuperados");
        setChartCurrentPaisRecuperados(lineChartEUARecuperados);

        setIsSinglePais(true);
        setIsComparativo(false);
        setDownloadSinglePais(pais, dadosDetalhadosEUA);
    };

    const handleComparativo = () => {
        const dadosBasicosBrasil = dadosPaises.find(item => item.CountryCode == "BR");
        const dadosBasicosIndia = dadosPaises.find(item => item.CountryCode == "IN");
        const dadosBasicosEUA = dadosPaises.find(item => item.CountryCode == "US");
        
        const dadosBasicosPaises = [
            dadosBasicosBrasil,
            dadosBasicosIndia,
            dadosBasicosEUA
        ];
        const barChartCasos = setBarChartData(dadosBasicosPaises, "casos");
        const barChartMortes = setBarChartData(dadosBasicosPaises, "mortes");
        const barChartRecuperados = setBarChartData(dadosBasicosPaises, "recuperados");

        setChartComparativoCasos(barChartCasos);
        setChartComparativoMortes(barChartMortes);
        setChartComparativoRecuperados(barChartRecuperados);
        setIsSinglePais(false);
        setIsComparativo(true);

        setDownloadComparativo(dadosBasicosPaises);

    };

    const getDadosPaises = async() => {
        try {
            const response = await axios.get("https://api.covid19api.com/summary");
            return response.data.Countries;
        } catch (error) {
            console.log(error)
        }
    };

    const getDadosPais = async(pais) => {
        try {
            switch (pais) {
                case "Brasil":
                    const responseBrasil = await axios.get("https://api.covid19api.com/total/country/brazil");
                    return responseBrasil.data;
                case "Índia":
                    const responseIndia = await axios.get("https://api.covid19api.com/total/country/india");
                    return responseIndia.data;
                case "Estados Unidos":
                    const responseEUA = await axios.get("https://api.covid19api.com/total/country/united-states");
                    return responseEUA.data;
            
                default:
                    break;
            }

            
        } catch (error) {
            console.log(error)
        }
    };

    const setLineChartData = (dadosDetalhados, dado) => {
        const labels = [];
        dadosDetalhados.forEach((item) => {
            let dia = item.Date.slice(8,10);
            let mes = item.Date.slice(5,7);
            labels.push(`${dia}-${mes}`);
        });

        switch (dado) {
            case "casos":
                const casos = [];
                dadosDetalhados.forEach((item) => {
                    casos.push(item.Confirmed);
                });
                return getLineChart(labels, casos, "Casos Confirmados", "blue");
            case "mortes":
                const mortes = [];
                dadosDetalhados.forEach((item) => {
                    mortes.push(item.Deaths);
                });
                return getLineChart(labels, mortes, "Mortes", "red");
            case "recuperados":
                const recuperados = [];
                dadosDetalhados.forEach((item) => {
                    recuperados.push(item.Recovered);
                });
                return getLineChart(labels, recuperados, "Recuperados", "green");
        
            default:
                break;
        }
    };

    const getLineChart = (labels, dados, legenda, cor) => {
        const lineChart = {
            labels: labels,
            datasets: [
                {
                label: legenda,
                data: dados,
                fill: false,
                backgroundColor: cor,
                },
            ],
        };
        return lineChart;
    };

    const setBarChartData = (dadosBasicosPaises, dado) => {
        switch (dado) {
            case "casos":
                const casos = [];
                dadosBasicosPaises.forEach((item) => {
                    casos.push(item.TotalConfirmed);
                });
                return getBarChart("Casos", casos, "blue");
            case "mortes":
                const mortes = [];
                dadosBasicosPaises.forEach((item) => {
                    mortes.push(item.TotalDeaths);
                });
                return getBarChart("Mortes", mortes, "red");
            case "recuperados":
                const recuperados = [];
                dadosBasicosPaises.forEach((item) => {
                    recuperados.push(item.TotalRecovered);
                });
                return getBarChart("Recuperados", recuperados, "green");
        
            default:
                break;
        }
    };

    const getBarChart = (titulo, dados, cor) => {
        const barChart = {
            labels: ["Brasil", "Índia", "Estados Unidos"],
            datasets: [
                {
                label: titulo,
                data: dados,
                backgroundColor: cor,
                },
            ],
        };

        return barChart;
    };

    const setDownloadSinglePais = (pais, dados) => {
        const dataCasos = [
            [`${pais} - quantidade de casos`],
            ["DATA", "QUANTIDADE"],
        ];

        const dataMortes = [
            [`${pais} - quantidade de mortes`],
            ["DATA", "QUANTIDADE"],
        ];

        const dataRecuperado = [
            [`${pais} - quantidade de recuperados`],
            ["DATA", "QUANTIDADE"],
        ];

        dados.forEach((item) => {
            let dia = item.Date.slice(8,10);
            let mes = item.Date.slice(5,7);
            let ano = item.Date.slice(0,4);
            let data = `${dia}/${mes}/${ano}`;
            let dadoCasos = item.Confirmed;
            let dadoMortes = item.Deaths;
            let dadoRecuperados = item.Recovered;
            dataCasos.push([data, dadoCasos]);
            dataMortes.push([data, dadoMortes]);
            dataRecuperado.push([data, dadoRecuperados]);
        });

        setCsvDataCasos(dataCasos);
        setCsvDataMortes(dataMortes);
        setCsvDataRecuperados(dataRecuperado);
    };

    const setDownloadComparativo = (dados) => {
        const dataComparativoCasos = [
            ["Comparativo - quantidade de casos`"],
            ["PAIS", "QUANTIDADE"],
        ];

        const dataComparativoMortes = [
            ["Mortes - quantidade de casos`"],
            ["PAIS", "QUANTIDADE"],
        ];

        const dataComparativoRecuperado = [
            ["Recuperados - quantidade de casos`"],
            ["PAIS", "QUANTIDADE"],
        ];

        dados.forEach((item) => {
            dataComparativoCasos.push([item.Country, item.TotalConfirmed]);
            dataComparativoMortes.push([item.Country, item.TotalDeaths]);
            dataComparativoRecuperado.push([item.Country, item.TotalRecovered]);
        });

        setCsvDataComparativoCasos(dataComparativoCasos);
        setCsvDataComparativoMortes(dataComparativoMortes);
        setCsvDataComparativoRecuperados(dataComparativoRecuperado);
    };    

    return (
        <div className="App">
            <h1>CovidBIE - Dados comparativos do Brasil, Índia e Estados Unidos</h1>
            <h4>Selecione uma opção abaixo:</h4>
            <div className="row botoes">
                <Button getPais={handleDadosBrasil}>Brasil</Button>
                <Button getPais={handleDataIndia}>Índia</Button>
                <Button getPais={handleDataEUA}>Estados Unidos</Button>
                <button type="button" className="btn btn-dark btn-lg" onClick={handleComparativo}>Comparativo</button>
            </div>
            
            { chartCurrentPaisCasos != "" && isSinglePais &&
                <div>
                    <div className="download">
                        <CSVLink data={csvDataCasos}>
                            <button type="button" className="btn btn-light">Download dos Dados - Casos Confirmados</button>
                        </CSVLink>
                    </div>
                    <LineChart dados={chartCurrentPaisCasos}/>
                </div>
            }

            { chartCurrentPaisMortes != "" && isSinglePais &&
                <div>
                    <div className="download">
                        <CSVLink data={csvDataMortes}>
                            <button type="button" className="btn btn-light">Download dos Dados - Mortes</button>
                        </CSVLink>
                    </div>
                    <LineChart dados={chartCurrentPaisMortes}/>
                </div>
            }

            { chartCurrentPaisRecuperados != "" && isSinglePais &&
                <div>
                    <div className="download">
                        <CSVLink data={csvDataRecuperados}>
                            <button type="button" className="btn btn-light">Download dos Dados - Recuperados</button>
                        </CSVLink>
                    </div>
                    <LineChart dados={chartCurrentPaisRecuperados}/>
                </div>
            }

            { chartComparativoCasos != "" && isComparativo &&
                <div>
                    <div className="download">
                        <CSVLink data={csvDataComparativoCasos}>
                            <button type="button" className="btn btn-light">Download dos Dados - Comparativo Casos</button>
                        </CSVLink>
                    </div>
                    <BarChart dados={chartComparativoCasos}/>
                </div>
            }

            { chartComparativoMortes != "" && isComparativo &&
                <div>
                    <div className="download">
                        <CSVLink data={csvDataComparativoMortes}>
                            <button type="button" className="btn btn-light">Download dos Dados - Comparativo Mortes</button>
                        </CSVLink>
                    </div>
                    <BarChart dados={chartComparativoMortes}/>
               </div>
            }

            { chartComparativoRecuperados != "" && isComparativo &&
                <div>
                    <div className="download">
                        <CSVLink data={csvDataComparativoRecuperados}>
                            <button type="button" className="btn btn-light">Download dos Dados - Comparativo Recuperados</button>
                        </CSVLink>
                    </div>
                    <BarChart dados={chartComparativoRecuperados}/>
                </div>
            }
        </div>
    );
}

export default App;
