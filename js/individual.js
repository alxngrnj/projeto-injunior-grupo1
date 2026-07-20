async function buscarCarro(id) {
    const response = await fetch(`http://localhost:3001/carros/${id}`);
    const carro = await response.json();

    return carro;
}

async function mostrarDetalhes(id) {
    const carro = await buscarCarro(id);

    const nome = document.querySelector(".indice_atual");
    nome.innerText = carro.nome;

    const imagem = document.querySelector(".individual_esquerda");
    imagem.innerHTML = `<img src=${carro.url_imagem}>`

    const carroNome = document.querySelector(".carro_nome");
    carroNome.innerText = carro.nome;

    const carroOrigem = document.querySelector(".carro_origem");
    carroOrigem.innerText = carro.universo_origem;

    const carroValor = document.querySelector("#valor");
    carroValor.innerText = `R$ ${carro.valor_aluguel_dia}`;

    const status = document.querySelector(".status");
    status.setAttribute("id", carro.status_disponibilidade);
    status.innerText = carro.status_disponibilidade;

    const botaoReserva = document.querySelector(".btn_reservar");
    if(carro.status_disponibilidade != "disponivel") {
        botaoReserva.setAttribute("id", "btn_indisponivel");
        botaoReserva.innerText = "Indisponível";
    }
}


const parametro = new URLSearchParams(window.location.search);

const id = parametro.get("id");

mostrarDetalhes(id);