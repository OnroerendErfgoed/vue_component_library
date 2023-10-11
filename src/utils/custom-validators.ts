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
