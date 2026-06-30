const API_URL = "http://localhost:3000/destinos";

const formDestino = document.getElementById("form-destino");

const campoId = document.getElementById("id");
const campoNome = document.getElementById("nome");
const campoCategoria = document.getElementById("categoria");
const campoDescricao = document.getElementById("descricao");
const campoConteudo = document.getElementById("conteudo");
const campoImagem = document.getElementById("imagem_principal");
const campoDestaque = document.getElementById("destaque");

const tabelaDestinos = document.getElementById("tabela-destinos");

const btnInserir = document.getElementById("btn-inserir");
const btnAlterar = document.getElementById("btn-alterar");
const btnExcluir = document.getElementById("btn-excluir");

async function gerarNovoId() {
    const resposta = await fetch(API_URL);
    const destinos = await resposta.json();

    const idsNumericos = destinos
        .map(destino => parseInt(destino.id))
        .filter(id => !isNaN(id));

    if (idsNumericos.length === 0) {
        return 1;
    }

    return Math.max(...idsNumericos) + 1;
}

async function listarDestinos() {
    try {
        const resposta = await fetch(API_URL);
        const destinos = await resposta.json();

        tabelaDestinos.innerHTML = "";

        destinos.forEach(destino => {
            tabelaDestinos.innerHTML += `
                <tr onclick="selecionarDestino('${destino.id}')" style="cursor: pointer;">
                    <td>${destino.id}</td>
                    <td>${destino.nome}</td>
                    <td>${destino.categoria}</td>
                    <td>${destino.destaque ? "Sim" : "Não"}</td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro ao listar destinos:", erro);
        alert("Erro ao carregar a lista de destinos.");
    }
}

async function selecionarDestino(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        const destino = await resposta.json();

        campoId.value = destino.id;
        campoNome.value = destino.nome;
        campoCategoria.value = destino.categoria;
        campoDescricao.value = destino.descricao;
        campoConteudo.value = destino.conteudo;
        campoImagem.value = destino.imagem_principal;
        campoDestaque.value = String(destino.destaque);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (erro) {
        console.error("Erro ao selecionar destino:", erro);
        alert("Erro ao carregar os dados do destino.");
    }
}

function validarCampos() {
    if (
        campoNome.value.trim() === "" ||
        campoCategoria.value.trim() === "" ||
        campoDescricao.value.trim() === "" ||
        campoConteudo.value.trim() === "" ||
        campoImagem.value.trim() === ""
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return false;
    }

    return true;
}

function montarDestino() {
    return {
        nome: campoNome.value.trim(),
        descricao: campoDescricao.value.trim(),
        conteudo: campoConteudo.value.trim(),
        categoria: campoCategoria.value.trim(),
        destaque: campoDestaque.value === "true",
        imagem_principal: campoImagem.value.trim(),
        fotos: [
            {
                titulo: campoNome.value.trim(),
                imagem: campoImagem.value.trim()
            }
        ]
    };
}

function limparFormulario() {
    formDestino.reset();
    campoId.value = "";
}

btnInserir.addEventListener("click", async () => {
    if (!validarCampos()) return;

    try {
        const novoDestino = montarDestino();

        novoDestino.id = await gerarNovoId();

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoDestino)
        });

        alert("Destino inserido com sucesso!");
        limparFormulario();
        listarDestinos();

    } catch (erro) {
        console.error("Erro ao inserir destino:", erro);
        alert("Erro ao inserir destino.");
    }
});

btnAlterar.addEventListener("click", async () => {
    const id = campoId.value;

    if (!id) {
        alert("Selecione um destino na tabela para alterar.");
        return;
    }

    if (!validarCampos()) return;

    try {
        const destinoAtualizado = montarDestino();

        destinoAtualizado.id = Number(id);

        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(destinoAtualizado)
        });

        alert("Destino alterado com sucesso!");
        limparFormulario();
        listarDestinos();

    } catch (erro) {
        console.error("Erro ao alterar destino:", erro);
        alert("Erro ao alterar destino.");
    }
});

btnExcluir.addEventListener("click", async () => {
    const id = campoId.value;

    if (!id) {
        alert("Selecione um destino na tabela para excluir.");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir este destino?");

    if (!confirmar) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        alert("Destino excluído com sucesso!");
        limparFormulario();
        listarDestinos();

    } catch (erro) {
        console.error("Erro ao excluir destino:", erro);
        alert("Erro ao excluir destino.");
    }
});

formDestino.addEventListener("reset", () => {
    campoId.value = "";
});

listarDestinos();