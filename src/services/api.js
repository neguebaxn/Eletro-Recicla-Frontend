// Mock storage para modo de demonstração / GitHub Pages
const MOCK_STORAGE_KEY = 'eletrorecicla_mock_users';

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

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function loginUsuario(email, senha) {
  // 1. Tenta chamar a API do backend Spring Boot
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('eletrorecicla_token', data.token);
        localStorage.setItem('eletrorecicla_user_email', email);
      }
      return data;
    }
  } catch (err) {
    // Se o backend não estiver respondendo (ex: site acessado pelo GitHub Pages),
    // recorre ao fallback local para que a demonstração e o grupo consigam testar 100%!
  }

  // 2. Fallback de demonstração (funciona mesmo com backend offline ou no GitHub Pages)
  const users = getMockUsers();
  const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (foundUser) {
    if (foundUser.senha === senha) {
      const fakeToken = `mock-token-${Date.now()}`;
      localStorage.setItem('eletrorecicla_token', fakeToken);
      localStorage.setItem('eletrorecicla_user_email', email);
      localStorage.setItem('eletrorecicla_user_name', foundUser.nome);
      return { token: fakeToken, usuario: foundUser };
    }
    throw new Error('Email ou senha inválidos.');
  }

  // Permite login de demonstração se nenhum usuário foi cadastrado ainda
  if (email && senha && senha.length >= 6) {
    const fakeToken = `demo-token-${Date.now()}`;
    localStorage.setItem('eletrorecicla_token', fakeToken);
    localStorage.setItem('eletrorecicla_user_email', email);
    return { token: fakeToken };
  }

  throw new Error('Email ou senha inválidos.');
}

export async function cadastrarUsuario(usuarioData) {
  // 1. Tenta cadastrar no backend Spring Boot
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarioData),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Backend offline ou inacessível no GitHub Pages
  }

  // 2. Fallback de demonstração (salva no localStorage do navegador)
  const users = getMockUsers();
  if (users.some((u) => u.email.toLowerCase() === usuarioData.email.toLowerCase())) {
    throw new Error('Já existe um usuário cadastrado com esse email.');
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

export function getAuthToken() {
  return localStorage.getItem('eletrorecicla_token');
}

export function logout() {
  localStorage.removeItem('eletrorecicla_token');
  localStorage.removeItem('eletrorecicla_user_email');
  localStorage.removeItem('eletrorecicla_user_name');
}

