const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../../app.js");
const userService = require("../../../service/userService.js");

describe("User Controller - Mocked", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /users/register", () => {
    const businessErrorsTests = require("../fixture/requests/registerWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const error = new Error(test.expectedMessage);
        error.status = test.statusCode;
        sinon.stub(userService, "registerUser").returns(error);

        const response = await request(app)
          .post("/users/register")
          .send(test.createUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve criar usuário com sucesso", async () => {
      const expectedResponse = require("../fixture/responses/registerSuccessful.json");
      sinon.stub(userService, "registerUser").resolves({
        message: expectedResponse.body.message,
        user: { username: "user", password: "password" },
      });

      const response = await request(app).post("/users/register").send({
        username: "username",
        password: "password",
      });

      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body).to.deep.equal(expectedResponse.body);
    });
  });

  describe("POST /users/login", () => {
    const businessErrorsTests = require("../fixture/requests/loginWithError.json");

    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const error = new Error(test.expectedMessage);
        error.status = test.statusCode;
        sinon.stub(userService, "validateUser").rejects(error);

        const response = await request(app)
          .post("/users/login")
          .send(test.loginUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve realizar o login com sucesso", async () => {
      sinon.stub(userService, "validateUser").resolves({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken",
      });

      const response = await request(app).post("/users/login").send({
        username: "username",
        password: "password",
      });

      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.not.null;
    });
  });
});
