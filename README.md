# API de Despesas

API RESTful para registro de usuários, login e controle de despesas, com autenticação JWT, documentação Swagger e testes automatizados usando Mocha, Chai, Supertest e Sinon.

## Tecnologias Utilizadas

- Node.js com Express
- JWT para autenticação
- BCrypt para criptografia de senhas
- Swagger UI para documentação
- Mocha para testes
- Chai para asserções
- Supertest para testes de API
- Sinon para mocks
- Mochawesome para relatórios de testes
- Dotenv para variáveis de ambiente

## Instalação

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd trabalho-final-automacao-api
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure o ambiente:
   ```sh
   cp .env.example .env
   ```
   Ajuste as variáveis em `.env` conforme necessário.

## Execução

Para iniciar o servidor:
```sh
npm start
```

O servidor estará rodando em: [http://localhost:3000](http://localhost:3000)
A documentação Swagger estará em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints

### Usuários

- `POST /users/register` — Registro de novo usuário
  - Request: `{ "username": "string", "password": "string" }`
  - Response: `{ "message": "Usuário registrado com sucesso" }`

- `POST /users/login` — Autenticação de usuário
  - Request: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`

- `GET /users` — Lista usuários (debug)
  - Response: `{ "users": [{ "username": "string" }] }`

### Despesas (Requer Autenticação)

- `POST /expenses` — Criar despesa
  - Request: `{ "description": "string", "value": number, "date": "YYYY-MM-DD" }`
  - Response: Objeto da despesa criada
  - Validações:
    - Todos os campos são obrigatórios
    - Valores não podem ser vazios

- `GET /expenses` — Listar despesas do usuário
  - Response: Array de despesas do usuário autenticado

- `PUT /expenses/:id` — Atualizar despesa
  - Request: Campos opcionais `{ "description": "string", "value": number, "date": "YYYY-MM-DD" }`
  - Response: Objeto da despesa atualizada
  - Regras:
    - Somente description, value e date podem ser alterados
    - Campos vazios não são permitidos
    - Pelo menos um campo deve ser fornecido

- `DELETE /expenses/:id` — Excluir despesa
  - Response: 
    ```json
    {
      "message": "Despesa excluída com sucesso",
      "deletedExpense": { ... }
    }
    ```
  - Validações:
    - Verifica se a despesa existe
    - Verifica se a despesa pertence ao usuário

## Regras de Negócio

### Despesas

1. **Criação**:
   - Todos os campos são obrigatórios (description, value, date)
   - Vinculada automaticamente ao usuário autenticado

2. **Edição**:
   - Somente description, value e date podem ser alterados
   - Campos vazios não são permitidos
   - Pelo menos um campo deve ser informado para atualização

3. **Exclusão**:
   - Somente o proprietário pode excluir suas despesas
   - Retorna a despesa excluída na resposta

4. **Listagem**:
   - Retorna apenas as despesas do usuário autenticado
   - Ordenadas por data de criação

## Autenticação

A API utiliza autenticação JWT (JSON Web Token):

1. Obtenha um token via `/users/login`
2. Inclua o token no header: `Authorization: Bearer <token>`
3. Token expira em 1 hora

## Testes

A aplicação possui dois tipos de testes:

### Testes de Integração

Testam o fluxo completo das requisições:
```sh
npm test
```

### Testes com Mocks

Testam os controllers isoladamente usando Sinon para mockar serviços:
```sh
npm run test-controller-rest
```

Os testes cobrem:
- Registro de usuário (sucesso e erros)
- Login (sucesso e erros)
- Validações de entrada
- Autenticação JWT
- Gestão de despesas (CRUD completo)
- Regras de negócio específicas

### Relatórios de Testes

Os testes geram relatórios HTML usando Mochawesome em `mochawesome-report/mochawesome.html`

## Estrutura do Projeto

```
.
├── config/
│   └── jwt.js              # Configurações JWT
├── controller/
│   ├── authMiddleware.js   # Middleware de autenticação
│   ├── userController.js   # Rotas de usuário
│   └── expenseController.js # Rotas de despesas
├── docs/
│   └── swagger.json        # Documentação API
├── model/
│   ├── userModel.js       # Modelo de usuários
│   └── expenseModel.js    # Modelo de despesas
├── service/
│   ├── userService.js     # Lógica de usuários
│   └── expenseService.js  # Lógica de despesas
├── test/
│   └── rest/
│       ├── controller/    # Testes dos controllers
│       └── fixture/       # Dados para testes
├── app.js                 # Configuração Express
├── server.js             # Entrada da aplicação
└── .env                  # Variáveis de ambiente
```

## Variáveis de Ambiente

- `BASE_URL_REST`: URL base para testes (default: http://localhost:3000)
- `PORT`: Porta do servidor (default: 3000)
- `JWT_SECRET`: Chave secreta para JWT (default: supersecretkey)

## CI/CD

O projeto utiliza GitHub Actions para:
- Executar testes a cada pull request
- Executar testes a cada push na branch main
- Gerar relatórios de testes

## Documentação

Documentação completa e interativa disponível via Swagger UI em `/api-docs`, incluindo:
- Descrição detalhada de todos os endpoints
- Exemplos de requests e responses
- Schemas de dados
- Códigos de erro
- Autenticação
