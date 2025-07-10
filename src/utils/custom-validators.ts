// KBO nummer
export const kboValidator = (value: string) => {
  let valid = true;
  if (value) {
    valid =
      /^[0-9]{10}$/.test(value) &&
      value.trim() !== '0000000000' &&
      (parseInt(value.slice(0, -2)) + parseInt(value.slice(-2))) % 97 === 0;
  }
  return valid;
};

// Rijksregisternummer
export const rrnValidator = (value: string) => {
  let valid = false;
  if (value) {
    value = value.replace(/\.|-/g, '').trim();
    if (value.length !== 11) {
      return false;
    }
    const modFunction = (nr: number) => 97 - (nr % 97);
    const checkDigit = parseInt(value.substring(value.length - 2, value.length), 10);
    let nrToCheck = parseInt(value.substring(0, 9), 10);
    const modFunctionNumber = modFunction(nrToCheck);
    if (modFunctionNumber === checkDigit) {
      return true;
    }
    nrToCheck = parseInt('2' + value.substring(0, 9), 10);
    valid = modFunction(nrToCheck) === checkDigit;
  }
  return valid;
};

export const ibanValidator = (value: string | null | undefined) => {
  if (!value) {
    return true;
  }

  // Remove all whitespace characters and convert to uppercase
  const iban = value.replace(/\s+/g, '').toUpperCase();

  // 1. Basic IBAN format check:
  //    - Starts with 2 letters (country code)
  //    - Followed by 2 digits (check digits)
  //    - Followed by 11 to 30 alphanumeric characters (BBAN)
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
    return false;
  }

  // 2. Move the first four characters (country code + check digits) to the end of the string
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // 3. Replace each letter with two digits (A=10, B=11, ..., Z=35)
  const expanded = rearranged.replace(/[A-Z]/g, (char: string) => (char.charCodeAt(0) - 55).toString());

  // 4. Modulo 97 calculation:
  //    - Due to the potentially huge number, process in blocks of up to 9 digits.
  //    - For each block, calculate the remainder and prepend it to the next block.
  let remainder = expanded;
  while (remainder.length > 9) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }

  // The IBAN is valid if the final remainder modulo 97 is equal to 1
  return parseInt(remainder, 10) % 97 === 1;
};

export const bicValidator = (value: string | null | undefined) => {
  if (!value) {
    return true;
  }

  // Remove all whitespace and convert to uppercase
  const bic = value.replace(/\s+/g, '').toUpperCase();

  // Regular expression for BIC/SWIFT code validation
  // [A-Z]{4}    : 4 letters (bank code)
  // [A-Z]{2}    : 2 letters (country code)
  // [A-Z0-9]{2} : 2 letters or digits (location code)
  // ([A-Z0-9]{3})? : optional 3 letters or digits (branch code)
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

  // BIC must be either 8 or 11 characters long and match the pattern
  if ((bic.length === 8 || bic.length === 11) && bicRegex.test(bic)) {
    return true;
  }

  // If it doesn't match, it's not a valid BIC
  return false;
};
