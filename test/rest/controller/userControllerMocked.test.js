const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../../app.js");
const userService = require("../../../service/userService.js");

describe("User Controller", () => {
  describe("POST /users/register", () => {
    it("Deve retornar erro quando o usuário não for informado", async () => {
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.throws(new Error("Usuário e senha obrigatórios"));

      const response = await request(app)
        .post("/users/register")
        .send({
          username: `user${Math.random()}`,
          password: "password",
        });
      console.log(response.body);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Usuário e senha obrigatórios");
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
