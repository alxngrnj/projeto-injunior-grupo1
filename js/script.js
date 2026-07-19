const header = document.querySelector("header");
const footer = document.querySelector("footer");

window.addEventListener("load", () => {
    header.innerHTML = `
        <a id="btn_principal" href="/index.html">
            <img src="/assets/Button.png" alt="Carr{In}hos" />
        </a>
        <nav id="centro_head">
            <a href="/index.html" id="btn_inicio">Início</a>
            <a href="/html/catalogo.html" id="btn_catalogo">Catálogo</a>
            <a href="#" id="btn_Reservas">Reservas</a>
            <a href="/html/sobre.html" id="btn_sobre" class="ativo">Sobre</a>
            <a href="/html/contato.html" id="btn_contato">Contato</a>
        </nav>
        <a id="dir_head" href="#">
            <img src="/assets/explorar.png" alt="Explorar" />
        </a>
    `;

    footer.innerHTML = `
        <div class="footer-div">
            <div class="footer-coluna">
                <button class="footer-button">
                    <img src="/assets/Button.png" />
                    <a href="/index.html" alt="logo"/a>
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
                        <li><a href="/html/catalogo.html">Catálogo</a></li>
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
                        <li><a href="/html/sobre.html">Sobre Nós</a></li>
                        <li><a href="/html/contato.html">Contato</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Parceiros</a></li>
                    </ul>
                </nav>
            </div>
            <div class="footer-coluna">
                <h3>CONTATO</h3>
                <ul class="footer-contato">
                    <li><img src="/assets/icone_telefone.png" />+55 (11) 3456-7890</li>
                    <li><img src="/assets/icone_email.png" />oi@carrinhos.com.br</li>
                    <li>
                        <img src="/assets/icone_endereco.png" />Av. Cinematográfica, 1985 Vila Ficção —
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

async function buscarCarrosPaginado(pagina = 1, limite = 4) {
    try {
        const response = await fetch(`http://localhost:3001/carros?_page=${pagina}&_limit=${limite}`);
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const carros = await response.json();
        const totalCarros = response.headers.get("X-Total-Count");

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
    const mainCarros = document.querySelector(".main-veiculos");
    let disponibilidade = "botao-alugar";
    let disponibilidadeTexto = "";
    if (carro.status_disponibilidade === "alugado") {
        disponibilidade = "botao-indisponivel";
        disponibilidadeTexto = "Indisponível";
    } else {
        disponibilidadeTexto = "Alugar";
    }

    card.innerHTML = `<div class="card">
                <div class="card-imagem">
                    <img src=${carro.url_imagem}>
                    <p class="categoria">${carro.categoria}</p>
                    <p class="status">Indisponível</p>
                    <p class="ranking">#1 da semana</p>
                </div>
                <div class="card-descricao">
                    <p id="card-titulo">${carro.nome}</p>
                    <p id="card-subtitulo">${carro.universo_origem}</p>
                    <div>
                        <p id="por-dia">por dia</p>
                        <h2 id="card-preco">${carro.valor_aluguel_dia}</h2>
                        <div class="card-aluguel">
                            <button class=${disponibilidade}><a href="#">${disponibilidadeTexto}</a></button>
                            <button class="botao-detalhes"><a href="#"><img src="/assets/Button_agenda.png"></a></button>
                        </div>
                    </div>
                </div>
            </div>`;
    return card;
}

async function mostrarCarros(paginaAtual) {
    const main = document.querySelector(".main-veiculos");
    main.innerHTML = "";
    const response = await buscarCarrosPaginado(paginaAtual, 4);

    response.dados.forEach((carro) => {
        const card = criarCard(carro);
        main.appendChild(card);
    });

    criarPaginacao(response.totalPaginas);
}

function criarPaginacao(totalPaginas) {
    const paginacao = document.querySelector(".botoes-paginacao");
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

let paginaAtual = 1;
const totalPaginas = 5;
const limite = 4;

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
