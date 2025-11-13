// ======================================================================
// SIMULAÇÃO DO BANCO DE DADOS (FRONT-END)
// Requisito Funcional (RF 8º): Estrutura de dados básica para veículos.
// Os dados devem conter: Marca, Modelo, Ano, Preço, Localização e Foto.
// ======================================================================
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
        fabricante: "Toyota", 
        cambio: "automatico"  
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
        fabricante: "Honda",  
        cambio: "manual"     
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
        fabricante: "Chevrolet", 
        cambio: "manual"       
    }
    // Incluir mais veículos de teste para simulação.
];
// ... restante do script.js

// ----------------------------------------------------------------------
// RENDERIZAÇÃO E EXIBIÇÃO DE ANÚNCIOS (RF 6º)
// ----------------------------------------------------------------------
/**
 * Função para renderizar os veículos na lista principal da página.
 * @param {Array<Object>} listaDeVeiculos - Lista de veículos a serem exibidos.
 */
function renderizarVeiculos(listaDeVeiculos) {
    const listaHtml = document.querySelector('.vehicle-list');
    // Limpa o conteúdo anterior da lista
    listaHtml.innerHTML = ''; 

    // Exibe mensagem se nenhum veículo for encontrado
    if (listaDeVeiculos.length === 0) {
        listaHtml.innerHTML = '<p>Nenhum veículo encontrado para esta busca.</p>';
        return;
    }

    listaDeVeiculos.forEach(veiculo => {
        // 1. Cria o elemento principal do card
        const card = document.createElement('div');
        card.classList.add('vehicle-card');
        
        // 2. Formata o preço para o padrão brasileiro (R$ 00,00)
        const precoFormatado = veiculo.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // 3. Monta o conteúdo do card (incluindo foto, preço e descrição - RF 6º)
        card.innerHTML = `
            <img src="img/${veiculo.foto}" alt="${veiculo.marca} ${veiculo.modelo}">
            <h4>${veiculo.marca} ${veiculo.modelo} (${veiculo.ano})</h4>
            <p class="price">${precoFormatado}</p>
            <p class="location">${veiculo.localizacao}</p>
            <p class="description">${veiculo.descricao.substring(0, 50)}...</p>
            <button onclick="alert('Detalhes do Veículo ID: ${veiculo.id}')">Ver Detalhes</button>
        `;
        
        // 4. Adiciona o card à lista
        listaHtml.appendChild(card);
    });
}

// ----------------------------------------------------------------------
// GESTÃO DE ESTADO DE LOGIN E LOGOUT (RF 1º)
// ----------------------------------------------------------------------

/**
 * Atualiza o menu de navegação com base no estado de login do usuário.
 */
function updateNavigation() {
    const nav = document.querySelector('header nav');
    // Verifica o status de login no armazenamento local
    const loggedInUser = localStorage.getItem('loggedInUser'); 
    
    // Limpa o conteúdo de navegação atual
    nav.innerHTML = ''; 

    // Adiciona o link de Página Inicial (sempre visível)
    nav.innerHTML += '<a href="index.html">Página Inicial</a>';

    if (loggedInUser) {
        // Se o usuário está logado, exibe opções de Vendedor/Perfil
        nav.innerHTML += '<a href="anunciar.html">Anunciar</a>';
        nav.innerHTML += '<a href="perfil.html">Meu Perfil</a>';
        nav.innerHTML += '<a href="#" id="logout-button">Sair</a>';
    } else {
        // Se não está logado, exibe opções de Acesso
        nav.innerHTML += '<a href="login.html">Login/Cadastro</a>';
    }
}

// Lógica para o botão de Sair (Logout)
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser'); // Remove o token/status de login
        alert('Você saiu da sua conta.');
        window.location.href = 'index.html'; // Redireciona
    });
}

// ... (Restante do seu script.js)

