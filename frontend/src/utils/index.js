export function toNumber(input) {
  if (!input) return 0;
  const chunks = input.split(' ');
  if (!chunks[0]) return 0;
  return Number(chunks[0]);
}

export const TOKEN_SMARTCONTRACT = process.env.REACT_APP_TOKEN_SMARTCONTRACT;

export const NETWORK_HOST = process.env.REACT_APP_NETWORK_HOST;

export const SYSTEM_DOMAIN = process.env.REACT_APP_SYSTEM_DOMAIN;

export const CORE_SYMBOL = process.env.REACT_APP_CORE_SYMBOL;

export const NUMBER_CHOICE_LIMIT = 6;

export const TOTAL_GAME_NUMBERS = 45;

export const isProduction = process.env.NODE_ENV === 'production';

export function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}
