export async function poll<T>(fn: () => Promise<T>, fnCondition: (result: T) => boolean, ms = 1000, timeout = 30000) {
  let retries = timeout / ms;
  let result = await fn();

  while (retries-- > 0 && fnCondition(result)) {
    await wait(ms);
    result = await fn();
  }

  if (retries < 0) {
    console.error(`Polling result - timeout after ${timeout} ms...`);
  }
  return result;
}

const wait = (ms = 1000) => {
  return new Promise((resolve) => {
    console.log(`Polling result - waiting ${ms} ms...`);
    setTimeout(resolve, ms);
  });
};
