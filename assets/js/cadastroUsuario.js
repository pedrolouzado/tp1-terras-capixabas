const API_USUARIOS = "http://localhost:3000/usuarios";

const formCadastroUsuario = document.getElementById("form-cadastro-usuario");

formCadastroUsuario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const login = document.getElementById("login").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (nome === "" || login === "" || email === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const resposta = await fetch(API_USUARIOS);
        const usuarios = await resposta.json();

        const loginJaExiste = usuarios.some(usuario => usuario.login === login);
        const emailJaExiste = usuarios.some(usuario => usuario.email === email);

        if (loginJaExiste) {
            alert("Este login já está cadastrado.");
            return;
        }

        if (emailJaExiste) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        const ids = usuarios
            .map(usuario => Number(usuario.id))
            .filter(id => !isNaN(id));

        const novoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

        const novoUsuario = {
            id: novoId,
            nome: nome,
            login: login,
            email: email,
            senha: senha,
            admin: false,
            favoritos: []
        };

        await fetch(API_USUARIOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoUsuario)
        });

        alert("Usuário cadastrado com sucesso!");

        window.location.href = "login.html";

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);
        alert("Erro ao cadastrar usuário.");
    }
});