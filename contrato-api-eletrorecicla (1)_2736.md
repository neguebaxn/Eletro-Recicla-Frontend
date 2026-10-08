# EletroRecicla: contrato da API para o frontend

Atualizado em 06/10/2026.
Escopo da entrega de 16/10: **CRUD de usuário** (cadastro, login, leitura, atualização e exclusão).

---

## 1. Básico

| Item | Valor |
|---|---|
| URL base | `https://eletrorecicla-backend.onrender.com/api/v1` |
| Formato | JSON, sempre com o header `Content-Type: application/json` |
| Autenticação | Header `Authorization: Bearer <token>` nas rotas protegidas |
| Token | Obtido em `POST /auth/login` |

### CORS (quem pode chamar a API)

- Origens liberadas hoje: `http://localhost:5173` e `http://localhost:3000`.
- Headers aceitos: `Authorization`, `Content-Type`, `Accept`.
- Métodos aceitos: GET, POST, PUT, PATCH, DELETE, OPTIONS.
- Rodar o projeto em outra porta (ex.: o Vite sobe em `5174` quando a `5173` está ocupada) ou abrir por `127.0.0.1` em vez de `localhost` **bloqueia as chamadas** com erro de CORS no console. Use sempre `http://localhost:5173`.
- Se o site for hospedado, a URL final precisa ser adicionada no backend. Avise o Miguel.

### Primeira chamada demora (Render gratuito)

O servidor "dorme" após alguns minutos sem uso. A **primeira** requisição pode levar cerca de 50 segundos. Recomendações:

- Mostrar um indicador de carregamento em login e cadastro.
- Não colocar timeout curto (use pelo menos 60 s na primeira chamada).
- Opcional: disparar um `GET /categorias` ao abrir o site para "acordar" o servidor.

---

## 2. Fluxo do CRUD de usuário

| Etapa | Chamada | Resultado |
|---|---|---|
| Cadastro | `POST /usuarios` | 201 com o usuário criado (não loga automaticamente) |
| Login | `POST /auth/login` | 200 com `{ "token": "..." }` |
| Ler perfil | `GET /usuarios/me` | 200 com o usuário logado |
| Atualizar | `PUT /usuarios/{id}` | 200 com o usuário atualizado |
| Excluir | `DELETE /usuarios/{id}` | 204 sem corpo |

O `id` vem do `GET /usuarios/me`. O frontend não precisa decodificar o token.

---

## 3. Endpoints de usuário

### 3.1 Cadastro: `POST /usuarios` (público)

