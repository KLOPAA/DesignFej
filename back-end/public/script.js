const formCadastro = document.getElementById('formCadastro');
const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

console.log('Script carregado');

if (formCadastro) {
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Cadastro iniciado');

    const dados = Object.fromEntries(new FormData(formCadastro));

    const resposta = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const json = await resposta.json();

    if (mensagem) {
      mensagem.textContent = json.mensagem || json.erro;
      mensagem.style.color = resposta.ok ? 'green' : 'red';
    }

    if (resposta.ok) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 5000);
    }
  });
}

if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login iniciado');

    const dados = Object.fromEntries(new FormData(formLogin));

    const resposta = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const json = await resposta.json();

    if (mensagem) {
      if (resposta.ok) {
        mensagem.textContent = 'Login realizado com sucesso, seja bem-vindo ao DesignFej';
        mensagem.style.color = 'green';
      } else {
        mensagem.textContent = json.erro || 'Erro ao realizar login';
        mensagem.style.color = 'red';
      }
    }

    if (resposta.ok) {
      // Redirecionar após login (opcional)
      // window.location.href = '/home'; // ajuste se quiser
    }
  });
}
