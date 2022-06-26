import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }
  , [value, key]);

  return [value, setValue];
}