// ----------------------------------------------------------------------
// LÓGICA DE FILTRO UNIFICADA (RF 4º e RF 3º - Localidade)
// ----------------------------------------------------------------------
const filterForm = document.getElementById('filter-form');

// Adiciona o listener de submissão APENAS se o formulário existir na página
if (filterForm) { 
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // 1. Coleta e normaliza os valores dos filtros:
        
        // Localidade (RF 3º)
        const localidadeSelecionada = document.getElementById('city-state').value.toLowerCase();
        
        // Fabricante (RF 4º)
        const fabricanteSelecionado = document.getElementById('fabricante').value;

        // Ano (Tratamento de valor nulo/inválido)
        const anoElement = document.getElementById('ano-fab');
        const anoSelecionado = anoElement.value ? parseInt(anoElement.value) : ''; 
        
        // Câmbio (RF 4º)
        const cambioSelecionado = document.getElementById('cambio').value;

        // 2. Filtra a lista de veículos (todos os critérios devem ser TRUE)
        const resultadosFiltrados = veiculos.filter(veiculo => {
            let passaNoFiltro = true;

            // CRITÉRIO A: Localidade (Busca parcial)
            if (localidadeSelecionada && !veiculo.localizacao.toLowerCase().includes(localidadeSelecionada)) {
                passaNoFiltro = false;
            }

            // CRITÉRIO B: Fabricante (Busca por valor exato)
            if (fabricanteSelecionado && veiculo.fabricante !== fabricanteSelecionado) {
                passaNoFiltro = false;
            }

            // CRITÉRIO C: Ano (Busca por valor exato)
            if (anoSelecionado !== '' && veiculo.ano !== anoSelecionado) {
                passaNoFiltro = false;
            }

            // CRITÉRIO D: Câmbio (Busca por valor exato)
            if (cambioSelecionado && veiculo.cambio !== cambioSelecionado) {
                passaNoFiltro = false;
            }

            return passaNoFiltro;
        });

        // 3. Exibe os resultados na tela
        renderizarVeiculos(resultadosFiltrados);
        document.querySelector('.vehicle-list h3').textContent = "Resultados da Busca Detalhada";
    });
}

// ----------------------------------------------------------------------
// SIMULAÇÃO DE CADASTRO DE USUÁRIO (RF 1º)
// ----------------------------------------------------------------------
/**
 * Lida com a submissão do formulário de cadastro, simulando a criação de um novo usuário.
 * @param {Event} event - O evento de submissão do formulário.
 */
function handleCadastro(event) {
    // Impede o comportamento padrão de envio do formulário (que recarregaria a página)
    event.preventDefault(); 

    // 1. Coleta os valores dos campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 2. Validação: Checa se as senhas coincidem
    if (password !== confirmPassword) {
        alert('Erro: As senhas digitadas não são iguais. Por favor, tente novamente.');
        return; // Interrompe
    }
    
    // 3. Monta o objeto do novo usuário
    // NOTA: Em um projeto real, senhas NUNCA devem ser salvas em texto puro!
    const novoUsuario = {
        name: name,
        email: email,
        password: password // Simulação para fins de teste Front-end
    };

    // 4. Lógica de "salvamento" no localStorage (simulando um Banco de Dados)
    // a) Tenta carregar a lista de usuários existente
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // b) Verifica se o e-mail já existe
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert('Erro: Este e-mail já está cadastrado. Tente fazer login.');
        return;
    }

    // c) Adiciona o novo usuário
    users.push(novoUsuario);

    // d) Salva a lista atualizada
    localStorage.setItem('users', JSON.stringify(users));

    alert('🎉 Cadastro realizado com sucesso! Faça login para continuar.');

    // 5. Redireciona
    window.location.href = 'login.html';
}

// ----------------------------------------------------------------------
// SIMULAÇÃO DE LOGIN DE USUÁRIO (RF 1º)
// ----------------------------------------------------------------------
/**
 * Lida com a submissão do formulário de login, simulando a autenticação.
 * @param {Event} event - O evento de submissão do formulário.
 */
