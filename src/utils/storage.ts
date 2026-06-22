export function readStorageValue<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') {
      return fallback;
    }

    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorageValue<T>(key: string, value: T) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}
