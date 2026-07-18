async function buscarCarrosPaginado(pagina = 1, limite = 4){
    try{
        const url = montarUrl(filtro, pagina, limite);
        const response = await fetch(url);

        if(!response.ok) {
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
            totalPaginas: Math.ceil(totalCarros / limite)
        }

    } catch(error) {
        console.error("Erro ao buscar carros:", error);
        throw error;
    }
}

function criarCard(carro) {
    const card = document.createElement("div");
    let disponibilidade = "botao-alugar"; let disponibilidadeTexto = "";
    if(carro.status_disponibilidade === "alugado") {
        disponibilidade = "botao-indisponivel";
        disponibilidadeTexto = "Indisponível";
    }
    else {
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
                            <button class="botao-detalhes"><a href="#"><img src="../assets/Button_agenda.png"></a></button>
                        </div>
                    </div>
                </div>
            </div>`
    return card;
}

async function mostrarCarros(paginaAtual) {
    const main = document.querySelector(".main-veiculos");
    main.innerHTML = "";
    const response = await buscarCarrosPaginado(paginaAtual, 4);
    totalPaginas = response.totalPaginas;

    response.dados.forEach(carro => {
        const card = criarCard(carro);
        main.appendChild(card);
    });

    criarPaginacao(totalPaginas);
}

function criarPaginacao(totalPaginas) {
    const paginacao = document.querySelector(".botoes-paginacao");
    paginacao.innerHTML = "";

    for(let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement("button");
        botao.innerText = i;

        botao.addEventListener("click", ()=> {
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


let paginaAtual = 1;
let totalPaginas = 5;
const limite = 4;

const filtro = {
    nome: "",
    categoria: "todos",
    disponibilidade: "todos"
};

mostrarCarros(paginaAtual);



const botaoVoltarPagina = document.querySelector("#voltar-pagina");

botaoVoltarPagina.addEventListener("click", ()=> {
    if(paginaAtual > 1) {
        paginaAtual--;
        mostrarCarros(paginaAtual);
    }
});

const botaoAvancarPagina = document.querySelector("#avancar-pagina");

botaoAvancarPagina.addEventListener("click", ()=> {
    if(paginaAtual < totalPaginas){
        paginaAtual++;
        mostrarCarros(paginaAtual);
    }
});



const inputPesquisa = document.querySelector("#pesquisa");

inputPesquisa.addEventListener("input", ()=>{
    filtro.nome = inputPesquisa.value;
    paginaAtual = 1;
    mostrarCarros(paginaAtual);
});

const botoesFiltro = document.querySelectorAll(".botoes-filtro");
const botaoDisponivel = document.querySelector("#filtro-disponivel");
const botaoIndisponivel = document.querySelector("#filtro-indisponivel");
botaoDisponivel.addEventListener("click", ()=> {
    filtro.disponibilidade = "disponivel";
    paginaAtual = 1;
    selecionarBotao(botaoDisponivel);
    mostrarCarros(paginaAtual);
});
botaoIndisponivel.addEventListener("click", ()=> {
    filtro.disponibilidade = "indisponivel";
    paginaAtual = 1;
    selecionarBotao(botaoIndisponivel);
    mostrarCarros(paginaAtual);
});

const botaoTodos = document.querySelector("#filtro-todos");
const botaoFilme = document.querySelector("#filtro-filme");
const botaoSerie = document.querySelector("#filtro-serie");
const botaoDesenho = document.querySelector("#filtro-desenho");
botaoTodos.addEventListener("click", ()=> {
    filtro.disponibilidade = "todos";
    filtro.categoria = "todos";
    selecionarBotao(botaoTodos);
    paginaAtual = 1;
    mostrarCarros(paginaAtual);
});
botaoFilme.addEventListener("click", ()=> {
    filtro.categoria = "filme";
    paginaAtual = 1;
    selecionarBotao(botaoFilme);
    mostrarCarros(paginaAtual);
});
botaoSerie.addEventListener("click", ()=> {
    filtro.categoria = "série";
    paginaAtual = 1;
    selecionarBotao(botaoSerie);
    mostrarCarros(paginaAtual);
});
botaoDesenho.addEventListener("click", ()=> {
    filtro.categoria = "desenho";
    paginaAtual = 1;
    selecionarBotao(botaoDesenho);
    mostrarCarros(paginaAtual);
});





