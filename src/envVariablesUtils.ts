import 'dotenv/config';

const REQUIRED_ENV_VARIABLES = ['CLICK_COUNT', 'SLIDO_URL', 'SLIDO_QUESTION'] as const;

type VariableKeys = (typeof REQUIRED_ENV_VARIABLES)[number];

type RequiredEnvVariables = Record<VariableKeys, string>;

let requiredEnvVariables: RequiredEnvVariables | null = null;

// Get required env variables and check whether are defined or not
export const getEnvVariables = (): RequiredEnvVariables => {
  if (!requiredEnvVariables) {
    requiredEnvVariables = REQUIRED_ENV_VARIABLES.reduce(
      (acc: Partial<RequiredEnvVariables>, variableKey) => {
        const variableValue = process.env[variableKey];
        if (!variableValue) {
          new Error(variableKey);
        }

        acc[variableKey] = variableValue;
        return acc;
      },
      {},
    ) as RequiredEnvVariables;
  }

  return requiredEnvVariables;
};
