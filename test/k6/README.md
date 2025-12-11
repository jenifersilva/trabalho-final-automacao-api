### Testes de Performance com K6

O arquivo `test/k6/getExpenses.js` implementa um teste de performance para a API de despesas. Ele utiliza os seguintes conceitos:

- **Thresholds**: Definidos para garantir que 95% das requisições devem terminar em até 2 segundos e a taxa de falhas deve ser menor que 1%.

```js
thresholds: {
  http_req_duration: ["p(95)<2000"],
  http_req_failed: ["rate<0.01"],
},
```

- **Checks**: Validações para garantir que a busca de despesas retorne status code 200.

```js
check(responseExpenses, {
  "getExpenses status 200": (r) => r.status === 200,
});
```

- **Helpers**: A função `login` é reutilizada para autenticação.

```js
export function login(username, password) {
  const url = `${getBaseUrl()}/users/login`;
  const payload = JSON.stringify({ username: username, password: password });
  const params = { headers: { "Content-Type": "application/json" } };
  const res = http.post(url, payload, params);
  return res.json("token");
}
```

- **Trends**: Métrica personalizada `get_expenses_duration` coleta o tempo total de cada requisição ao GET expenses.

```js
const getExpensesTrend = new Trend("get_expenses_duration");
...
getExpensesTrend.add(res.timings.duration);
```

- **Variável de Ambiente**: A URL base da API é configurada usando a variável `BASE_URL`.

```js
export function getBaseUrl() {
  return __ENV.BASE_URL || "http://localhost:3000";
}
```

- **Stages**: Simula carga crescente e decrescente com diferentes números de usuários virtuais.

```js
stages: [
  { duration: "10s", target: 5 }, // Durante 10 segundos, o k6 vai aumentar a quantidade de usuários virtuais de 0 para 5 VUs (ramp-up)
  { duration: "20s", target: 10 }, // Após chegar em 5 usuários, durante 20 segundos o k6 vai subir gradualmente até 10 VUs
  { duration: "10s", target: 0 }, // Durante 10 segundos, o k6 vai reduzir os usuários de 10 para 0 VUs (ramp-down)
];
```

- **Reaproveitamento de Resposta e Uso de Token de Autenticação**: O token obtido no login é reutilizado para autenticação nas requisições subsequentes.

```js
token = login(username, password);

res = http.get(`${getBaseUrl()}/expenses`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

- **Data-Driven Testing**: Dados de arquivo externo para testar diferentes cenários.

```js
const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/login.test.data.json"));
});

const user = users[(__VU - 1) % users.length];
```

- **Groups**: O teste é organizado em grupos (Login, Get Expenses e Verify response).

```js
group("Login", () => {
  token = login(username, password);
});
```

O arquivo `test/k6/registerUser.js` implementa um teste de performance para a API de usuários. Ele utiliza os seguintes conceitos:

- **Faker**: Gera dados dinâmicos para senha.

```js
const payload = JSON.stringify({
  username: randomUsername(),
  password: faker.internet.password(),
});
```

#### Executando o Teste

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
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT="test/k6/report.html" K6_WEB_DASHBOARD_PERIOD=1s k6 run test/k6/getExpenses.test.js -e BASE_URL=http://localhost:3000
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT="test/k6/report.html" K6_WEB_DASHBOARD_PERIOD=1s k6 run test/k6/registerUser.test.js -e BASE_URL=http://localhost:3000
```

O relatório será gerado no arquivo `test/k6/report.html`.
