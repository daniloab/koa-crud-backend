import { ChildProcess, spawn } from 'child_process';
import path from 'path';

const cwd = process.cwd();

export function onExit(childProcess: ChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code: number) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`Exit with error code: ${code}`));
      }
    });
    childProcess.once('error', (err: Error) => {
      reject(err);
    });
  });
}

const runProcess = async (
    command: string,
    args: string[],
    cwdCommand: string,
) => {
  const childProcess = spawn(command, args, {
    stdio: [process.stdin, process.stdout, process.stderr],
    cwd: cwdCommand,
  });

  await onExit(childProcess);
};

const generateSwagger = async () => {
  const command = 'yarn';

  const apiPackage = './src/api';
  const swaggerConfig = './src/swagger/config.js';

  const apiPath = path.join(cwd, apiPackage);

  const swaggerConfigPath = path.join(apiPath, swaggerConfig);

  const userPath = path.join(cwd, './src/api/user');
  const userRegex = `${userPath}/**/*.yml`;

  const args = [
    'swagger-jsdoc',
    '-d',
    swaggerConfigPath,
    userRegex,
    '-o',
  ];

  const argsYml = [...args, './src/swagger.yml'];
  const argsJson = [...args, './src/swagger.json'];

  await runProcess(command, argsYml, apiPath);
  await runProcess(command, argsJson, apiPath);
};

(async () => {
  try {
    await generateSwagger();
  } catch (err) {
    // eslint-disable-next-line
    console.log('err: ', err);
  }

  process.exit(0);
})();
