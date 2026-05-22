const carousel = document.getElementById("carousel-content");

if (carousel) {

    dados.destinos.forEach((destino, index) => {

        if (destino.destaque) {

            carousel.innerHTML += `
            
            <div class="carousel-item ${index === 0 ? 'active' : ''}">

                <img 
                    src="${destino.imagem_principal}" 
                    class="d-block w-100"
                    alt="${destino.nome}"
                >

                <div class="carousel-caption">

                    <h2>${destino.nome}</h2>

                    <p>${destino.descricao}</p>

                    <a 
                        href="detalhe.html?id=${destino.id}" 
                        class="btn btn-light"
                    >
                        Ver detalhes
                    </a>

                </div>

            </div>

            `;
        }

    });

}



const cardsContainer = document.getElementById("cards-container");

if (cardsContainer) {

    dados.destinos.forEach(destino => {

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

                    <a 
                        href="detalhe.html?id=${destino.id}" 
                        class="btn btn-dark mt-auto"
                    >
                        Ver detalhes
                    </a>

                </div>

            </div>

        </div>

        `;

    });

}



const detalhesContainer = document.getElementById("detalhes-container");

if (detalhesContainer) {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    const destino = dados.destinos.find(item => item.id == id);

    if (destino) {

        detalhesContainer.innerHTML = `

        <div class="row mb-5">

            <div class="col-md-6">

                <img 
                    src="${destino.imagem_principal}" 
                    class="detalhe-img"
                    alt="${destino.nome}"
                >

            </div>

            <div class="col-md-6">

                <h1 class="fw-bold mb-4">
                    ${destino.nome}
                </h1>

                <p>
                    ${destino.conteudo}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${destino.categoria}
                </p>

                <p>
                    <strong>Estado:</strong>
                    Espírito Santo
                </p>

                <p>
                    <strong>Tipo:</strong>
                    Destino Turístico
                </p>

                <p>
                    <strong>Status:</strong>
                    Disponível para visitação
                </p>

            </div>

        </div>

        <h2 class="fw-bold mb-4">
            Fotos do Local
        </h2>

        <div class="row galeria g-4">

            ${destino.fotos.map(foto => `

                <div class="col-md-4">

                    <div class="card">

                        <img 
                            src="${foto.imagem}" 
                            class="card-img-top"
                            alt="${foto.titulo}"
                        >

                        <div class="card-body">

                            <h5>
                                ${foto.titulo}
                            </h5>

                        </div>

                    </div>

                </div>

            `).join("")}

        </div>

        `;
    }

}