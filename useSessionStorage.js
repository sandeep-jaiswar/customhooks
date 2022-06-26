import { useEffect, useState } from "react";

export default function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const json = sessionStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  , [value, key]);

  return [value, setValue];
}