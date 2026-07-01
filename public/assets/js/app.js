const API_URL = "http://localhost:3000/destinos";

async function buscarDestinos() {
    try {
        const resposta = await fetch(API_URL);
        const destinos = await resposta.json();

        carregarCarousel(destinos);
        carregarCards(destinos);
        carregarDetalhes(destinos);
        carregarMapa(destinos);

    } catch (erro) {
        console.error("Erro ao buscar destinos:", erro);
    }
}

function carregarCarousel(destinos) {
    const carousel = document.getElementById("carousel-content");
    if (!carousel) return;

    carousel.innerHTML = "";
    const destaques = destinos.filter(destino => destino.destaque);

    destaques.forEach((destino, index) => {
        carousel.innerHTML += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <img src="${destino.imagem_principal}" class="d-block w-100" alt="${destino.nome}">
                <div class="carousel-caption">
                    <h2>${destino.nome}</h2>
                    <p>${destino.descricao}</p>
                    <a href="detalhe.html?id=${destino.id}" class="btn btn-light">Ver detalhes</a>
                </div>
            </div>
        `;
    });
}
function carregarCards(destinos) {
    const cardsContainer = document.getElementById("cards-container");
    if (!cardsContainer) return;

    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    cardsContainer.innerHTML = "";

    destinos.forEach(destino => {

        let iconeFavorito = "🤍";

        if (
            usuarioLogado &&
            usuarioLogado.favoritos &&
            usuarioLogado.favoritos.includes(destino.id)
        ) {
            iconeFavorito = "❤️";
        }

        cardsContainer.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100">

                    <img
                        src="${destino.imagem_principal}"
                        class="card-img-top"
                        alt="${destino.nome}"
                    >

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title">
                            ${destino.nome}
                        </h5>

                        <p class="card-text">
                            ${destino.descricao}
                        </p>

                        <p>
                            <strong>Categoria:</strong>
                            ${destino.categoria}
                        </p>

                        <div class="d-flex justify-content-between align-items-center mt-auto">

                            <a
                                href="detalhe.html?id=${destino.id}"
                                class="btn btn-dark"
                            >
                                Ver detalhes
                            </a>

                            <button
                                class="btn btn-outline-danger"
                                onclick="favoritarDestino(${destino.id})"
                            >
                                ${iconeFavorito}
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        `;
    });
}

function carregarDetalhes(destinos) {
    const detalhesContainer = document.getElementById("detalhes-container");
    if (!detalhesContainer) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const destino = destinos.find(item => item.id == id);

    if (!destino) {
        detalhesContainer.innerHTML = `<div class="alert alert-danger">Destino não encontrado.</div>`;
        return;
    }

    detalhesContainer.innerHTML = `
        <div class="row mb-5">
            <div class="col-md-6">
                <img src="${destino.imagem_principal}" class="detalhe-img" alt="${destino.nome}">
            </div>

            <div class="col-md-6">
                <h1 class="fw-bold mb-4">${destino.nome}</h1>
                <p>${destino.conteudo}</p>
                <p><strong>Categoria:</strong> ${destino.categoria}</p>
                <p><strong>Estado:</strong> Espírito Santo</p>
                <p><strong>Tipo:</strong> Destino Turístico</p>
                <p><strong>Status:</strong> Disponível para visitação</p>
            </div>
        </div>

        <h2 class="fw-bold mb-4">Fotos do Local</h2>

        <div class="row galeria g-4">
            ${destino.fotos.map(foto => `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${foto.imagem}" class="card-img-top" alt="${foto.titulo}">
                        <div class="card-body">
                            <h5>${foto.titulo}</h5>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function carregarMapa(destinos) {
    const mapaContainer = document.getElementById("mapa");
    if (!mapaContainer) return;

    const mapa = L.map("mapa").setView([-20.2, -40.7], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
    }).addTo(mapa);

    destinos.forEach(destino => {
        if (destino.latitude && destino.longitude) {
            L.marker([destino.latitude, destino.longitude])
                .addTo(mapa)
                .bindPopup(`
                    <strong>${destino.nome}</strong><br>
                    ${destino.categoria}<br>
                    <a href="detalhe.html?id=${destino.id}">Ver detalhes</a>
                `);
        }
    });
}
function carregarMenuUsuario() {
    const menu = document.getElementById("menu-usuario");
    if (!menu) return;

    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    menu.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="index.html">Início</a>
        </li>
    `;

    if (usuarioLogado) {
        if (usuarioLogado.admin) {
            menu.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="cadastro.html">Cadastro</a>
                </li>
            `;
        }

        menu.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="favoritos.html">Favoritos</a>
            </li>
            <li class="nav-item">
                <span class="nav-link text-white">Olá, ${usuarioLogado.nome}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Sair</a>
            </li>
        `;
    } else {
        menu.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
        `;
    }
}

function logout() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

carregarMenuUsuario();

async function favoritarDestino(idDestino) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Faça login para favoritar um destino.");
        window.location.href = "login.html";
        return;
    }

    if (!usuarioLogado.favoritos) {
        usuarioLogado.favoritos = [];
    }

    idDestino = Number(idDestino);

    const jaFavoritado = usuarioLogado.favoritos.includes(idDestino);

    if (jaFavoritado) {
        usuarioLogado.favoritos = usuarioLogado.favoritos.filter(id => id !== idDestino);
    } else {
        usuarioLogado.favoritos.push(idDestino);
    }

    const resposta = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            favoritos: usuarioLogado.favoritos
        })
    });

    if (!resposta.ok) {
        alert("Erro ao salvar favorito no banco de dados.");
        return;
    }

    const usuarioAtualizado = await resposta.json();

    sessionStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioAtualizado)
    );

    buscarDestinos();
}

const campoPesquisa = document.getElementById("pesquisa");

if (campoPesquisa) {

    campoPesquisa.addEventListener("input", async () => {

        const texto = campoPesquisa.value.toLowerCase();

        const resposta = await fetch(API_URL);

        const destinos = await resposta.json();

        const filtrados = destinos.filter(destino =>

            destino.nome.toLowerCase().includes(texto) ||

            destino.categoria.toLowerCase().includes(texto)

        );

        carregarCards(filtrados);

    });

}

buscarDestinos();