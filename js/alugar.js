async function buscarCarro(id) {
    const response = await fetch(`http://localhost:3001/carros/${id}`);
    const carro = await response.json();

    return carro;
}

async function alugarDetalhes(id) {
    const carro = await buscarCarro(id);

    const imagemAlugar = document.querySelector(".photo");
    imagemAlugar.innerHTML = `<img class="image"src=${carro.url_imagem}>
                            <p class="img_text">${carro.nome}</p>`

    const inputNome = document.querySelector("#input_nome");
    inputNome.innerHTML = `<label for="car_name">VEÍCULO</label>
                        <input type="text" name="car_name" placeholder="${carro.nome}" disabled>`

    const valorDiaria = document.querySelector(".value_style");
    valorDiaria.innerText = `R$ ${carro.valor_aluguel_dia}`

    const valorTotal = document.querySelector("#total_valor");
    valorTotal.innerText = `R$ ${carro.valor_aluguel_dia}`

    const quantidadeDias = document.querySelector("#quantidade_dias");

}

const parametro = new URLSearchParams(window.location.search);

const id = parametro.get("id");

alugarDetalhes(id);

const botaoEnviar = document.querySelector(".send_button");

botaoEnviar.addEventListener("click", async () => {
    const dados = {
        nome: document.querySelector("#nome_completo").value,
        documento: document.querySelector("#cpf").value,
        data_inicio_aluguel: document.querySelector("#pickup_date").value,
        data_devolucao_prevista: document.querySelector("#return_date").value,
        telefone: document.querySelector("#telefone").value,
    };

    await fetch(`http://localhost:3001/carros/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            locatario: dados,
            status_disponibilidade: "alugada"
        })
    });
});



