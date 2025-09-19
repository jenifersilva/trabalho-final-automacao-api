const request = require("supertest");
const { expect } = require("chai");

require("dotenv").config();

describe("User External - HTTP Rest", () => {
  describe("POST /users/register", () => {
    const businessErrorsTests = require("../../fixture/requests/user/createUserRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_REST)
          .post("/users/register")
          .send(test.createUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve criar usuário com sucesso", async () => {
      const response = await request(process.env.BASE_URL_REST)
        .post("/users/register")
        .send({
          username: `user${Math.random()}`,
          password: "password",
        });

      const expectedResponse = require("../../fixture/responses/user/createUserResponseSuccessful.json");
      expect(response.status).to.equal(expectedResponse.statusCode);
      expect(response.body).to.deep.equal(expectedResponse.body);
    });
  });

  describe("POST /users/login", () => {
    const businessErrorsTests = require("../../fixture/requests/user/loginRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_REST)
          .post("/users/login")
          .send(test.loginUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.message).to.equal(test.expectedMessage);
      });
    });

    it("Deve realizar o login com sucesso", async () => {
      const loginRequest = require("../../fixture/requests/user/loginRequest.json");
      const response = await request(process.env.BASE_URL_REST)
        .post("/users/login")
        .send(loginRequest);
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.not.null;
    });
  });
});
