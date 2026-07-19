const header = document.querySelector("header");
const footer = document.querySelector("footer");

window.addEventListener("load", () => {
    header.innerHTML = `
        <a id="btn_principal" href="../index.html">
            <img src="../assets/Button.png" alt="Carr{In}hos" />
        </a>
        <nav id="centro_head">
            <a href="../index.html" id="btn_inicio">Início</a>
            <a href="../html/catalogo.html" id="btn_catalogo">Catálogo</a>
            <a href="#" id="btn_Reservas">Reservas</a>
            <a href="../html/sobre.html" id="btn_sobre">Sobre</a>
            <a href="../html/contato.html" id="btn_contato">Contato</a>
        </nav>
        <a id="dir_head" href="../html/catalogo.html">
            <img src="../assets/explorar.png" alt="Explorar" />
        </a>
    `;
const paginaAtual = window.location.pathname.split("/").pop();

const links = document.querySelectorAll("#centro_head a");
links.forEach(link => {
    const hrefPagina = link.getAttribute("href").split("/").pop();
    if (hrefPagina === paginaAtual) {
        link.classList.add("ativo");
    }
});

    footer.innerHTML = `
        <div class="footer-div">
            <div class="footer-coluna">
                <button class="footer-button">
                    <img src="../assets/Button.png" />
                    <a href="../index.html"></a>
                </button>
                <div class="footer-descricao">
                    <p>A única plataforma de aluguel de veículos icônicos do entretenimento mundial.</p>
                </div>
                <div class="footer-redes">
                    <button class="rede-social">IG</button>
                    <button class="rede-social">TW</button>
                    <button class="rede-social">YT</button>
                    <button class="rede-social">TK</button>
                </div>
            </div>
            <div class="footer-coluna">
                <h3>PLATAFORMA</h3>
                <nav>
                    <ul class="footer-lista">
                        <li><a href="../html/catalogo.html">Catálogo</a></li>
                        <li><a href="#">Minhas Reservas</a></li>
                        <li><a href="#">Como Funciona</a></li>
                        <li><a href="#">Preços</a></li>
                    </ul>
                </nav>
            </div>
            <div class="footer-coluna">
                <h3>EMPRESA</h3>
                <nav>
                    <ul class="footer-lista">
                        <li><a href="../html/sobre.html">Sobre Nós</a></li>
                        <li><a href="../html/contato.html">Contato</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Parceiros</a></li>
                    </ul>
                </nav>
            </div>
            <div class="footer-coluna">
                <h3>CONTATO</h3>
                <ul class="footer-contato">
                    <li><img src="../assets/icone_telefone.png" />+55 (11) 3456-7890</li>
                    <li><img src="../assets/icone_email.png" />oi@carrinhos.com.br</li>
                    <li>
                        <img src="../assets/icone_endereco.png" />Av. Cinematográfica, 1985 Vila Ficção —
                        São Paulo, SP
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div>
                <p>© 2025 Carr{In}hos — Todos os direitos reservados.</p>
                <p>Projeto educacional · Veículos fictícios</p>
            </div>
        </div>
    `;
});

async function buscarCarros() {
    try {
        const response = await fetch("http://localhost:3001/carros");
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const carros = await response.json();

        return carros;
    } catch (error) {
        console.error("Erro ao buscar carros:", error);
        throw error;
    }
}

async function buscarCarrosPaginado(pagina = 1, limite = 4){
    try{
        const url = montarUrl(filtro, pagina, limite);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }

        let carros = await response.json();
        const totalCarros = response.headers.get("X-Total-Count");

        if(filtro.disponibilidade === "indisponivel") {
            carros = carros.filter(carro => 
                carro.status_disponibilidade === "alugado" ||
                carro.status_disponibilidade === "manutencao"
            );
        }
        return {
            dados: carros,
            pagina,
            limite,
            totalCarros: parseInt(totalCarros),
            totalPaginas: Math.ceil(totalCarros / limite),
        };
    } catch (error) {
        console.error("Erro ao buscar carros:", error);
        throw error;
    }
}

function criarCard(carro) {
    const card = document.createElement("div");
    let disponibilidade = "botao-alugar"; let disponibilidadeTexto = "";
    if(carro.status_disponibilidade === "alugado" || carro.status_disponibilidade === "manutencao") {
        disponibilidade = "botao-indisponivel";
        disponibilidadeTexto = "Indisponível";
    } else {
        disponibilidadeTexto = "Alugar";
    }

    card.innerHTML = `<div class="card">
                <div class="card-imagem">
                    <img src=${carro.url_imagem}>
                    <p class="categoria" id="${carro.categoria}">${carro.categoria}</p>
                    <p class="status" id="${carro.status_disponibilidade}">${carro.status_disponibilidade}</p>
                    <p class="ranking">#${quantidadeCarros} da semana</p>
                </div>
                <div class="card-descricao">
                    <p id="card-titulo">${carro.nome}</p>
                    <p id="card-subtitulo">${carro.universo_origem}</p>
                    <div>
                        <p id="por-dia">por dia</p>
                        <h2 id="card-preco">${carro.valor_aluguel_dia}</h2>
                        <div class="card-aluguel">
                            <button class=${disponibilidade}><a href="#">${disponibilidadeTexto}</a></button>
                            <button class="botao-detalhes"><a href="#"><img src="../assets/Button_agenda.png"></a></button>
                        </div>
                    </div>
                </div>
            </div>`;
    return card;
}

