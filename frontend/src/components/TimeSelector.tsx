import { useState, useEffect, useRef } from "react";
import { formatNumberTime } from "@/utils/time";

interface Props {
  label: string;
  initialValue?: number;
  includeSeconds?: boolean;
  onChange: (milliseconds: number) => void;
  error?: string;
  disabled?: boolean;
}

const TimeInput = ({
  label,
  initialValue = 0,
  includeSeconds = false,
  onChange,
  error,
  disabled = false,
}: Props) => {
  const initialHours = Math.floor((initialValue / (1000 * 60 * 60)) % 24);
  const initialMinutes = Math.floor((initialValue / (1000 * 60)) % 60);
  const initialSeconds = Math.floor((initialValue / 1000) % 60);
  const [hours, setHours] = useState<string>(formatNumberTime(initialHours));
  const [minutes, setMinutes] = useState<string>(
    formatNumberTime(initialMinutes)
  );
  const [seconds, setSeconds] = useState<string>(
    formatNumberTime(initialSeconds)
  );

  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hoursVal = parseInt(hours, 10) || 0;
    const minutesVal = parseInt(minutes, 10) || 0;
    const secondsVal = parseInt(seconds, 10) || 0;

    const totalMilliseconds =
      hoursVal * 60 * 60 * 1000 +
      minutesVal * 60 * 1000 +
      (includeSeconds ? secondsVal * 1000 : 0);

    onChange(totalMilliseconds);
  }, [hours, minutes, seconds, includeSeconds, onChange]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (
      value === "" ||
      (parseInt(value, 10) >= 0 && parseInt(value, 10) < 24)
    ) {
      setHours(value.length === 1 ? value : value.slice(-2));
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (
      value === "" ||
      (parseInt(value, 10) >= 0 && parseInt(value, 10) < 60)
    ) {
      setMinutes(value.length === 1 ? value : value.slice(-2));
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (
      value === "" ||
      (parseInt(value, 10) >= 0 && parseInt(value, 10) < 60)
    ) {
      setSeconds(value.length === 1 ? value : value.slice(-2));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    type: "hours" | "minutes" | "seconds"
  ) => {
    let value = e.target.value.trim();
    if (value === "") {
      value = "00";
    } else {
      const numValue = parseInt(value, 10);
      if (type === "hours" && numValue >= 24) {
        value = "23";
      } else if ((type === "minutes" || type === "seconds") && numValue >= 60) {
        value = "59";
      }
    }

    if (type === "hours") setHours(value.padStart(2, "0"));
    if (type === "minutes") setMinutes(value.padStart(2, "0"));
    if (type === "seconds") setSeconds(value.padStart(2, "0"));
  };

  const inputBaseClasses =
    "flex h-10 rounded-md !border !border-gray-300 bg-transparent !px-3 !py-2 text-sm text-center placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="flex items-center">
        <input
          ref={hoursRef}
          type="text"
          value={hours}
          onChange={handleHoursChange}
          onBlur={(e) => handleBlur(e, "hours")}
          disabled={disabled}
          className={`${inputBaseClasses} w-16`}
          aria-label="Hours"
          maxLength={2}
          tabIndex={0}
        />
        <span className="mx-1 text-gray-500 font-medium">:</span>
        <input
          ref={minutesRef}
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          onBlur={(e) => handleBlur(e, "minutes")}
          disabled={disabled}
          className={`${inputBaseClasses} w-16`}
          aria-label="Minutes"
          maxLength={2}
          tabIndex={0}
        />
        {includeSeconds && (
          <>
            <span className="mx-1 text-gray-500 font-medium">:</span>
            <input
              ref={secondsRef}
              type="text"
              value={seconds}
              onChange={handleSecondsChange}
              onBlur={(e) => handleBlur(e, "seconds")}
              disabled={disabled}
              className={`${inputBaseClasses} w-16`}
              aria-label="Seconds"
              maxLength={2}
              tabIndex={0}
            />
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TimeInput;