function handleLogin(event) {
    event.preventDefault(); 

    // 1. Coleta os valores (usa .trim() para remover espaços extras no e-mail)
    const email = document.getElementById('email').value.trim(); 
    const password = document.getElementById('password').value; 

    // 2. Busca a lista de usuários "cadastrados"
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 3. Tenta encontrar um usuário que corresponda ao e-mail E à senha
    const foundUser = users.find(user => 
        // Compara e-mail (normalizado com .trim()) e senha
        user.email.trim() === email && user.password === password
    );

    if (foundUser) {
        // 4. Login Sucedido: Salva a sessão no localStorage
        localStorage.setItem('loggedInUser', JSON.stringify({
            name: foundUser.name,
            email: foundUser.email
        }));

        alert(`🎉 Login realizado com sucesso, ${foundUser.name}!`);

        // 5. Redireciona para a página inicial
        window.location.href = 'index.html';
    } else {
        // 4. Login Falhou
        alert('Erro: E-mail ou senha incorretos. Tente novamente.');
    }
}


// ----------------------------------------------------------------------
// PREENCHIMENTO DO PERFIL (RF 2º)
// ----------------------------------------------------------------------
/**
 * Carrega e exibe os dados do usuário logado no formulário de perfil.
 */
function loadProfileData() {
    const perfilForm = document.getElementById('perfil-form');
    
    // Aborta se a função for chamada em uma página sem o formulário de perfil
    if (!perfilForm) return; 

    const loggedInUserString = localStorage.getItem('loggedInUser');

    if (loggedInUserString) {
        const user = JSON.parse(loggedInUserString);

        // Preenche os campos do formulário com os dados do usuário
        document.getElementById('nome').value = user.name.trim() || ''; 
        document.getElementById('email').value = user.email.trim() || ''; 
        
        // Atualiza o título da página
        document.querySelector('.perfil-container h2').textContent = `Meu Perfil - Olá, ${user.name.split(' ')[0]}!`;
        
    } else {
        // Se não houver usuário logado, você pode redirecionar ou mostrar uma mensagem
    }
}

// ----------------------------------------------------------------------
// LÓGICA DE EDIÇÃO/ATUALIZAÇÃO DE PERFIL (RF 2º)
// ----------------------------------------------------------------------
/**
 * Lida com a submissão do formulário de edição de perfil.
 * @param {Event} event - O evento de submissão do formulário.
 */
function handleProfileEdit(event) {
    event.preventDefault(); 

    // 1. Coleta os novos valores, aplicando .trim()
    const newName = document.getElementById('nome').value.trim();
    const newEmail = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('senha').value;

    // 2. Obtém o e-mail original (chave de busca)
    const loggedUserString = localStorage.getItem('loggedInUser');
    if (!loggedUserString) return;
    
    const oldEmail = JSON.parse(loggedUserString).email.trim(); 

    // 3. Busca a lista completa de usuários
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // 4. Encontra o índice do usuário a ser atualizado (usa .trim() para busca)
    const userIndex = users.findIndex(user => user.email.trim() === oldEmail); 

    if (userIndex !== -1) {
        // 5. Atualiza os dados do usuário na lista completa
        users[userIndex].name = newName;
        users[userIndex].email = newEmail;
        
        // Atualiza a senha APENAS se um novo valor foi fornecido
        if (newPassword) {
            users[userIndex].password = newPassword;
        }

        // 6. Salva a lista completa e o status de login atualizado
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify({
            name: newName,
            email: newEmail
        }));

        alert('✅ Perfil atualizado com sucesso! (Novo nome: ' + newName + ')');
        
        // Recarrega a página para refletir as alterações no menu/título
        window.location.reload(); 
        
    } else {
        alert('Erro: Usuário logado não encontrado na base de dados para atualização.');
    }
}


