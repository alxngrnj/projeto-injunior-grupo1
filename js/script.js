async function buscarCarros(){
    try{
        const response = await fetch("http://localhost:3001/carros");
        if(!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const carros = await response.json();

        return carros;
    } catch(error) {
        console.error("Erro ao buscar carros:", error);
        throw error;
    }
}

async function buscarCarrosPaginado(pagina = 1, limite = 4){
    try{
        const response = await fetch(`http://localhost:3001/carros?_page=${pagina}&_limit=${limite}`);
        if(!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }
        const carros = await response.json();
        const totalCarros = response.headers.get("X-Total-Count");

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
    const mainCarros = document.querySelector(".main-veiculos");
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

    response.dados.forEach(carro => {
        const card = criarCard(carro);
        main.appendChild(card);
    });

    criarPaginacao(response.totalPaginas);
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

let paginaAtual = 1;
const totalPaginas = 5;
const limite = 4;

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