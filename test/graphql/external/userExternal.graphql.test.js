const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('User External - GraphQL', () => {
  describe('register mutation', () => {
    const businessErrorsTests = require('../../rest/fixture/requests/user/registerRequestWithError.json');
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const mutation = `mutation { register(username: \"${test.createUser.username || ''}\", password: \"${test.createUser.password || ''}\") { message } }`;
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post('/')
          .send({ query: mutation });
        expect(response.body.errors ? response.body.errors[0].message : response.body.data.register.message)
          .to.equal(test.expectedMessage);
      });
    });

    it('Deve criar usuário com sucesso', async () => {
      const username = `user${Math.floor(Math.random() * 100000)}`;
      const mutation = `mutation { register(username: \"${username}\", password: \"password\") { message } }`;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post('/')
        .send({ query: mutation });
      expect(response.body.data.register.message).to.equal('Usuário registrado com sucesso');
    });
  });

  describe('login query', () => {
    const businessErrorsTests = require('../../rest/fixture/requests/user/loginRequestWithError.json');
    businessErrorsTests.forEach((test) => {
      it(`${test.testName}`, async () => {
        const query = `query { login(username: \"${test.loginUser.username || ''}\", password: \"${test.loginUser.password || ''}\") { token } }`;
        const response = await request(process.env.BASE_URL_GRAPHQL)
          .post('/')
          .send({ query });
        if (test.statusCode === 200) {
          expect(response.body.data.login.token).to.be.a('string');
        } else {
          expect(response.body.errors[0].message).to.equal(test.expectedMessage);
        }
      });
    });

    it('Deve realizar o login com sucesso', async () => {
      const loginRequest = require('../../rest/fixture/requests/user/loginRequest.json');
      const query = `query { login(username: \"${loginRequest.username}\", password: \"${loginRequest.password}\") { token } }`;
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post('/')
        .send({ query });
      expect(response.body.data.login.token).to.be.a('string');
    });
  });
});
