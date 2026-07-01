const API_DESTINOS = "http://localhost:3000/destinos";

async function carregarFavoritos() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    const container = document.getElementById("favoritos-container");

    if (!usuarioLogado) {
        alert("Faça login para ver seus favoritos.");
        window.location.href = "login.html";
        return;
    }

    const resposta = await fetch(API_DESTINOS);
    const destinos = await resposta.json();

    const favoritos = destinos.filter(destino =>
        usuarioLogado.favoritos.includes(destino.id)
    );

    container.innerHTML = "";

    if (favoritos.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning">
                Você ainda não possui destinos favoritos.
            </div>
        `;
        return;
    }

    favoritos.forEach(destino => {
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${destino.imagem_principal}" class="card-img-top" alt="${destino.nome}">

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${destino.nome}</h5>
                        <p class="card-text">${destino.descricao}</p>
                        <p><strong>Categoria:</strong> ${destino.categoria}</p>

                        <a href="detalhe.html?id=${destino.id}" class="btn btn-dark mt-auto">
                            Ver detalhes
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

carregarFavoritos();