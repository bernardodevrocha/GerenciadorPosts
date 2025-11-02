# Gerenciador de Posts — React + Node + MySQL (Docker)

Aplicação full‑stack para **listar, buscar e gerenciar posts** com **capa (foto)**.
Frontend em **React 18**, API em **Node/Express**, banco **MySQL 8** — orquestrados por **Docker Compose**.

---

## Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Rodar](#como-rodar)
  - [Back-end (API + Banco via Docker)](#back-end-api--banco-via-docker)
  - [Front-end (React)](#front-end-react)
  - [Tema/Estilos](#temaestilos)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Banco de Dados](#banco-de-dados)
- [API REST](#api-rest)
  - [Endpoints](#endpoints)
  - [Exemplos cURL](#exemplos-curl)
- [Frontend (Rotas/Fluxos)](#frontend-rotasfluxos)
- [Comandos Úteis (Docker)](#comandos-úteis-docker)
- [Solução de Problemas](#solução-de-problemas)
- [Licença](#licença)

---

## Visão Geral
CRUD completo de posts: **Home** com busca e paginação, **Detalhe** do post com ações **+ Novo / Editar / Excluir**, e endpoints REST simples.
O design usa **tema moderno** com suporte a **dark/light** automático.

---

## Funcionalidades
- **Home (feed)**
  - Busca instantânea
  - Grid responsivo de cards (imagem, título, resumo)
  - Botão **“Load more posts”**
  - **Form de criar post** no topo
- **Detalhe do Post**
  - Exibe post completo + capa
  - Toolbar: **+ Novo**, **Editar**, **Excluir**
- **Admin (opcional)**
  - Páginas dedicadas para criar/editar e gerenciar posts
- **API REST**
  - CRUD completo de posts
  - Capa resolvida via tabela `photos`
- **UI/UX**
  - Tema global (`theme.css`) com dark/light
  - Tipografia Inter, foco visível, animações leves

---

## Stack
- **Frontend:** React 18, React Router v6, fetch API
- **Backend:** Node 20, Express, `mysql2/promise`, CORS
- **DB:** MySQL 8 (tabelas `posts` e `photos`)
- **Infra:** Docker Compose (API `:4000`, MySQL `:3306`)

---

## Arquitetura
```
Frontend (React) ── fetch ──> API (Express/Node) ── mysql2/promise ──> MySQL 8
```

---

## Estrutura de Pastas
```
.
├─ api/
│  ├─ Dockerfile
│  └─ src/
│     ├─ index.js        # servidor/rotas Express
│     └─ db.js           # pool mysql2/promise
├─ db/
│  └─ init.sql           # schema + seeds
├─ src/                  # Frontend (React)
│  ├─ components/
│  │  ├─ Posts/
│  │  │  ├─ index.jsx
│  │  │  └─ styles.css
│  │  └─ PostCard/
│  │     ├─ index.jsx
│  │     └─ styles.css
│  ├─ pages/
│  │  ├─ PostDetail.jsx
│  │  ├─ PostForm.jsx
│  │  └─ AdminPosts.jsx
│  ├─ templates/
│  │  └─ Home/
│  │     ├─ index.jsx
│  │     └─ styles.css
│  ├─ utils/
│  │  ├─ api.js          # API_BASE = http://localhost:4000
│  │  ├─ load-posts.js   # lista posts + merge de capas
│  │  └─ postsApi.js     # funções CRUD via fetch
│  ├─ styles/
│  │  └─ theme.css       # tema global (dark/light)
│  ├─ App.jsx
│  └─ main.jsx (ou index.jsx)
├─ docker-compose.yml
└─ README.md
```

---

## Como Rodar

### Back-end (API + Banco via Docker)
```bash
docker compose up -d --build

# Ver status dos serviços
docker compose ps

# Logs da API
docker compose logs -f api
```
- API: `http://localhost:4000`
- MySQL: `localhost:3306` (usuário: `app`, senha: `app`, base: `appdb`)

### Front-end (React)
```bash
# na raiz onde está a pasta /src do React
npm install
npm run dev        # ou npm start, conforme seu setup
# abrir http://localhost:3000
```
Confirme `src/utils/api.js`:
```js
export const API_BASE = "http://localhost:4000";
```

### Tema/Estilos
Importe o tema **uma vez**:
```jsx
// src/main.jsx (ou App.jsx)
import "./styles/theme.css";
```

---

## Variáveis de Ambiente
**API (Node/Express):**
- `PORT` — porta da API (padrão `4000`)
- `DB_HOST` — host do MySQL (no Compose use `db`)
- `DB_USER` — usuário (padrão `app`)
- `DB_PASSWORD` — senha (padrão `app`)
- `DB_NAME` — database (padrão `appdb`)
- `DB_PORT` — porta MySQL (padrão `3306`)

> No Docker Compose, os padrões acima já vêm configurados.

---

## Banco de Dados

### Schema (resumo)
```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  url VARCHAR(2048) NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

### Seeds (exemplo)
```sql
INSERT INTO posts (title, body) VALUES
('Post 1', 'Lorem ipsum 1'),
('Post 2', 'Lorem ipsum 2'),
('Post 3', 'Lorem ipsum 3');

INSERT INTO photos (post_id, url) VALUES
(1, 'https://picsum.photos/id/101/600/400'),
(2, 'https://picsum.photos/id/102/600/400'),
(3, 'https://picsum.photos/id/103/600/400');
```
**Acessar o MySQL (container):**
```bash
docker compose exec db mysql -u app -papp appdb
```

---

## API REST

**Base:** `http://localhost:4000/api`

### Endpoints

#### Health
```http
GET /api/health
```
**200**
```json
{ "status": "ok" }
```

#### Listar posts
```http
GET /api/posts
```
**200**
```json
[
  { "id": 1, "title": "Post 1", "body": "Lorem ipsum 1" },
  { "id": 2, "title": "Post 2", "body": "Lorem ipsum 2" }
]
```

#### Listar fotos
```http
GET /api/photos
```
**200**
```json
[
  { "id": 1, "post_id": 1, "url": "https://..." },
  { "id": 2, "post_id": 2, "url": "https://..." }
]
```

#### Detalhe (com capa)
```http
GET /api/posts/:id
```
**200**
```json
{ "id": 1, "title": "Post 1", "body": "Lorem ipsum 1", "cover": "https://..." }
```
**404**
```json
{ "error": "Post não encontrado" }
```

#### Criar post
```http
POST /api/posts
Content-Type: application/json
```
**Body**
```json
{ "title": "Meu post", "body": "Conteúdo...", "cover": "https://..." }
```
**201**
```json
{ "id": 10, "title": "Meu post", "body": "Conteúdo...", "cover": "https://..." }
```
**400**
```json
{ "error": "title e body são obrigatórios (envie JSON ou x-www-form-urlencoded)" }
```

#### Atualizar post (parcial)
```http
PUT /api/posts/:id
Content-Type: application/json
```
**Body (exemplos)**
```json
{ "title": "Novo título" }
```
```json
{ "cover": null }  // remove capa
```
**200**
```json
{ "id": 10, "title": "Novo título", "body": "Conteúdo...", "cover": null }
```

#### Excluir post
```http
DELETE /api/posts/:id
```
**204** (sem corpo)
**404** `{ "error": "Post não encontrado" }`

### Exemplos cURL
```bash
curl http://localhost:4000/api/posts
curl http://localhost:4000/api/posts/1

curl -X POST http://localhost:4000/api/posts   -H "Content-Type: application/json"   -d '{"title":"Novo","body":"Texto","cover":"https://picsum.photos/seed/x/600/400"}'

curl -X PUT http://localhost:4000/api/posts/1   -H "Content-Type: application/json"   -d '{"title":"Editado"}'

curl -i -X DELETE http://localhost:4000/api/posts/1
```

---

## Frontend (Rotas/Fluxos)

- `/` — **Home**
  Busca por título, grid de cards (capa, título, resumo, **“Veja mais”**), **form de criar** no topo, **“Load more posts”**.
- `/posts/:id` — **Detalhe**
  Exibe capa + conteúdo completo. Toolbar com **+ Novo**, **Editar**, **Excluir**.
- `/admin/posts/new` — **Criar** (form dedicado)
- `/admin/posts/:id/edit` — **Editar**
- `/admin/posts` — (opcional) gerenciador com ações nos cards

---

## Comandos Úteis (Docker)
```bash
# reconstruir tudo (inclui init.sql)
docker compose down -v
docker compose up -d --build

# entrar no shell da API (Alpine usa sh)
docker compose exec api sh

# logs ao vivo da API
docker compose logs -f api

# banco (MySQL)
docker compose exec db mysql -u app -papp appdb
```

---

## Solução de Problemas
- **Porta 4000 ocupada**
  Troque no `docker-compose.yml` para `4001:4000` e ajuste `API_BASE`.
- **getaddrinfo ENOTFOUND db**
  Rode a API **dentro** do Compose (use `DB_HOST=db`). Fora do Compose, use `DB_HOST=127.0.0.1`.
- **TypeError: Cannot destructure req.body**
  Garanta `app.use(express.json());` e envie `Content-Type: application/json`.
- **Failed to fetch (frontend)**
  Verifique `API_BASE`, CORS (`app.use(cors())`) e se a API está up (`docker compose logs -f api`).
- **React Router “module has no exports”**
  Instale no **frontend**: `npm i react-router-dom@6`.
- **Prettier/CRLF (␍)**
  Ajuste `.prettierrc` (`"endOfLine": "auto"`) **ou** desative a regra `prettier/prettier` no ESLint.

---

## Licença
MIT — use, adapte e contribua.
