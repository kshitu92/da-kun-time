import TimeZoneCompare from '@/components/TimeZoneCompare';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Da Kun Time</h1>
      <TimeZoneCompare />
    </main>
  );
}
