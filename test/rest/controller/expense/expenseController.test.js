const request = require("supertest");
const { expect, use } = require("chai");
const app = require("../../../../app.js");

const chaiExclude = require("chai-exclude");
use(chaiExclude);

describe("Expense Controller", () => {
  before(async () => {
    const loginRequest = require("../../fixture/requests/user/loginRequest.json");
    const respostaLogin = await request(app)
      .post("/users/login")
      .send(loginRequest);

    token = respostaLogin.body.token;
  });

  describe("POST /expenses", () => {
    const businessErrorsTests = require("../../fixture/requests/expense/createExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(app)
          .post("/expenses")
          .set("Authorization", `Bearer ${token}`)
          .send(test.createExpense);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve registrar uma despesa com sucesso", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const response = await request(app)
        .post("/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send(expenseRequest);

      const expectedResponse = require("../../fixture/responses/expense/createExpenseSuccessfulResponse.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body)
        .excluding("date")
        .to.deep.equal(expectedResponse.body);
    });
  });

  describe("PUT /expenses/:id", () => {
    const businessErrorsTests = require("../../fixture/requests/expense/editExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(app)
          .put("/expenses/1")
          .set("Authorization", `Bearer ${token}`)
          .send(test.editExpense);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve editar uma despesa com sucesso", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const response = await request(app)
        .put("/expenses/1")
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
