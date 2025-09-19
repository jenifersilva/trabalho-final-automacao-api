const request = require("supertest");
const { expect, use } = require("chai");

const chaiExclude = require("chai-exclude");
use(chaiExclude);

require("dotenv").config();

describe("Expense External - HTTP Rest", () => {
  before(async () => {
    const loginRequest = require("../../fixture/requests/user/loginRequest.json");
    const respostaLogin = await request(process.env.BASE_URL_REST)
      .post("/users/login")
      .send(loginRequest);

    token = respostaLogin.body.token;
  });

  describe("POST /expenses", () => {
    const businessErrorsTests = require("../../fixture/requests/expense/createExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_REST)
          .post("/expenses")
          .set("Authorization", `Bearer ${token}`)
          .send(test.createExpense);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve retornar erro quando a inclusão de uma despesa for feita sem token de autenticação", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const response = await request(process.env.BASE_URL_REST)
        .post("/expenses")
        .send(expenseRequest);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal("Token não fornecido");
    });

    it("Deve registrar uma despesa com sucesso", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const response = await request(process.env.BASE_URL_REST)
        .post("/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send(expenseRequest);

      const expectedResponse = require("../../fixture/responses/expense/createExpenseSuccessfulResponse.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body)
        .excluding(["date", "id"])
        .to.deep.equal(expectedResponse.body);
      expenseId = response.body.id;
    });
  });

  describe("PUT /expenses", () => {
    const expenseId = 1;

    const businessErrorsTests = require("../../fixture/requests/expense/editExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_REST)
          .put(`/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .send(test.editExpense);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve retornar erro quando a edição de uma despesa for feita sem token de autenticação", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const response = await request(process.env.BASE_URL_REST)
        .put(`/expenses/${expenseId}`)
        .send(expenseRequest);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal("Token não fornecido");
    });

    it("Deve editar uma despesa com sucesso", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const response = await request(process.env.BASE_URL_REST)
        .put(`/expenses/${expenseId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(expenseRequest);

      const expectedResponse = require("../../fixture/responses/expense/editExpenseSuccessfulResponse.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body)
        .excluding("date")
        .to.deep.equal(expectedResponse.body);
    });
  });
});
