// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que:
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction

let apiKey: string;
let requestToken: string;
let username: string;
let password: string;
let sessionId: number;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById(
  'search-button'
) as HTMLButtonElement;
let searchContainer = document.getElementById(
  'search-container'
) as HTMLDivElement;
let searchInput = document.getElementById('search') as HTMLInputElement;

loginButton?.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
});

searchButton?.addEventListener('click', async () => {
  let lista = document.getElementById('lista') as HTMLUListElement;
  if (lista) {
    lista.outerHTML = '';
  }
  let listaDeFilmes: any = await procurarFilme(searchInput.value);
  let ul = document.createElement('ul');
  ul.id = 'lista';
  for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title));
    ul.appendChild(li);
  }
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
});

function preencherSenha() {
  const currentPassword = document.getElementById('senha') as HTMLInputElement;
  password = currentPassword.value;
  validateLoginButton();
}

function preencherLogin() {
  const currentLogin = document.getElementById('login') as HTMLInputElement;
  username = currentLogin.value;
  validateLoginButton();
}

function preencherApi() {
  const currentApiKey = document.getElementById('api-key') as HTMLInputElement;
  apiKey = currentApiKey.value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

interface Irequest {
  url: string;
  method: string;
  body: null;
}

class HttpClient {
  static async get(response: { url: string; method: string; body?: object }) {
    return new Promise((resolve, reject) => {
      let body: any;
      let request = new XMLHttpRequest();
      request.open(response.method, response.url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      };
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      };

      if (response.body) {
        request.setRequestHeader(
          'Content-Type',
          'application/json;charset=UTF-8'
        );
        body = JSON.stringify(response.body);
      }
      request.send(body);
    });
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query);

  let result: any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: 'GET',
  });
  return result;
}

async function adicionarFilme(filmeId: any) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: 'GET',
  });
  console.log(result);
}

async function criarRequestToken() {
  let result: any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: 'GET',
  });
  requestToken = result.request_token;
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: 'POST',
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`,
    },
  });
}

async function criarSessao() {
  let result: any = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: 'GET',
  });
  sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: 'POST',
    body: {
      name: nomeDaLista,
      description: descricao,
      language: 'pt-br',
    },
  });
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: any, listaId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: 'POST',
    body: {
      media_id: filmeId,
    },
  });
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: 'GET',
  });
  console.log(result);
}
