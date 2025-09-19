const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const userService = require("../../../service/userService.js");
const app = require("../../../app.js");

describe("User Controller - Mocked", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /users/register", () => {
    const businessErrorsTests = require("../fixture/requests/user/registerRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const error = new Error(test.expectedMessage);
        error.status = test.statusCode;
        const userServiceMock = sinon.stub(userService, "registerUser");
        userServiceMock.throws(error);

        const response = await request(app)
          .post("/users/register")
          .send(test.createUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve criar usuário com sucesso", async () => {
      const expectedResponse = require("../fixture/responses/user/registerResponseSuccessful.json");
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.returns({
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
    const businessErrorsTests = require("../fixture/requests/user/loginRequestWithError.json");

    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const error = new Error(test.expectedMessage);
        error.status = test.statusCode;
        const userServiceMock = sinon.stub(userService, "validateUser");
        userServiceMock.throws(error);

        const response = await request(app)
          .post("/users/login")
          .send(test.loginUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve realizar o login com sucesso", async () => {
      const userServiceMock = sinon.stub(userService, "validateUser");
      userServiceMock.returns({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken",
      });

      const loginRequest = require("../fixture/requests/user/loginRequest.json");
      const response = await request(app)
        .post("/users/login")
        .send(loginRequest);

      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.not.null;
    });
  });
});
