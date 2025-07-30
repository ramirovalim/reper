'use client';
import { RecentlyPlayed } from "./spotify/RecentlyPlayed";

export default function HomePage() {
  return (
    <div className='py-4 px-2'>
      <div className='mt-4 flex flex-col gap-4 justify-between'>
        <RecentlyPlayed />
      </div>
    </div>
  );
}
