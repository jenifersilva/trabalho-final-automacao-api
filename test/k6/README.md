# Testes de Performance com K6

## `test/k6/getExpenses.js`

O arquivo `test/k6/getExpenses.js` implementa um teste de performance para a API de despesas. Ele utiliza os seguintes conceitos:

### Thresholds

Thresholds são limites de desempenho definidos para garantir que a API atenda aos requisitos esperados. No exemplo abaixo, foram configurados thresholds para:

- **Duração das requisições**: 95% das requisições devem ser concluídas em até 2 segundos.
- **Taxa de falhas**: Menos de 1% das requisições podem falhar.

```js
thresholds: {
  http_req_duration: ["p(95)<2000"],
  http_req_failed: ["rate<0.01"],
},
```

### Checks

Checks são validações que garantem que as respostas da API atendam aos critérios esperados. No exemplo abaixo, os checks verificam:

- O status da resposta (200 OK).
- Se a resposta contém os dados esperados.

```js
check(responseExpenses, {
  "getExpenses status 200": (r) => r.status === 200,
});
```

### Helpers

Helpers são funções reutilizáveis que simplificam o código. No exemplo abaixo, a função `login` é um helper que realiza a autenticação e retorna o token JWT.

```js
export function login(username, password) {
  const url = `${getBaseUrl()}/users/login`;
  const payload = JSON.stringify({ username: username, password: password });
  const params = { headers: { "Content-Type": "application/json" } };
  const res = http.post(url, payload, params);
  return res.json("token");
}
```

### Trends

Trends são métricas personalizadas que coletam dados sobre o desempenho da API. No exemplo abaixo, a métrica `get_expenses_duration` registra o tempo de cada requisição ao endpoint `/expenses`.

```js
const getExpensesTrend = new Trend("get_expenses_duration");
...
getExpensesTrend.add(res.timings.duration);
```

### Variável de Ambiente

As variáveis de ambiente permitem configurar dinamicamente a URL base da API e outros parâmetros. No exemplo abaixo, a variável `BASE_URL` é usada para definir a URL da API.

```js
export function getBaseUrl() {
  return __ENV.BASE_URL || "http://localhost:3000";
}
```

### Stages

Stages simulam diferentes níveis de carga, como ramp-up, steady-state e ramp-down. No exemplo abaixo, os stages aumentam e diminuem o número de usuários virtuais (VUs).

```js
stages: [
  { duration: "10s", target: 5 }, // Durante 10 segundos, o k6 vai aumentar a quantidade de usuários virtuais de 0 para 5 VUs (ramp-up)
  { duration: "20s", target: 10 }, // Após chegar em 5 usuários, durante 20 segundos o k6 vai subir gradualmente até 10 VUs
  { duration: "10s", target: 0 }, // Durante 10 segundos, o k6 vai reduzir os usuários de 10 para 0 VUs (ramp-down)
];
```

### Reaproveitamento de Resposta e Uso de Token de Autenticação

- **Reaproveitamento de Resposta**: Significa que você usa dados retornados por uma requisição anterior para executar outra requisição.
- **Uso de Token de Autenticação**: Chave que prova que o usuário está autorizado

No exemplo abaixo, o token obtido no login é reutilizado para autenticação nas requisições subsequentes, garantindo que o fluxo de autenticação seja validado.

```js
token = login(username, password);

res = http.get(`${getBaseUrl()}/expenses`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

### Data-Driven Testing

Permite a utilização de dados de um arquivo externo para simular diferentes cenários e validar a API com múltiplos conjuntos de dados. No exemplo abaixo, uma lista de usuários é obtida do arquivo `login.test.data.json`, e cada VU use um usuário diferente, sempre que possível. Se tiver mais VUs do que usuários, o array “repete” corretamente.

```js
const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/login.test.data.json"));
});

const user = users[(__VU - 1) % users.length];
```

### Groups

Groups organizam o teste em blocos lógicos, facilitando a leitura e o entendimento do fluxo. No exemplo abaixo, os grupos incluem Login, Get Expenses e Verify Response.

```js
group("Login", () => {
  token = login(username, password);
});
```

## `test/k6/registerUser.js`

O arquivo `test/k6/registerUser.js` implementa um teste de performance para a API de usuários. Ele utiliza, além dos conceitos acima, a biblioteca Faker:

### Faker

Faker é usado para gerar dados dinâmicos, como nomes de usuário e senhas, garantindo que os testes sejam variados e realistas. No exemplo abaixo, o Faker é utilizado para gerar senhas.

```js
const payload = JSON.stringify({
  username: randomUsername(),
  password: faker.internet.password(),
});
```

## Executando os Testes

1. Inicie a aplicação:

```sh
npm run start-rest
```

2. Execute o teste:

```sh
k6 run test/k6/getExpenses.test.js -e BASE_URL=http://localhost:3000
k6 run test/k6/registerUser.test.js -e BASE_URL=http://localhost:3000
```

3. Gere um relatório em HTML:

```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT="test/k6/report_expenses.html" K6_WEB_DASHBOARD_PERIOD=1s k6 run test/k6/getExpenses.test.js -e BASE_URL=http://localhost:3000
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT="test/k6/report_register.html" K6_WEB_DASHBOARD_PERIOD=1s k6 run test/k6/registerUser.test.js -e BASE_URL=http://localhost:3000
```

Relatórios gerados: `test/k6/report_expenses.html` e `test/k6/report_register.html`
