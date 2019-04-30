import http from "k6/http";
import { check } from "k6";
export const options = {
  vus: 100,
  duration: "5m"
}; //makes 100 users constantly making requests, run for 5 minutes

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUV'.split('');

export default function () {
  function letter () {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  function shortLetter () {
    return alphabet[Math.floor(Math.random() * 10)]; //Last letter available is J
  }
  var ticker = letter() + letter() + letter() + letter() + shortLetter();
  let res = http.get(`http://localhost:3000/stocks/${ticker}`);
  check(res, {
    "status was 200": (r) => r.status == 200,
  });
}