// ----------------------------------------------------------------------
// LÓGICA DE SIMULAÇÃO DE ANÚNCIO (RF 8º)
// ----------------------------------------------------------------------
/**
 * Lida com a submissão do formulário de anúncio de veículo.
 * @param {Event} event - O evento de submissão do formulário.
 */
function handleAnuncio(event) {
    event.preventDefault(); // Impede o recarregamento da página

    // 1. Validação de Login: Coleta dos dados do vendedor
    const loggedUserString = localStorage.getItem('loggedInUser');
    if (!loggedUserString) {
        alert("Erro: Você precisa estar logado para publicar um anúncio.");
        return;
    }
    const user = JSON.parse(loggedUserString);

    // 2. Validação de Campos Essenciais (Preço e Selects)
    const precoValue = document.getElementById('preco').value;
    const precoFloat = parseFloat(precoValue);
    
    // Preço deve ser um número válido
    if (isNaN(precoFloat)) {
        alert("Erro de Validação: Por favor, insira um preço válido (apenas números).");
        return; 
    }

    // Combustível e Câmbio devem ser selecionados
    const combustivelValue = document.getElementById('combustivel').value;
    const cambioTipoValue = document.getElementById('cambio_tipo').value;

    if (!combustivelValue || !cambioTipoValue) {
        alert("Erro de Validação: Por favor, selecione o Combustível e o Tipo de Câmbio.");
        return;
    }
    
    
    // 3. Monta o objeto do novo anúncio
    const novoAnuncio = {
        // Bloco A: Identificação e Preço (Essenciais)
        id: Date.now(), // ID único (simulação)
        vendedorEmail: user.email,
        marca: document.getElementById('marca').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        versao: document.getElementById('versao').value.trim(),
        anoModelo: document.getElementById('ano_modelo').value.trim(),
        preco: precoFloat, 
        localizacao: document.getElementById('localizacao').value.trim(),
        
        // Bloco B: Mecânica e Filtros
        combustivel: combustivelValue,
        litragem: document.getElementById('litragem').value.trim(),
        cambioTipo: cambioTipoValue,
        tracao: document.getElementById('tracao').value.trim(),

        // Bloco C: Acessórios e Descrição
        descricao: document.getElementById('descricao').value.trim(),
        seguranca: document.getElementById('seguranca').value.trim(),
        conforto: document.getElementById('conforto').value.trim(),
        infotenimento: document.getElementById('infotenimento').value.trim(),
        
        // Bloco D: Fotos (Simulação)
        fotosCount: document.getElementById('fotos').files.length || 0,
        status: 'Ativo' // Status inicial do anúncio (simulação)
    };

    // 4. Simulação de salvamento (Adiciona ao array de anúncios no localStorage)
    let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    anuncios.push(novoAnuncio);
    localStorage.setItem('anuncios', JSON.stringify(anuncios));

    // 5. Feedback e Redirecionamento
    alert('✅ Anúncio Publicado com Sucesso! (' + novoAnuncio.marca + ' ' + novoAnuncio.modelo + ')');
    window.location.href = 'perfil.html';
}

// ======================================================================
// GARANTIR EXECUÇÃO APÓS CARREGAMENTO COMPLETO DA PÁGINA
// Este bloco garante que o script seja executado apenas após o DOM estar pronto.
// ======================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Executa a função de atualização do menu de navegação
    const navFunc = window.updateNavigation;
    if (typeof navFunc === 'function') {
        navFunc();
    }
    
    // Executa o carregamento dos dados do perfil, se o formulário existir
    const loadFunc = window.loadProfileData;
    if (typeof loadFunc === 'function') {
        loadFunc();
    }
    
    // Executa a renderização inicial dos veículos, se a lista estiver presente
    const vehicleList = document.querySelector('.vehicle-list');
    const renderFunc = window.renderizarVeiculos;
    if (vehicleList && typeof renderFunc === 'function') {
        renderFunc(veiculos); 
    }
    
    // Re-adiciona a lógica de Logout APÓS a navegação ter sido atualizada
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