import { load } from 'js-yaml';
import fs from 'fs';
import path from 'path';
import nconf from 'nconf';
import * as R from 'ramda';

const pathToConfigDir = path.join(process.cwd(), '/src/server/config');
let { NODE_ENV } = process.env;

const loadEnvConfig = () => {
  if (!NODE_ENV) {
    console.log('NODE_ENV not defined! Defaulting to NODE_ENV=local');
    NODE_ENV = 'local';
  }
  const pathToEnvConfigFile = path.join(pathToConfigDir, `${NODE_ENV}.yaml`);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if(fs.existsSync(pathToEnvConfigFile)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const envConfig = fs.readFileSync(pathToEnvConfigFile, 'utf8');
    return load(envConfig);
  } else {
    console.error(`Config file: ${pathToEnvConfigFile} NOT FOUND.`)
  }
  return {};
}

const loadDefaultConfig = () => {
  const pathToDefaultsFile = path.join(pathToConfigDir, 'defaults.yaml');
  if(fs.existsSync(pathToDefaultsFile)) {
    const defaultConfig = fs.readFileSync(pathToDefaultsFile, 'utf8');
    return load(defaultConfig);
  }
  return {};
}

export const loadConfig = () => {
  const defaultConfig = loadDefaultConfig();
  const envConfig = loadEnvConfig();

  console.log('Loading configuration...');
  nconf.env({
    separator: '__',
    parseValues: true,
  }).defaults(R.mergeDeepRight(defaultConfig, envConfig));

  console.log('Configuration loaded successfully...');
}
