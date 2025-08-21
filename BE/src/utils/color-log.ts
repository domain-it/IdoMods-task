export const LogInfo = (service: string, msg: string) => {
  const currentDate = new Date().toLocaleString();
  return console.log(`${currentDate} - \x1b[32m[${service}]\x1b[0m: ${msg}`);
};

export const LogError = (service: string, msg: string) => {
  const currentDate = new Date().toLocaleString();
  return console.log(`${currentDate} - \x1b[31m[${service}]\x1b[0m: ${msg}`);
};
