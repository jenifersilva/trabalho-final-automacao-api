const request = require("supertest");
const sinon = require("sinon");
const { expect, use } = require("chai");
const chaiExclude = require("chai-exclude");
use(chaiExclude);

const app = require("../../../../app.js");
const expenseService = require("../../../../service/expenseService.js");

describe("Expense Controller - Mocked", () => {
  before(async () => {
    const loginRequest = require("../../fixture/requests/user/loginRequest.json");
    const response = await request(app).post("/users/login").send(loginRequest);

    token = response.body.token;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POST /expenses", () => {
    const businessErrorsTests = require("../../fixture/requests/expense/createExpenseRequestWithError.json");

    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const error = new Error(test.expectedMessage);
        error.status = test.statusCode;

        const expenseServiceMock = sinon.stub(expenseService, "addExpense");
        expenseServiceMock.throws(error);

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
      const expectedResponse = require("../../fixture/responses/expense/createExpenseSuccessfulResponse.json");

      const expenseServiceMock = sinon.stub(expenseService, "addExpense");
      expenseServiceMock.returns(expectedResponse.body);

      const response = await request(app)
        .post("/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send(expenseRequest);

      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body).to.deep.equal(expectedResponse.body);
    });
  });

  describe("PUT /expenses/:id", () => {
    const businessErrorsTests = require("../../fixture/requests/expense/editExpenseRequestWithError.json");

    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const error = new Error(test.expectedMessage);
        error.status = test.statusCode;
        const expenseServiceMock = sinon.stub(expenseService, "editExpense");
        expenseServiceMock.throws(error);

        const response = await request(app)
          .put("/expenses/1")
          .set("Authorization", `Bearer ${token}`)
          .send(test.editExpense);

        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve atualizar despesa com sucesso", async () => {
      const expenseRequest = require("../../fixture/requests/expense/expenseRequest.json");
      const expectedResponse = require("../../fixture/responses/expense/editExpenseSuccessfulResponse.json");

      const expenseServiceMock = sinon.stub(expenseService, "editExpense");
      expenseServiceMock.returns(expectedResponse.body);

      const response = await request(app)
        .put("/expenses/1")
        .set("Authorization", `Bearer ${token}`)
        .send(expenseRequest);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedResponse.body);
    });
  });
});
