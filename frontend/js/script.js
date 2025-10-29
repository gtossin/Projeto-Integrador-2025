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

// ----------------------------------------------------------------------
// GESTÃO DE ESTADO DE LOGIN (RF 1º)
// ----------------------------------------------------------------------

function updateNavigation() {
    const nav = document.querySelector('header nav');
    // Verifica se há algum usuário logado no localStorage
    const loggedInUser = localStorage.getItem('loggedInUser'); 
    
    // Limpa a navegação atual
    nav.innerHTML = ''; 

    // Adiciona o link principal
    nav.innerHTML += '<a href="index.html">Página Inicial</a>';

    if (loggedInUser) {
        // Se o usuário está logado, mostra Anunciar e Perfil/Sair
        nav.innerHTML += '<a href="anunciar.html">Anunciar</a>';
        nav.innerHTML += '<a href="perfil.html">Meu Perfil</a>';
        nav.innerHTML += '<a href="#" id="logout-button">Sair</a>';
    } else {
        // Se NÃO está logado, mostra as opções de Login/Cadastro
        nav.innerHTML += '<a href="login.html">Login/Cadastro</a>';
    }
}

// Adicionar a lógica de sair (logout)
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser'); // Remove o status de login
        alert('Você saiu da sua conta.');
        window.location.href = 'index.html'; // Redireciona para a home
    });
}

// ... (Restante do seu script.js, incluindo filtros e cadastro)

// ----------------------------------------------------------------------
// LÓGICA DE FILTRO UNIFICADA (RF 4º e Localidade) - CORRIGIDA
// ----------------------------------------------------------------------
const filterForm = document.getElementById('filter-form');

// 🎯 AGORA SÓ ADICIONA O LISTENER SE O FORMULÁRIO EXISTIR NA PÁGINA 🎯
if (filterForm) { 
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
}

// ----------------------------------------------------------------------
// SIMULAÇÃO DE CADASTRO (RF 1º)
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// SIMULAÇÃO DE CADASTRO (RF 1º) - Função Chamável pelo HTML
// ----------------------------------------------------------------------
function handleCadastro(event) {
    // ESSA É A CHAVE! O HTML chama esta função, e ela impede o submit padrão.
    event.preventDefault(); 

    // 1. Pega os valores dos campos (do cadastro.html)
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 2. Validação básica (Senhas são iguais?)
    if (password !== confirmPassword) {
        alert('Erro: As senhas digitadas não são iguais. Por favor, tente novamente.');
        return; // Interrompe o processo
    }
    
    // 3. Simulação de salvamento em "Banco de Dados" (usando localStorage)
    
    // CUIDADO: Em um projeto real, senhas NUNCA devem ser salvas em texto puro!
    const novoUsuario = {
        name: name,
        email: email,
        password: password // Simulação, apenas para fins de teste Front-end
    };

    // 4. Salvar no localStorage:

    // a) Tenta buscar a lista de usuários existente, ou inicia uma nova
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // b) Verifica se o e-mail já está cadastrado
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert('Erro: Este e-mail já está cadastrado. Tente fazer login.');
        return;
    }

    // c) Adiciona o novo usuário à lista
    users.push(novoUsuario);

    // d) Salva a lista atualizada de volta no localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('🎉 Cadastro realizado com sucesso! Faça login para continuar.');

    // Redireciona para a tela de login
    window.location.href = 'login.html';
}

// ----------------------------------------------------------------------
// SIMULAÇÃO DE LOGIN (RF 1º)
// ----------------------------------------------------------------------
function handleLogin(event) {
event.preventDefault(); 

    // 1. Pega os valores e remove espaços extras com .trim()
    const email = document.getElementById('email').value.trim(); 
    const password = document.getElementById('password').value; // Senha não precisa de trim

    // 2. Tenta buscar a lista de usuários
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 3. Busca o usuário que corresponde. CRUCIAL: usa .trim() no e-mail do cadastro também!
    const foundUser = users.find(user => 
        // Compara o e-mail digitado com o e-mail SALVO (com .trim() para limpar)
        user.email.trim() === email && user.password === password
    );

    if (foundUser) {
        // Se o usuário foi encontrado:

        // Salva o status de login no localStorage (simulando a sessão)
        // Guardamos o nome e email do usuário logado para usar no Perfil
        localStorage.setItem('loggedInUser', JSON.stringify({
            name: foundUser.name,
            email: foundUser.email
        }));

        alert(`🎉 Login realizado com sucesso, ${foundUser.name}!`);

        // Redireciona para a página inicial
        window.location.href = 'index.html';
    } else {
        // Se o usuário não foi encontrado:
        alert('Erro: E-mail ou senha incorretos. Tente novamente.');
    }
}


