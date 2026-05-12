import ApiError from "../errors/ApiError";

type LoginAttemptInfo = {
  failedCount: number;
  blockedUntil: number;
};

const attempts = new Map<string, LoginAttemptInfo>();

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_TIME_MS = 60 * 1000; // 1 хвилина

function getKey(email: string, ip: string): string {
  return `${email.toLowerCase()}::${ip}`;
}

export function checkLoginAllowed(email: string, ip: string): void {
  const key = getKey(email, ip);
  const info = attempts.get(key);

  if (!info) return;

  const now = Date.now();

  if (info.blockedUntil > now) {
    const secondsLeft = Math.ceil((info.blockedUntil - now) / 1000);

    throw new ApiError(
      429,
      "TOO_MANY_LOGIN_ATTEMPTS",
      `Too many login attempts. Try again in ${secondsLeft} seconds.`
    );
  }

  if (info.blockedUntil !== 0 && info.blockedUntil <= now) {
    attempts.delete(key);
  }
}

export function recordFailedLogin(email: string, ip: string): void {
  const key = getKey(email, ip);
  const now = Date.now();

  const current = attempts.get(key) ?? {
    failedCount: 0,
    blockedUntil: 0
  };

  const failedCount = current.failedCount + 1;

  attempts.set(key, {
    failedCount,
    blockedUntil: failedCount >= MAX_FAILED_ATTEMPTS ? now + BLOCK_TIME_MS : 0
  });
}

export function clearFailedLogins(email: string, ip: string): void {
  const key = getKey(email, ip);
  attempts.delete(key);
}