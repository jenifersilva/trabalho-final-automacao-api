const request = require("supertest");
const { expect } = require("chai");
const app = require("../../../app.js");

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
      const response = await request(app)
        .post("/users/register")
        .send({
          username: `user${Math.random()}`,
          password: "password",
        });

      const expectedResponse = require("../fixture/responses/registerSuccessful.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body).to.deep.equal(expectedResponse.body);
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

    it("Deve realizar o login com sucesso", async () => {
      const response = await request(app).post("/users/login").send({
        username: "jenifer",
        password: "password",
      });
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.not.null;
    });
  });
});
