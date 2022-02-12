import { RegistrationManagerImp } from "../classes/RegistrationManagerImp";

// Units-Tests for password security

let regManager: RegistrationManagerImp = new RegistrationManagerImp();

test("test password 12345 to be false", () => {
  expect(regManager.testPasswordSecurity("12345")).toBe(false);
});

test("test password Abc1234567* to be true", () => {
  expect(regManager.testPasswordSecurity("Abc1234567*")).toBe(true);
});

test("test password abc123456he* to be false", () => {
  expect(regManager.testPasswordSecurity("abc123456he*")).toBe(false);
});

test("test password dhvuesudoD$2 to be true", () => {
  expect(regManager.testPasswordSecurity("dhvuesudoD$2")).toBe(true);
});