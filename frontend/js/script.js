// SIMULAÇÃO DO BANCO DE DADOS (Requisito 8º)
// Os dados devem ter: Marca, Modelo, Ano, Preço, Localização e Fotos.
// SIMULAÇÃO DO BANCO DE DADOS (Requisito 8º)
const veiculos = [
    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        ano: 2022,
        preco: 120000,
        localizacao: "São Paulo, SP",
        descricao: "Carro em ótimo estado, baixa quilometragem.",
        foto: "carro1.jpg",
        fabricante: "Toyota", // NOVO
        cambio: "automatico"  // NOVO
    },
    {
        id: 2,
        marca: "Honda",
        modelo: "Civic",
        ano: 2019,
        preco: 95000,
        localizacao: "Campinas, SP",
        descricao: "Completo e com todas as revisões em dia.",
        foto: "carro2.jpg",
        fabricante: "Honda",  // NOVO
        cambio: "manual"     // NOVO
    },
    {
        id: 3,
        marca: "Chevrolet",
        modelo: "Onix",
        ano: 2023,
        preco: 75000,
        localizacao: "Rio de Janeiro, RJ",
        descricao: "Seminovo, econômico e ideal para a cidade.",
        foto: "carro3.jpg",
        fabricante: "Chevrolet", // NOVO
        cambio: "manual"       // NOVO
    }
    // Adicione mais veículos de teste se desejar, com diferentes fabricantes/câmbios
];
// ... restante do script.js

// Função para renderizar os veículos na página
function renderizarVeiculos(listaDeVeiculos) {
    const listaHtml = document.querySelector('.vehicle-list');
    listaHtml.innerHTML = ''; // Limpa a lista antes de adicionar novos

    if (listaDeVeiculos.length === 0) {
        listaHtml.innerHTML = '<p>Nenhum veículo encontrado para esta busca.</p>';
        return;
    }

    listaDeVeiculos.forEach(veiculo => {
        // Cria um card para cada veículo
        const card = document.createElement('div');
        card.classList.add('vehicle-card');
        
        // Formata o preço para o padrão brasileiro
        const precoFormatado = veiculo.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Conteúdo do card (Requisito 6º: fotos, preços e descrição)
        card.innerHTML = `
            <img src="img/${veiculo.foto}" alt="${veiculo.marca} ${veiculo.modelo}">
            <h4>${veiculo.marca} ${veiculo.modelo} (${veiculo.ano})</h4>
            <p class="price">${precoFormatado}</p>
            <p class="location">${veiculo.localizacao}</p>
            <p class="description">${veiculo.descricao.substring(0, 50)}...</p>
            <button onclick="alert('Detalhes do Veículo ID: ${veiculo.id}')">Ver Detalhes</button>
        `;
        
        listaHtml.appendChild(card);
    });
}

// Chamar a função ao carregar a página (mostra todos por padrão)
renderizarVeiculos(veiculos);


// AQUI VAI O CÓDIGO DO PASSO 5.1 (Lista 'veiculos') E O PASSO 5.2 (Função 'renderizarVeiculos')

// ----------------------------------------------------------------------
// LÓGICA DE FILTRO UNIFICADA (RF 4º e Localidade)
// ----------------------------------------------------------------------

const filterForm = document.getElementById('filter-form');

filterForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Pega os valores selecionados nos filtros:
    
    // 1. Localidade (NOVO: Agora unificado!)
    const localidadeSelecionada = document.getElementById('city-state').value.toLowerCase();
    
    // 2. Fabricante
    const fabricanteSelecionado = document.getElementById('fabricante').value;

    // 3. Ano (Tratamento para evitar problemas com NaN)
    const anoElement = document.getElementById('ano-fab');
    const anoSelecionado = anoElement.value ? parseInt(anoElement.value) : ''; 
    
    // 4. Câmbio
    const cambioSelecionado = document.getElementById('cambio').value;

    // Filtra a lista de veículos, exigindo que o carro passe em TODOS os critérios
    const resultadosFiltrados = veiculos.filter(veiculo => {
        let passaNoFiltro = true;

        // CRITÉRIO 1: Localidade
        // Se algo foi digitado E a localização do veículo não contém o termo digitado, o filtro falha.
        if (localidadeSelecionada && !veiculo.localizacao.toLowerCase().includes(localidadeSelecionada)) {
            passaNoFiltro = false;
        }

        // CRITÉRIO 2: Fabricante
        // Se um fabricante foi selecionado E não for igual ao do veículo, o filtro falha.
        if (fabricanteSelecionado && veiculo.fabricante !== fabricanteSelecionado) {
            passaNoFiltro = false;
        }

        // CRITÉRIO 3: Ano
        // Se um ano foi selecionado E não for igual ao do veículo, o filtro falha.
        if (anoSelecionado !== '' && veiculo.ano !== anoSelecionado) {
            passaNoFiltro = false;
        }

        // CRITÉRIO 4: Câmbio
        if (cambioSelecionado && veiculo.cambio !== cambioSelecionado) {
            passaNoFiltro = false;
        }

        return passaNoFiltro;
    });

    // Exibe os resultados
    renderizarVeiculos(resultadosFiltrados);
    document.querySelector('.vehicle-list h3').textContent = "Resultados da Busca Detalhada";
});