// ----------------------------------------------------------------------
// PREENCHIMENTO DO PERFIL (RF 2º) - CORRIGIDO
// ----------------------------------------------------------------------
function loadProfileData() {
    const perfilForm = document.getElementById('perfil-form');
    
    // 🎯 PONTO DE VERIFICAÇÃO 1: A FUNÇÃO FOI CHAMADA? 🎯
    console.log("loadProfileData: Função Iniciada"); 

    if (!perfilForm) return; 

    // 🎯 PONTO DE VERIFICAÇÃO 2: O FORMULÁRIO FOI ENCONTRADO? 🎯
    console.log("loadProfileData: Formulário Encontrado!"); 

    const loggedInUserString = localStorage.getItem('loggedInUser');

    if (loggedInUserString) {
        const user = JSON.parse(loggedInUserString);

        // 🎯 PONTO DE VERIFICAÇÃO 3: OS DADOS ESTÃO SENDO LIDOS? 🎯
        console.log("Dados do usuário:", user); 
        
        // Remove espaços extras antes de preencher para evitar problemas futuros
        document.getElementById('nome').value = user.name.trim() || ''; 
        document.getElementById('email').value = user.email.trim() || ''; 
        
        document.querySelector('.perfil-container h2').textContent = `Meu Perfil - Olá, ${user.name.split(' ')[0]}!`;
        
    } else {
        // ... (resto do código)
    }
}

// ----------------------------------------------------------------------
// LÓGICA DE EDIÇÃO DE PERFIL (RF 2º) - CORRIGIDO
// ----------------------------------------------------------------------
function handleProfileEdit(event) {
    event.preventDefault(); 

    // 1. Pega os novos valores e aplica .trim() para limpar
    const newName = document.getElementById('nome').value.trim();
    const newEmail = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('senha').value;

    // 2. Pega o e-mail logado e também aplica .trim() na chave de busca
    const loggedUserString = localStorage.getItem('loggedInUser');
    if (!loggedUserString) return;
    
    // USAMOS .trim() AQUI
    const oldEmail = JSON.parse(loggedUserString).email.trim(); 

    // 3. Busca a lista completa de usuários
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // 4. Encontra o índice do usuário a ser atualizado
    // USAMOS .trim() AQUI TAMBÉM para garantir que a comparação com a base seja exata
    const userIndex = users.findIndex(user => user.email.trim() === oldEmail); 

    if (userIndex !== -1) {
        // Se encontrou o usuário:
        
        // a) Atualiza os dados (usando os valores com .trim())
        users[userIndex].name = newName;
        users[userIndex].email = newEmail;
        
        if (newPassword) {
            users[userIndex].password = newPassword;
        }

        // b) Salva a lista completa e o status de login atualizado
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify({
            name: newName,
            email: newEmail
        }));

        alert('✅ Perfil atualizado com sucesso! (Novo nome: ' + newName + ')');
        
        // Recarrega a página para atualizar o menu de navegação
        window.location.reload(); 
        
    } else {
        alert('Erro: Usuário não encontrado na base de dados para atualização.');
    }
}




// ======================================================================
// GARANTIR EXECUÇÃO APÓS CARREGAMENTO COMPLETO DA PÁGINA
// Este bloco deve ser o ÚLTIMO no seu arquivo.
// ======================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ATUALIZA O MENU DE NAVEGAÇÃO (Login/Logout/Perfil)
    const navFunc = window.updateNavigation;
    if (typeof navFunc === 'function') {
        navFunc();
    }
    
    // CARREGA OS DADOS DO PERFIL (se estivermos na página perfil.html)
    const loadFunc = window.loadProfileData;
    if (typeof loadFunc === 'function') {
        loadFunc();
    }
    
    // RENDERIZA OS VEÍCULOS (se estivermos na página inicial)
    const vehicleList = document.querySelector('.vehicle-list');
    const renderFunc = window.renderizarVeiculos;
    if (vehicleList && typeof renderFunc === 'function') {
        renderFunc(veiculos); 
    }
    
    // Adicionar a lógica de Logout APÓS a navegação ter sido atualizada
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            alert('Você saiu da sua conta.');
            window.location.href = 'index.html'; 
        });
    }
});