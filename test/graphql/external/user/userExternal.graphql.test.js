const request = require("supertest");
const { expect } = require("chai");
require("dotenv").config();

describe("User External - GraphQL", () => {
  describe("register Mutation", () => {
    const businessErrorsTests = require("../../../graphql/fixture/requests/user/createUserRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post("/")
          .send(test.createUser);
        expect(response.status).to.equal(test.statusCode);
        expect(response.body.errors[0].message).to.equal(test.expectedMessage);
      });
    });

    it("Deve criar usuário com sucesso", async () => {
      const username = `user${Math.floor(Math.random() * 100000)}`;
      const mutation = `mutation { register(username: \"${username}\", password: \"password\") { message } }`;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .send({ query: mutation });
      expect(response.body.data.register.message).to.equal(
        "Usuário registrado com sucesso"
      );
    });
  });

  describe("login Query", () => {
    const businessErrorsTests = require("../../fixture/requests/user/loginRequestWithError.json");
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post("/")
          .send(test.loginUser);
        expect(response.body.errors[0].message).to.equal(test.expectedMessage);
      });
    });

    it("Deve realizar o login com sucesso", async () => {
      const loginRequest = require("../../fixture/requests/user/loginRequest.json");
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/")
        .send(loginRequest);
      expect(response.body.data.login.token).to.be.a("string");
    });
  });
});
