export function toNumber(input?: string) {
  if (!input) return 0;
  const chunks = input.split(' ');
  if (!chunks[0]) return 0;
  return Number(chunks[0]);
}

export const TOKEN_SMARTCONTRACT = process.env.REACT_APP_TOKEN_SMARTCONTRACT;
