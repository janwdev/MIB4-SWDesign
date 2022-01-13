import {RegistrationManager} from '../src/classes/registrationManager';

test('test password 12345 to be false', () => {
    expect(RegistrationManager.testPasswordSecurity('12345')).toBe(false);
  });

  test('test password Abc1234567* to be true', () => {
    expect(RegistrationManager.testPasswordSecurity('Abc1234567*')).toBe(true);
  });

  test('test password abc123456he* to be false', () => {
    expect(RegistrationManager.testPasswordSecurity('abc123456he*')).toBe(false);
  });

  test('test password dhvuesudoD$2 to be true', () => {
    expect(RegistrationManager.testPasswordSecurity('dhvuesudoD$2')).toBe(true);
  });