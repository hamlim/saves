/**
 * Generates a v4 UUID (Universally Unique Identifier)
 * @returns {string} A new v4 UUID
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
