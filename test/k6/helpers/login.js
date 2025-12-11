import http from "k6/http";
import { getBaseUrl } from "./getBaseUrl.js";

export function login(username, password) {
  const url = `${getBaseUrl()}/users/login`;
  const payload = JSON.stringify({ username: username, password: password });
  const params = { headers: { "Content-Type": "application/json" } };
  const res = http.post(url, payload, params);
  return res.json("token");
}
