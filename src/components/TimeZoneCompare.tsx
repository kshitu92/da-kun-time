'use client';

import { useState, useEffect, useMemo } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

type TimeZone = {
  value: string;
  label: string;
  shortLabel: string;
};

const TIME_ZONES: TimeZone[] = [
  { value: 'America/Chicago', label: 'Central Time (CT) - Chicago', shortLabel: 'Chicago' },
  { value: 'America/New_York', label: 'Eastern Time (ET) - New York', shortLabel: 'New York' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles', shortLabel: 'Los Angeles' },
  { value: 'Asia/Kathmandu', label: 'Nepal Standard Time (NPT) - Kathmandu', shortLabel: 'Kathmandu' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) - Tokyo', shortLabel: 'Tokyo' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - London', shortLabel: 'London' },
];

export default function TimeZoneCompare() {
  const [firstZone, setFirstZone] = useState<string>('America/Chicago');
  const [secondZone, setSecondZone] = useState<string>('Asia/Kathmandu');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeOffset, setTimeOffset] = useState<number>(0); // in minutes
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Ensure time zones are valid before starting
    try {
      new Date().toLocaleString('en-US', { timeZone: firstZone });
      new Date().toLocaleString('en-US', { timeZone: secondZone });
      setIsLoading(false);
    } catch (error) {
      console.error('Invalid timezone:', error);
      // Reset to default time zones if invalid
      setFirstZone('America/Chicago');
      setSecondZone('Asia/Kathmandu');
      setIsLoading(false);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [firstZone, secondZone]);

  const adjustedTime = useMemo(() => {
    return new Date(currentTime.getTime() + timeOffset * 60000);
  }, [currentTime, timeOffset]);

  const timeDifference = useMemo(() => {
    try {
      const firstTime = new Date().toLocaleString('en-US', { timeZone: firstZone });
      const secondTime = new Date().toLocaleString('en-US', { timeZone: secondZone });
      const diffInHours = (new Date(secondTime).getTime() - new Date(firstTime).getTime()) / (1000 * 60 * 60);
      const hours = Math.floor(Math.abs(diffInHours));
      const minutes = Math.floor((Math.abs(diffInHours) - hours) * 60);
      return `${hours} hours ${minutes} minutes`;
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return 'Error calculating time difference';
    }
  }, [firstZone, secondZone]);

  const handleSwap = () => {
    setFirstZone(secondZone);
    setSecondZone(firstZone);
  };

  const handleCurrentTime = () => {
    setTimeOffset(0);
    setCurrentTime(new Date());
  };

  if (isLoading) {
    return <div className="w-full max-w-3xl p-6 text-center">Loading...</div>;
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6" role="main">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-2">First Time Zone</h2>
          <select
            className="w-full p-2 border rounded-md"
            value={firstZone}
            onChange={(e) => setFirstZone(e.target.value)}
            aria-label="Select first time zone"
          >
            {TIME_ZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Second Time Zone</h2>
          <select
            className="w-full p-2 border rounded-md"
            value={secondZone}
            onChange={(e) => setSecondZone(e.target.value)}
            aria-label="Select second time zone"
          >
            {TIME_ZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="my-8 text-center">
        <h3 className="text-lg font-medium mb-2">Time Difference</h3>
        <p className="text-2xl text-blue-500" role="status" aria-live="polite">
          {timeDifference}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Adjust Time</h3>
        <input
          type="range"
          min="-720"
          max="720"
          value={timeOffset}
          onChange={(e) => setTimeOffset(parseInt(e.target.value, 10))}
          className="w-full"
          aria-label="Adjust time offset"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { zone: firstZone, label: 'First' },
          { zone: secondZone, label: 'Second' }
        ].map((item) => (
          <div key={item.zone} className="text-center p-6 border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              {TIME_ZONES.find(tz => tz.value === item.zone)?.shortLabel}
            </p>
            <p className="text-4xl font-bold" role="timer">
              {formatInTimeZone(adjustedTime, item.zone, 'h:mm a')}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {formatInTimeZone(adjustedTime, item.zone, 'EEEE')}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCurrentTime}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Reset to current time"
        >
          Current Time
        </button>
        <button
          onClick={handleSwap}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Swap time zones"
        >
          Swap Time Zones
        </button>
      </div>
    </div>
  );
} 