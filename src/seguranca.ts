import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function gerarHash(senha: string): string {
  const sal = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, sal, 64).toString('hex');
  return `${sal}:${hash}`;
}

export function verificarSenha(senha: string, armazenado: string): boolean {
  const [sal, hash] = armazenado.split(':');
  if (!sal || !hash) {
    return false;
  }
  const calculado = scryptSync(senha, sal, 64);
  const original = Buffer.from(hash, 'hex');
  return calculado.length === original.length && timingSafeEqual(calculado, original);
}
