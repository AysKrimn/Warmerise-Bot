const createCookieString = (cookies: Record<string, string>): string => {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
};

export default createCookieString;