Corpo:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "minhasenha",
  "telefone": "11999999999",
  "cpf": "123.456.789-09"
}
```

- Obrigatórios: `nome`, `email`, `senha`. Opcionais: `telefone`, `cpf`.
- `email`: precisa ter formato válido.
- `senha`: mínimo de 6 caracteres.
- `cpf`: aceita com ou sem máscara. O backend guarda só os 11 dígitos. Se não quiser informar, **omita o campo ou envie vazio** (`""`).
- A role é sempre `CIDADAO` no cadastro; o frontend não escolhe.

Resposta `201`:

```json
{
  "id": 16,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "11999999999",
  "cpf": "12345678909",
  "status": "ATIVO",
  "role": "CIDADAO",
  "dataCadastro": "2026-10-06T22:27:36.883789533"
}
```

`dataCadastro` vem em formato ISO, sem fuso horário.

### 3.2 Login: `POST /auth/login` (público)

```json
{ "email": "maria@email.com", "senha": "minhasenha" }
```

- `200`: `{ "token": "eyJ..." }`
- `401`: "Email ou senha inválidos". A mesma mensagem vale para e-mail inexistente, senha errada e conta excluída (de propósito, para não revelar quais e-mails existem).
- `400`: e-mail ou senha ausentes.

### 3.3 Perfil logado: `GET /usuarios/me` (exige token)

Devolve o objeto de usuário da seção 3.1. Use este endpoint para saber o `id` e a `role` do usuário logado.

### 3.4 Atualizar: `PUT /usuarios/{id}` (exige token; só o próprio usuário ou ADMIN)

Corpo (todos os campos são opcionais, envie só o que mudou):

```json
{ "nome": "Maria S.", "telefone": "11888888888" }
```

- Campos **omitidos ou vazios não são alterados** (comporta-se como PATCH).
- Não é possível limpar `cpf` nem `email` enviando vazio; o valor atual é mantido.
- `telefone` enviado como texto substitui o atual.
- `role` e `status` enviados no corpo são **ignorados**.
- Mesmas validações do cadastro para `email`, `senha` e `cpf`.
- Resposta `200`: usuário atualizado.

### 3.5 Excluir: `DELETE /usuarios/{id}` (exige token; só o próprio usuário ou ADMIN)

- Resposta `204`, **sem corpo** (não chame `response.json()`).
- É exclusão lógica: o `status` vira `INATIVO`.
- Depois disso, o token antigo passa a retornar `401` e o login da conta também.
- O e-mail de uma conta excluída continua "ocupado": não dá para cadastrar de novo com ele.
- Ao receber `204`, apague o token e volte para a tela de login.

### 3.6 Só ADMIN

- `GET /usuarios`: lista todos os usuários.
- `GET`, `PUT` e `DELETE /usuarios/{id}` de outra pessoa: só ADMIN (cidadão recebe `403`).

---

## 4. Códigos de erro

| Código | Quando acontece | O que o frontend deve fazer |
|---|---|---|
| 400 | Dado inválido ou duplicado (e-mail, senha, CPF, campo obrigatório, id inválido, corpo ausente ou ilegível) | Mostrar a mensagem de erro no formulário |
| 401 | Sem token, token inválido/expirado, conta excluída, ou login incorreto | Limpar o token e levar para o login |
| 403 | Token válido, mas sem permissão para aquele recurso | Mostrar "sem permissão" |
| 404 | Usuário ou recurso não existe | Mostrar "não encontrado" |
| 409 | Conflito de integridade no banco (genérico) | Mostrar erro genérico |

Mensagens de `400` que o backend envia hoje:

- "Nome é obrigatório"
- "Email é obrigatório"
- "Senha é obrigatória"
- "Email inválido"
- "Senha deve ter no mínimo 6 caracteres"
- "CPF deve ter 11 dígitos"
- "Já existe um usuário cadastrado com esse email"
- "Já existe um usuário cadastrado com esse CPF"

**Formato do corpo de erro:** os erros de regra de negócio (`400`, `404`, e o `401` de login com credenciais erradas) devolvem um JSON com um único campo `erro`, com a mensagem em português:

```json
{ "erro": "Email inválido" }
```

Mostre `dados.erro` direto no formulário.

Atenção: o `401` por token ausente ou inválido e o `403` podem vir **sem corpo**. Nesses dois casos, decida pelo código de status, nunca pelo conteúdo da resposta.

---

## 5. Pontos de atenção

1. **Trocar o e-mail derruba a sessão.** O token identifica o usuário pelo e-mail. Depois de um `PUT` que muda o e-mail, o token antigo passa a retornar `401`. Ao receber `200` num `PUT` que alterou o e-mail, **force novo login** (apague o token e leve para a tela de login).
2. **`401` em qualquer rota protegida significa "sessão inválida".** O token tem prazo de validade; trate `401` sempre do mesmo jeito.
3. **Role no frontend.** Leia `role` do `GET /usuarios/me` (`CIDADAO` ou `ADMIN`) para decidir o que mostrar. A segurança de verdade está no backend; esconder um botão não protege nada.
4. **Máscara de CPF e telefone** é só visual. Pode enviar com máscara que o backend normaliza o CPF.
5. **Cadastro não retorna token.** Depois do `201`, faça o login em seguida (ou redirecione para a tela de login).

---

## 6. Exemplo de uso (JavaScript)

```js
const API = "https://eletrorecicla-backend.onrender.com/api/v1";

async function login(email, senha) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!r.ok) throw new Error(r.status === 401 ? "Email ou senha inválidos" : "Erro no login");
  const { token } = await r.json();
  return token;
}

async function api(path, token, options = {}) {
  const r = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (r.status === 401) {
    // limpar o token salvo e redirecionar para o login
  }
  return r;
}

// Ler perfil
const me = await (await api("/usuarios/me", token)).json();

// Atualizar nome
await api(`/usuarios/${me.id}`, token, {
  method: "PUT",
  body: JSON.stringify({ nome: "Novo Nome" }),
});

// Excluir a própria conta (204, sem corpo)
const r = await api(`/usuarios/${me.id}`, token, { method: "DELETE" });
if (r.status === 204) { /* limpar token e ir para o login */ }
```

---

## 7. Outros endpoints (fora do escopo da entrega de 16/10)

| Endpoint | Acesso |
|---|---|
| `GET /empresas/aprovadas` | Público (alimenta o mapa) |
| `GET /empresas` | Só ADMIN |
| `GET /empresas/{id}` | Exige token |
| `POST /empresas` | Público (a empresa nasce `PENDENTE`) |
| `PATCH /empresas/{id}/aprovar` e `/reprovar` | Só ADMIN |
| `GET /coletas/me` | Exige token (histórico do usuário logado) |
| `GET /coletas/{id}` | Só o dono da coleta ou ADMIN |
| `GET /coletas` | Só ADMIN |
| `POST /coletas` | Exige token (o usuário vem do token, nunca do corpo) |
| `GET /categorias`, `GET /produtos` | Públicos |

---

## 8. Limitações conhecidas

- O CPF tem só o tamanho validado (11 dígitos), sem cálculo do dígito verificador.
- A troca de senha pelo `PUT` não exige a senha atual.
- Trocar o e-mail exige novo login (seção 5).
- O servidor gratuito dorme e a primeira chamada é lenta (seção 1).

---

## 9. Como testar

Peça ao Miguel um usuário de teste. Para testar sozinho, cadastre um usuário novo pelo `POST /usuarios` e faça login com ele. Não use a conta de ADMIN para testar telas de cidadão.