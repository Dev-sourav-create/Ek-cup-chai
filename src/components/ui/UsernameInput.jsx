"use client";

import { useState, useEffect, useCallback } from "react";

const DEBOUNCE_MS = 500;
const MIN_LENGTH = 2;

export default function UsernameInput({
  value,
  onChange,
  prefix = "ekcupchai/",
  placeholder = "yourname",
  disabled = false,
  className = "",
  inputClassName = "",
  ...props
}) {
  const [status, setStatus] = useState(null); // "checking" | "available" | "taken" | null
  const [localValue, setLocalValue] = useState(value ?? "");

  const checkUsername = useCallback(async (username) => {
    if (!username || username.length < MIN_LENGTH) {
      setStatus(null);
      return;
    }
    setStatus("checking");
    try {
      const res = await fetch(`/api/checkusername?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setStatus(data.available ? "available" : "taken");
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (!localValue || localValue.length < MIN_LENGTH) {
      setStatus(null);
      return;
    }

    const timeout = setTimeout(() => checkUsername(localValue), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [localValue, checkUsername]);

  const handleChange = (e) => {
    const next = e.target.value.replace(/\s+/g, "").toLowerCase();
    setLocalValue(next);
    onChange?.(next);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      <div
        className={`
          flex items-center gap-2 rounded-xl border border-black/5 bg-black/5 px-4 py-3
          transition focus-within:border-chaiBrown/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-chaiBrown/30
          dark:border-white/10 dark:bg-white/10 dark:focus-within:bg-zinc-900
          ${disabled ? "opacity-60" : ""}
        `}
      >
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {prefix}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className={`min-w-0 flex-1 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 ${inputClassName}`}
          autoComplete="username"
          aria-describedby="username-status"
          aria-invalid={status === "taken"}
        />
        {status === "checking" && (
          <span
            id="username-status"
            className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400"
          >
            Checking…
          </span>
        )}
        {status === "available" && (
          <span
            id="username-status"
            className="shrink-0 text-sm font-medium text-green-600 dark:text-green-400"
          >
            ✓ Available
          </span>
        )}
        {status === "taken" && (
          <span
            id="username-status"
            className="shrink-0 text-sm font-medium text-red-600 dark:text-red-400"
          >
            ✕ Taken
          </span>
        )}
      </div>
    </div>
  );
}
