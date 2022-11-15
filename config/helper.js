const statusEncode = [
  "Waiting for verification",
  "Complete",
  "Disable",
  "Pending",
  "Lock",
];
const transistionStatusEncode = ["Pending", "Success", "Approved", "Denied"];

const moment = require("moment");

const formatDateTime = (dateTime) =>
  moment(dateTime).format("MMMM Do YYYY, h:mm:ss a");

const formatDateTime2 = (dateTime) =>
  moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

const formatCash = (str) => {
  return str
    .split("")
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ",") + prev;
    });
};

const dataProcess = (data) => Object.values(JSON.parse(JSON.stringify(data)));

const formatDate = (dateTime) => moment(dateTime).format("MMMM Do YYYY");

const encodeStatusCode = (status) => {
  switch (+status) {
    case 0:
      return `<td class="text-warning font-weight-bold"><i class="fa fa-exclamation"></i> ${
        statusEncode[+status]
      }</td>`;
    case 1:
      return `<td class="text-success font-weight-bold"><i class="fa fa-check "></i> ${
        statusEncode[+status]
      }</td>`;
    case 2:
      return `<td class="text-muted font-weight-bold"><i class="fa fa-ban "></i> ${
        statusEncode[+status]
      }</td>`;
    case 3:
      return `<td class="text-secondary font-weight-bold"><i class="fas fa-circle-notch fa-spin"></i> ${
        statusEncode[+status]
      }</td>`;
    default:
      return `<td class="text-danger font-weight-bold"><i class="fas fa-clock"></i> ${
        statusEncode[+status]
      }</td>`;
  }
};

const encodeTransistionCode = (status) => {
  switch (+status) {
    case 0:
      return `<td class="text-secondary font-weight-bold"><i class="fas fa-circle-notch fa-spin"></i> ${
        transistionStatusEncode[+status]
      }</td>`;
    case 1:
      return `<td class="text-primary font-weight-bold"><i class="fa-solid fa-thumbs-up "></i> ${
        transistionStatusEncode[+status]
      }</td>`;
    case 2:
      return `<td class="text-success font-weight-bold"><i class="fa fa-check "></i> ${
        transistionStatusEncode[+status]
      }</td>`;
    default:
      return `<td class="text-danger font-weight-bold"><i class="fa fa-exclamation"></i> ${transistionStatusEncode[3]}</td>`;
  }
};

const generateCode = (provider_number) => {
  let result = [provider_number];
  let characters = "0123456789";
  for (let i = 0; i < 5; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * characters.length))
    );
  }
  return result.join("");
};

const generateUsername = (from, to) => {
  return Math.floor(from + Math.random() * to);
};

const generateRandomPassword = (numCharacters) => {
  let result = "";
  let ranCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersNumber = ranCharacters.length;
  for (let i = 0; i < numCharacters; i++) {
    result += ranCharacters.charAt(
      Math.floor(Math.random() * charactersNumber)
    );
  }
  return result;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const formatMoney = (money)=> new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(money)

module.exports = {
  formatDateTime,
  formatDateTime2,
  dataProcess,
  formatDate,
  encodeStatusCode,
  generateCode,
  generateUsername,
  generateRandomPassword,
  sleep,
  encodeTransistionCode,
  formatCash,
  formatMoney
};
