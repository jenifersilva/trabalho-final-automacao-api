import http from "k6/http";
import { check, group, sleep } from "k6";
import { SharedArray } from "k6/data";
import { Trend } from "k6/metrics";
import { getBaseUrl } from "./helpers/getBaseUrl.js";
import { randomUsername } from "./helpers/randomUsername.js";
import { login } from "./helpers/login.js";
import faker from "k6/x/faker";

const postRegisterTrend = new Trend("post_register_duration");

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "20s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.01"],
  },
};

const users = new SharedArray("users", function () {
  return JSON.parse(open("./data/login.test.data.json"));
});

export default function () {
  let token, res;

  group("Login", () => {
    const userLogin = users[(__VU - 1) % users.length];

    let username = userLogin.username,
      password = userLogin.password;

    token = login(username, password);
  });

  group("Register users", () => {
    const url = `${getBaseUrl()}/users/register`;
    const payload = JSON.stringify({
      username: randomUsername(),
      password: faker.internet.password(),
    });
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    res = http.post(url, payload, params);

    postRegisterTrend.add(res.timings.duration);
  });

  group("Verify response", () => {
    check(res, {
      "register status 200": (r) => r.status === 201,
      "response is not empty": (r) => r.json().length > 0,
    });
  });

  sleep(1);
}
