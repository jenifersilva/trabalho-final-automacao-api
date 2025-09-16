# API de Despesas

API RESTful para registro de usuários, login e controle de despesas, com autenticação JWT e documentação Swagger.

## Instalação

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd trabalho-final-automacao-api
   ```
2. Instale as dependências:
   ```sh
   npm install express jsonwebtoken bcryptjs swagger-ui-express
   ```

## Execução

```sh
node server.js
```

Acesse a documentação Swagger em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints principais

- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login (retorna JWT)
- `GET /users` — Lista usuários (apenas para debug)
- `POST /expenses` — Registrar despesa (requer JWT)
- `GET /expenses` — Consultar despesas (requer JWT)
- `PUT /expenses/:id` — Editar despesa (requer JWT)

## Autenticação JWT

1. Faça login em `/users/login` para obter o token JWT.
2. Envie o token no header `Authorization: Bearer <token>` para acessar rotas de despesas.

## Testes

A aplicação está pronta para ser testada com Supertest importando o `app.js`.

---

Documentação completa no Swagger: `/api-docs`
