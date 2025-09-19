const request = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require("chai-exclude");
use(chaiExclude);

require("dotenv").config();

const createExpenseRequest = require("../../fixture/requests/expense/createExpenseRequest.json");
const editExpenseRequest = require("../../fixture/requests/expense/editExpenseRequest.json");

describe("Expense External - GraphQL", () => {
  before(async () => {
    const loginRequest = require("../../fixture/requests/user/loginRequest.json");
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/")
      .send(loginRequest);
    token = response.body.data.login.token;
  });

  describe("addExpense Mutation", () => {
    const businessErrorsTests = require("../../fixture/requests/expense/createExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post("/")
          .set("Authorization", `Bearer ${token}`)
          .send(test.addExpense);

        expect(response.status).to.equal(test.statusCode);
        expect(response.body.errors[0].message).to.equal(test.expectedMessage);
      });
    });

    it("Deve retornar erro quando a edição de uma despesa for feita sem token de autenticação", async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .send(createExpenseRequest);

      expect(response.body.errors[0].message).to.equal("Not authenticated");
    });

    it("Deve registrar uma despesa com sucesso", async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send(createExpenseRequest);

      const expectedResponse = require("../../fixture/responses/expense/createExpenseSuccessfulResponse.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body.data.addExpense)
        .excluding(["date", "id"])
        .to.deep.equal(expectedResponse.data.addExpense);
      expenseId = response.body.data.addExpense.id;
    });
  });

  describe("editExpense mutation", () => {
    const expenseId = 1;

    const businessErrorsTests = require("../../fixture/requests/expense/editExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post("/")
          .set("Authorization", `Bearer ${token}`)
          .send(test.editExpense);

        expect(response.body.errors[0].message).to.equal(test.expectedMessage);
      });
    });

    it("Deve retornar erro quando a edição de uma despesa for feita sem token de autenticação", async () => {
      // Use the dynamically created expense ID
      editExpenseRequest.variables.id = expenseId;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .send(editExpenseRequest);
      expect(response.body.errors[0].message).to.equal("Not authenticated");
    });

    it("Deve editar uma despesa com sucesso", async () => {
      // Use the dynamically created expense ID
      editExpenseRequest.variables.id = expenseId;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send(editExpenseRequest);

      const expectedResponse = require("../../fixture/responses/expense/editExpenseSuccessfulResponse.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body.data.editExpense).to.deep.equal(
        expectedResponse.data.editExpense
      );
    });
  });
});
