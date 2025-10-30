export function checkMembership(language: string, s: string): boolean {
  language = language.trim();
  if (language === 'a^n b^n') {
    const m = s.match(/^(a+)(b+)$/);
    return !!m && m[1].length === m[2].length;
  }
  if (language === 'a^n b^n c^n') {
    const m = s.match(/^(a+)(b+)(c+)$/);
    return !!m && m[1].length === m[2].length && m[2].length === m[3].length;
  }
  if (language === '(ab)^n') {
    return /^(?:ab)+$/.test(s);
  }

  try {
    if (language.startsWith('/') && language.lastIndexOf('/') > 0) {
      const last = language.lastIndexOf('/');
      const pattern = language.slice(1, last);
      const flags = language.slice(last + 1);
      const re = new RegExp(pattern, flags);
      return re.test(s);
    }
  } catch (e) {
    // ignore invalid regex
  }

  return false;
}
