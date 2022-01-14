"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationManager_1 = require("../src/classes/registrationManager");
test('test password 12345 to be false', () => {
    expect(registrationManager_1.RegistrationManager.testPasswordSecurity('12345')).toBe(false);
});
test('test password Abc1234567* to be true', () => {
    expect(registrationManager_1.RegistrationManager.testPasswordSecurity('Abc1234567*')).toBe(true);
});
test('test password abc123456he* to be false', () => {
    expect(registrationManager_1.RegistrationManager.testPasswordSecurity('abc123456he*')).toBe(false);
});
test('test password dhvuesudoD$2 to be true', () => {
    expect(registrationManager_1.RegistrationManager.testPasswordSecurity('dhvuesudoD$2')).toBe(true);
});
//# sourceMappingURL=registrationManager.test.js.map