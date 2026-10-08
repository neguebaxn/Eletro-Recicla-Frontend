// ============================================================
// EletroRecicla - servico de API
// Contrato: "contrato-api-eletrorecicla (1)_2736.md" (repositorio)
// Base: https://eletrorecicla-backend.onrender.com/api/v1
// ============================================================

// Sobrescreva com VITE_API_URL para apontar outro backend
// (ex.: http://localhost:8080/api/v1 quando rodar o Spring Boot local).
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://eletrorecicla-backend.onrender.com/api/v1'
).replace(/\/+$/, '');

const TOKEN_KEY = 'eletrorecicla_token';
const EMAIL_KEY = 'eletrorecicla_user_email';
const NAME_KEY = 'eletrorecicla_user_name';
const USER_KEY = 'eletrorecicla_user';
const MOCK_STORAGE_KEY = 'eletrorecicla_mock_users';

// ------------------------------------------------------------
// Erros: o backend devolve { "erro": "mensagem" } em 400/404 e
// no 401 de login (secao 4 do contrato). O 401 de token e o 403
// podem vir sem corpo: nesses casos, decida pelo status.
// ------------------------------------------------------------
async function extractError(response, fallback) {
  try {
    const data = await response.json();
    if (data && typeof data.erro === 'string' && data.erro.trim()) {
      return data.erro;
    }
  } catch {
    // corpo vazio ou nao-JSON
  }
  if (response.status === 401) return 'Email ou senha invalidos.';
  if (response.status === 403) return 'Voce nao tem permissao para esta acao.';
  if (response.status === 404) return 'Recurso nao encontrado.';
  return fallback;
}

// Requisicao autenticada com tratamento de erro centralizado.
// expectSession = rota protegida: 401 significa "sessao invalida"
// e o token deve ser limpo (secao 5 do contrato).
async function apiRequest(path, { method = 'GET', body, token, expectSession = false } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    if (expectSession && response.status === 401) logout();
    const error = new Error(await extractError(response, 'Erro na comunicacao com o servidor.'));
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null; // DELETE responde 204 sem corpo
  return response.json();
}

// ------------------------------------------------------------
// Fallback de demonstracao: usado SOMENTE quando o backend nao
// responde (rede fora, CORS do GitHub Pages, Render dormindo).
// Erros HTTP reais (400/401) nunca caem aqui - vao para o form.
// ------------------------------------------------------------
function getMockUsers() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMockUser(user) {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(users));
}

async function loginMock(email, senha) {
  const users = getMockUsers();
  const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (foundUser) {
    if (foundUser.senha === senha) {
      const fakeToken = `mock-token-${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(EMAIL_KEY, email);
      localStorage.setItem(NAME_KEY, foundUser.nome);
      localStorage.setItem(USER_KEY, JSON.stringify(foundUser));
      return { token: fakeToken, usuario: foundUser };
    }
    throw new Error('Email ou senha invalidos.');
  }

  // Demonstracao: permite login de teste mesmo sem cadastro previo
  if (email && senha && senha.length >= 6) {
    const fakeToken = `demo-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(EMAIL_KEY, email);
    return { token: fakeToken, usuario: null };
  }

  throw new Error('Email ou senha invalidos.');
}

async function cadastroMock(usuarioData) {
  const users = getMockUsers();
  if (users.some((u) => u.email.toLowerCase() === usuarioData.email.toLowerCase())) {
    throw new Error('Ja existe um usuario cadastrado com esse email.');
  }

  const novoUsuario = {
    id: users.length + 1,
    nome: usuarioData.nome,
    email: usuarioData.email,
    telefone: usuarioData.telefone,
    cpf: usuarioData.cpf,
    senha: usuarioData.senha,
    role: 'CIDADAO',
    status: 'ATIVO',
  };

  saveMockUser(novoUsuario);
  return novoUsuario;
}

// ------------------------------------------------------------
// Endpoints (secoes 3.1 a 3.5 do contrato)
// ------------------------------------------------------------

// 3.2 Login: POST /auth/login -> 200 { token } (401 = credenciais
// invalidas). Depois buscamos o perfil para ter id e role.
export async function loginUsuario(email, senha) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
  } catch {
    // Backend nao respondeu (rede/CORS/GitHub Pages) -> demonstracao
    return loginMock(email, senha);
  }

  if (!response.ok) {
    // Erro real do backend: mostra a mensagem no formulario
    const error = new Error(
      await extractError(response, 'Erro ao entrar. Tente novamente.')
    );
    error.status = response.status;
    throw error;
  }

  const { token } = await response.json();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);

  // O login devolve SO o token; id e role vem de GET /usuarios/me
  let usuario = null;
  try {
    usuario = await getPerfil(token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    if (usuario && usuario.nome) localStorage.setItem(NAME_KEY, usuario.nome);
  } catch {
    // perfil e best-effort; o token ja esta salvo
  }

  return { token, usuario };
}

// 3.1 Cadastro: POST /usuarios -> 201 (NAO loga automaticamente;
// a tela leva o usuario para o login apos o sucesso).
export async function cadastrarUsuario(usuarioData) {
  const payload = {
    nome: (usuarioData.nome || '').trim(),
    email: (usuarioData.email || '').trim(),
    senha: usuarioData.senha,
  };
  // telefone e cpf sao opcionais (secao 3.1): so envia se preenchido
  const telefone = (usuarioData.telefone || '').replace(/\D/g, '');
  const cpf = (usuarioData.cpf || '').replace(/\D/g, '');
  if (telefone) payload.telefone = telefone;
  if (cpf) payload.cpf = cpf;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Backend nao respondeu (rede/CORS/GitHub Pages) -> demonstracao
    return cadastroMock(usuarioData);
  }

  if (!response.ok) {
    // 400 (email duplicado, senha curta...) -> mensagem no form
    const error = new Error(
      await extractError(response, 'Erro ao realizar cadastro.')
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// 3.3 Perfil logado: GET /usuarios/me -> id, role (CIDADAO|ADMIN)
export function getPerfil(token = getAuthToken()) {
  return apiRequest('/usuarios/me', { token, expectSession: true });
}

// 3.4 Atualizar: PUT /usuarios/{id} - envie SO o campo alterado.
// Atencao (secao 5): se o PUT trocou o e-mail, o token antigo
// passa a dar 401 -> force novo login ao receber 200.
export function atualizarUsuario(id, dados, token = getAuthToken()) {
  return apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: dados,
    token,
    expectSession: true,
  });
}

// 3.5 Excluir: DELETE /usuarios/{id} -> 204 sem corpo. Apos o
// sucesso, apague o token e volte para o login.
export function excluirUsuario(id, token = getAuthToken()) {
  return apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
    token,
    expectSession: true,
  });
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuarioSalvo() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(USER_KEY);
}

// Secao 1 do contrato: o Render dorme e a 1a chamada demora ~50s.
// Dispara um GET publico ao abrir o site para acordar o servidor.
export function acordarBackend() {
  fetch(`${API_BASE_URL}/categorias`, {
    headers: { Accept: 'application/json' },
  }).catch(() => {});
}
