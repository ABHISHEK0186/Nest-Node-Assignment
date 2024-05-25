import { isEmail, matches, isUUID, isString, isBoolean } from 'class-validator';

export function validator(keys: object) {
  if (Object.keys(keys).length === 0) {
    return { status: true };
  }
  if (keys['uniqueId']) {
    const valid = isUUID(keys['uniqueId']);
    if (!valid) {
      return { status: false, message: 'Invalid uniqueId' };
    }
  }
  if (keys['email']) {
    const valid = isEmail(keys['email']);
    if (!valid) {
      return { status: false, message: 'Invalid Email' };
    }
  }
  if (keys['phoneNumber']) {
    const valid = matches(keys['phoneNumber'].toString(), /^\d{10}$/);
    if (!valid) {
      return { status: false, message: 'Invalid Phone Number' };
    }
  }
  if (keys['name']) {
    const valid = isString(keys['name']);
    if (!valid) {
      return { status: false, message: 'Invalid value for name' };
    }
  }
  if (keys['isGraduate']) {
    const valid = isBoolean(keys['isGraduate']);
    if (!valid) {
      return { status: false, message: 'Invalid value for isGraduate' };
    }
  }

  return { status: true };
}
