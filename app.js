// 1. VARIÁVEIS GLOBAIS (Onde o App guarda os dados enquanto está aberto)
let valorAlvo = 0;
let limiteDeLances = 0;
let lances = [];

// 2. UTILITÁRIOS (Tratamento de texto e moeda)
function mascaraMoeda(input) {
    let v = input.value.replace(/\D/g, ""); // Remove letras
    v = (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    input.value = v;
}

function limparParaNumero(texto) {
    // Transforma "R$ 1.200,00" no número 1200.00 para podermos fazer contas
    return parseFloat(texto.replace(/[^\d,]/g, "").replace(",", "."));
}

// 3. FUNÇÕES DE FLUXO (O que o App faz)

function configurarLeilao() {
    valorAlvo = limparParaNumero(document.getElementById('valor-alvo-input').value);
    limiteDeLances = parseInt(document.getElementById('limite-lances').value);

    if (valorAlvo > 0) {
        document.getElementById('display-alvo').innerText = valorAlvo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        document.getElementById('total-lances').innerText = limiteDeLances;
        
        // Troca de telas (esconde setup, mostra lances)
        document.getElementById('setup-area').style.display = 'none';
        document.getElementById('lance-area').style.display = 'block';
    }
}

function registrarLance() {
    const nome = document.getElementById('nome-participante').value;
    const valor = limparParaNumero(document.getElementById('valor-lance').value);

    if (!nome || valor <= 0) return alert("Preencha tudo!");

    // A Mágica: calcula a distância do lance para o valor alvo
    const diferenca = Math.abs(valorAlvo - valor);

    // Salva o objeto no array de lances
    lances.push({ nome, valor, diferenca });

    document.getElementById('contador').innerText = lances.length;

    // Se atingir o limite, encerra e mostra o ranking
    if (lances.length >= limiteDeLances) {
        document.getElementById('btn-registrar').disabled = true;
        exibirRanking();
    }
}

// 4. ORQUESTRAÇÃO FINAL (Ranking)
function exibirRanking() {
    // O .sort organiza a lista: quem tem a menor 'diferenca' vai para o topo
    lances.sort((a, b) => a.diferenca - b.diferenca);

    let html = "<h3>📊 Resultado Final</h3>";
    lances.forEach((l, i) => {
        const itemClasse = i === 0 ? 'ranking-item vencedor' : 'ranking-item';
        html += `
            <div class="${itemClasse}">
                <strong>${i + 1}º ${l.nome}</strong>
                <span>Lance: R$ ${l.valor.toFixed(2)}</span>
            </div>`;
    });
    document.getElementById('ranking-area').innerHTML = html;
}