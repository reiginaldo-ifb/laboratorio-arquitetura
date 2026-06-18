// script principal do lab digital
import { Calculadora } from './Calculadora.js';
import { Logica } from './Logica.js';
import { ApiService } from './ApiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const calc = new Calculadora();
    const log = new Logica();
    const api = new ApiService();

    // --- navegaçao entre abas ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-section');
            sections.forEach(s => s.classList.add('hidden'));
            document.getElementById(target).classList.remove('hidden');
            
            // carregamento da api
            if(target === 'api-extra') carregarApi();
        });
    });

    // -parte de conversão de base
    const btnConverter = document.getElementById('btnConverter');
    btnConverter.addEventListener('click', () => {
        const valorInput = document.getElementById('valorInput').value.trim();
        const bOrigem = parseInt(document.getElementById('baseOrigem').value);
        const bDestino = parseInt(document.getElementById('baseDestino').value);
        const display = document.getElementById('resultadoBases');

        if (!valorInput) return;

        try {
            const numDecimal = calc.paraDecimal(valorInput, bOrigem);
            if (isNaN(numDecimal)) {
                display.innerHTML = "<p style='color:red'>Valor inválido!</p>";
                return;
            }

            const dados = calc.converter(numDecimal, bDestino);
            const htmlPassos = dados.passos.map(p => `
                <div class="passo-item">
                    ${p.dividendo} ÷ ${p.divisor} = ${p.quociente} | Resto: <b>${p.resto}</b>
                </div>
            `).join('');

            display.innerHTML = `
                <div class="resultado-container">
                    <h3>Resultado: <span style="color:var(--secondary)">${dados.resultado}</span></h3>
                    <div style="margin-top:15px">${htmlPassos}</div>
                </div>
            `;
        } catch (e) {
            display.innerHTML = "Erro na conversão.";
        }
    });

    // --- sobre a tabela verdade, podia ser melhor ---
    const btnTabela = document.getElementById('btnGerarTabela');
    btnTabela.addEventListener('click', () => {
        const expressaoOriginal = document.getElementById('expressaoInput').value.trim();
        const exp = expressaoOriginal.toUpperCase();
        const display = document.getElementById('resultadoLogica');
        
        if (!expressaoOriginal) return;

        const varsAtivas = [..."ABCD"].filter(v => exp.includes(v));
        const vList = varsAtivas.length ? varsAtivas : ["A", "B"];
        const combinacoes = log.gerarCombinacoes(vList.length);

        const linhasHTML = combinacoes.map(c => {
            const res = log.resolverExpressao(exp, c);
            const celulas = vList.map(v => `<td>${c[v]}</td>`).join('');
            return `<tr>${celulas}<td class="resultado-bit">${res}</td></tr>`;
        }).join('');

        display.innerHTML = `
            <table class="tabela-verdade">
                <thead>
                    <tr>
                        ${vList.map(v => `<th>${v}</th>`).join('')}
                        <th>${expressaoOriginal}</th> 
                    </tr>
                </thead>
                <tbody>${linhasHTML}</tbody>
            </table>
        `;
    });

    // ---tentativa de Layout 3 Colunas e fundo de outra cor ---
    async function carregarApi() {
        const display = document.getElementById('api-data');
        display.innerHTML = "<em>Buscando dados da API...</em>";
        
        try {
            const racas = await api.buscarRacas();
            const filtradas = racas.filter(r => r.length <= 5);
            
            // tentativa de card  para evitar duplicação de bordas
            const cardsHTML = filtradas.map(r => `
                <div class="raca-card">
                    <strong>Raça:</strong> ${r.toUpperCase()}
                </div>
            `).join('');
            
            display.innerHTML = `
                <div class="api-card">
                    <div class="api-header">
                        <h3>Integração de Sistemas (Consumo de API)</h3>
                        <p>Dados recuperados via HTTPS e processados com Programação Funcional.</p>
                    </div>
                    <div class="api-grid-v2">
                        ${cardsHTML}
                    </div>
                    <div class="total-info">
                        Total de raças curtas encontradas: ${filtradas.length}
                    </div>
                </div>
            `;
        } catch (error) {
            display.innerHTML = "<p>Erro ao conectar com a API de raças.</p>";
        }
    }
});