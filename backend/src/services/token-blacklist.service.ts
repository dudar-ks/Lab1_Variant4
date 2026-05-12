import jwt from "jsonwebtoken";

const blacklistedTokens = new Map<string, number>();

function cleanupExpiredTokens(): void {
  const now = Date.now();

  for (const [token, expiresAt] of blacklistedTokens.entries()) {
    if (expiresAt <= now) {
      blacklistedTokens.delete(token);
    }
  }
}

export function blacklistToken(token: string): void {
  const decoded = jwt.decode(token);

  let expiresAt = Date.now() + 60 * 60 * 1000;

  if (
    decoded &&
    typeof decoded === "object" &&
    typeof decoded.exp === "number"
  ) {
    expiresAt = decoded.exp * 1000;
  }

  blacklistedTokens.set(token, expiresAt);
  cleanupExpiredTokens();
}

export function isTokenBlacklisted(token: string): boolean {
  cleanupExpiredTokens();

  return blacklistedTokens.has(token);
}