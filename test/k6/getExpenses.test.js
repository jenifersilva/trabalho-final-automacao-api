import http from "k6/http";
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { group } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(90)<=6", "p(95)<=7"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  let token = "";
  let responseExpenses = "";

  group("Login", () => {
    let responseLogin = http.post(
      "http://localhost:3000/users/login",
      JSON.stringify({ username: "jenifer", password: "password" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    token = responseLogin.json("token");
  });

  group("Get expenses", () => {
    responseExpenses = http.get("http://localhost:3000/expenses", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  });

  group("Verify response", () => {
    expect(responseExpenses.status, "status deve ser 200").toBe(200);
  });
}