async function criarCardHomePage() {
    const cards = document.querySelector(".cards-principal");
    const carros = await buscarCarrosPaginado(1, 4);
    let counter = 0;

    carros.dados.forEach(carro => {
        let card = document.createElement("div");
        if(counter == 0 || counter == 3){
            card.classList.add("card-principal1");
            card.innerHTML = `
                <div class="card-imagem-principal">
                    <img src="${carro.url_imagem}">
                </div>

                <div class="card-descricao-principal">
                    <h2>${carro.nome}</h2>
                    <p class="status-principal" id="${carro.status_disponibilidade}">${carro.status_disponibilidade}</p>
                </div>
            `
        }
        else {
            card.classList.add("card-principal2");
            card.innerHTML = `
                <div class="card-imagem-principal">
                    <img src="${carro.url_imagem}">
                </div>

                <div class="card-descricao-principal">
                    <h2>${carro.nome}</h2>
                    <p class="status-principal" id="${carro.status_disponibilidade}">${carro.status_disponibilidade}</p>
                </div>
            `
        }
        cards.appendChild(card);
        counter++;
    });
}

async function mostrarCarros(paginaAtual) {
    const main = document.querySelector(".main-veiculos");
    main.innerHTML = "";
    const response = await buscarCarrosPaginado(paginaAtual, 4);
    totalPaginas = response.totalPaginas;
    quantidadeCarros = 0;

    response.dados.forEach(carro => {
        quantidadeCarros++;
        const card = criarCard(carro);
        main.appendChild(card);
    });

    if(quantidadeVeiculos) {
        quantidadeVeiculos.innerText = `${quantidadeCarros} veículos encontrados`
    }
    
    criarPaginacao(totalPaginas);

}

function criarPaginacao(totalPaginas) {
    const paginacao = document.querySelector(".botoes-paginacao");

    if(!paginacao) return;
    paginacao.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement("button");
        botao.innerText = i;

        botao.addEventListener("click", () => {
            paginaAtual = i;
            mostrarCarros(paginaAtual);
        });

        paginacao.appendChild(botao);
    }
}

function montarUrl(filtro, pagina, limite) {
    let url = "http://localhost:3001/carros?";

    if(filtro.nome) {
        url += `nome_like=${encodeURIComponent(filtro.nome)}&`;
    }
    if(filtro.categoria != "todos") {
        url += `categoria=${filtro.categoria}&`;
    }
    if(filtro.disponibilidade === "disponivel") {
        url += `status_disponibilidade=${filtro.disponibilidade}&`;
    }

    url += `_page=${pagina}&_limit=${limite}`;

    return url;
}

function selecionarBotao(botaoSelecionado) {
    botoesFiltro.forEach(botao => {
        botao.classList.remove("ativo");
    });

    botaoSelecionado.classList.add("ativo");
}

function inicializarCatalogo() {

    mostrarCarros(paginaAtual);

    const botaoVoltarPagina = document.querySelector("#voltar-pagina");

    botaoVoltarPagina.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            mostrarCarros(paginaAtual);
        }
    });

    const botaoAvancarPagina = document.querySelector("#avancar-pagina");

    botaoAvancarPagina.addEventListener("click", () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            mostrarCarros(paginaAtual);
        }
    });

    const inputPesquisa = document.querySelector("#pesquisa");

    inputPesquisa.addEventListener("input", () => {
        filtro.nome = inputPesquisa.value;
        paginaAtual = 1;
        mostrarCarros(paginaAtual);
    });

    const botoesFiltro = document.querySelectorAll(".botoes-filtro");

    const botaoDisponivel = document.querySelector("#filtro-disponivel");
    const botaoIndisponivel = document.querySelector("#filtro-indisponivel");
    const botaoTodos = document.querySelector("#filtro-todos");
    const botaoFilme = document.querySelector("#filtro-filme");
    const botaoSerie = document.querySelector("#filtro-serie");
    const botaoDesenho = document.querySelector("#filtro-desenho");

    botaoDisponivel.addEventListener("click", () => {
        filtro.disponibilidade = "disponivel";
        paginaAtual = 1;
        selecionarBotao(botaoDisponivel);
        mostrarCarros(paginaAtual);
    });

    botaoIndisponivel.addEventListener("click", () => {
        filtro.disponibilidade = "indisponivel";
        paginaAtual = 1;
        selecionarBotao(botaoIndisponivel);
        mostrarCarros(paginaAtual);
    });

    botaoTodos.addEventListener("click", () => {
        filtro.disponibilidade = "todos";
        filtro.categoria = "todos";
        paginaAtual = 1;
        selecionarBotao(botaoTodos);
        mostrarCarros(paginaAtual);
    });

    botaoFilme.addEventListener("click", () => {
        filtro.categoria = "filme";
        paginaAtual = 1;
        selecionarBotao(botaoFilme);
        mostrarCarros(paginaAtual);
    });

    botaoSerie.addEventListener("click", () => {
        filtro.categoria = "série";
        paginaAtual = 1;
        selecionarBotao(botaoSerie);
        mostrarCarros(paginaAtual);
    });

    botaoDesenho.addEventListener("click", () => {
        filtro.categoria = "desenho";
        paginaAtual = 1;
        selecionarBotao(botaoDesenho);
        mostrarCarros(paginaAtual);
    });
}

async function inicializarHome() {
    await criarCardHomePage();
    await mostrarCarros(1);
}


let paginaAtual = 1;
let totalPaginas = 5;
const limite = 4;
let quantidadeCarros = 0;

const filtro = {
    nome: "",
    categoria: "todos",
    disponibilidade: "todos"
};

const quantidadeVeiculos = document.querySelector(".quantidade-veiculos");

if (document.querySelector(".cards-principal")) {
    inicializarHome();
}

if (document.querySelector("#pesquisa")) {
    inicializarCatalogo();
}