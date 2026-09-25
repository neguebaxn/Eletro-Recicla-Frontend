// API client para comunicação com o backend Spring Boot

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function loginUsuario(email, senha) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (response.status === 401 ? 'Email ou senha inválidos' : 'Falha na autenticação');
    throw new Error(errorMsg);
  }

  if (data.token) {
    localStorage.setItem('eletrorecicla_token', data.token);
    localStorage.setItem('eletrorecicla_user_email', email);
  }

  return data;
}

export async function cadastrarUsuario(usuarioData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuarioData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || 'Erro ao realizar cadastro';
    throw new Error(errorMsg);
  }

  return data;
}

export function getAuthToken() {
  return localStorage.getItem('eletrorecicla_token');
}

export function logout() {
  localStorage.removeItem('eletrorecicla_token');
  localStorage.removeItem('eletrorecicla_user_email');
}
