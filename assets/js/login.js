const API_URL = "http://localhost:3000/usuarios";

const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {

    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (login === "" || senha === "") {
        alert("Preencha login e senha.");
        return;
    }

    try {

        const resposta = await fetch(API_URL);
        const usuarios = await resposta.json();

        const usuario = usuarios.find(u =>
            u.login === login &&
            u.senha === senha
        );

        if (!usuario) {
            alert("Login ou senha inválidos.");
            return;
        }

        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuario)
        );

        alert(`Bem-vindo, ${usuario.nome}!`);

        window.location.href = "index.html";

    } catch (erro) {

        console.error(erro);

        alert("Erro ao realizar login.");

    }

});