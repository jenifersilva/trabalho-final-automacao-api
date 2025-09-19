const request = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require("chai-exclude");
use(chaiExclude);
require("dotenv").config();

describe("Expense External - GraphQL", () => {
  before(async () => {
    const loginRequest = require("../../graphql/fixture/requests/user/loginRequest.json");
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/")
      .send(loginRequest);
    token = response.body.data.login.token;
  });

  describe("addExpense mutation", () => {
    const businessErrorsTests = require("../../graphql/fixture/requests/expense/createExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post("/")
          .set("Authorization", `Bearer ${token}`)
          .send({
            query: test.createExpense.query,
            variables: test.createExpense.variables
          });
        if (test.statusCode === 201) {
          expect(response.body.data.addExpense).to.include.keys(
            "id",
            "description",
            "value",
            "date",
            "username"
          );
        } else {
          expect(response.body.errors[0].message).to.equal(test.expectedMessage);
        }
      });
    });

    it("Deve registrar uma despesa com sucesso", async () => {
      const expenseRequest = require("../../graphql/fixture/requests/expense/expenseRequest.json");
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send(expenseRequest);
      expect(response.body.data.addExpense).to.include.keys(
        "id",
        "description",
        "value",
        "date",
        "username"
      );
    });

    it("Deve retornar erro de autenticação se não enviar token", async () => {
      const expenseRequest = require("../../rest/fixture/requests/expense/expenseRequest.json");
      const mutation = `mutation { addExpense(description: "${expenseRequest.description}", value: ${expenseRequest.value}, date: "${expenseRequest.date}") { id description value date username } }`;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .send({ query: mutation });
      expect(response.body.errors[0].message).to.equal("Not authenticated");
    });
  });

  describe("editExpense mutation", () => {
    const businessErrorsTests = require("../../graphql/fixture/requests/expense/editExpenseRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName} (autenticado)`, async () => {
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post("/")
          .set("Authorization", `Bearer ${token}`)
          .send({
            query: test.editExpense.query,
            variables: test.editExpense.variables,
          });

        expect(response.body.errors).to.not.be.undefined;
        expect(response.body.errors[0].message).to.equal(test.expectedMessage);
      });
    });

    it("Deve editar uma despesa com sucesso", async () => {
      const expenseRequest = require("../../rest/fixture/requests/expense/expenseRequest.json");
      const mutation = `mutation { editExpense(id: 1, description: \"${expenseRequest.description}\", value: ${expenseRequest.value}, date: \"${expenseRequest.date}\") { id description value date username } }`;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send({ query: mutation });
      expect(response.body.data.editExpense).excluding(["id"]).to.deep.equal({
        description: expenseRequest.description,
        value: expenseRequest.value,
        date: expenseRequest.date,
        username: "jenifer",
      });
    });

    it("Deve retornar erro de autenticação se não enviar token", async () => {
      const expenseRequest = require("../../rest/fixture/requests/expense/expenseRequest.json");
      const mutation = `mutation { editExpense(id: 1, description: "${expenseRequest.description}", value: ${expenseRequest.value}, date: "${expenseRequest.date}") { id description value date username } }`;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .send({ query: mutation });
      expect(response.body.errors[0].message).to.equal("Not authenticated");
    });
  });
});
