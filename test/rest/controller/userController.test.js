const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../../app.js");
const userService = require("../../../service/userService.js");

describe("User Controller", () => {
  describe("POST /users/register", () => {
    const businessErrorsTests = require("../fixture/requests/registerWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(app)
          .post("/users/register")
          .send(test.createUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve criar usuário com sucesso", async () => {
      const resposta = await request(app)
        .post("/users/register")
        .send({
          username: `user${Math.random()}`,
          password: "password",
        });
      expect(resposta.status).to.equal(201);
    });
  });

  describe("POST /users/login", () => {
    const businessErrorsTests = require("../fixture/requests/loginWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(app)
        .post("/users/login")
        .send(test.loginUser);
      expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve retornar erro quando as credenciais forem inválidas", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          username: "user",
          password: `password${Math.random()}`,
        });
      expect(response.status).to.equal(401);
    });
  });
});
