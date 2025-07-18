import { auth } from '@/auth';
import { SignOut } from '@/components/SignOut';

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <header>
        <h1>Reper</h1>
      </header>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <p>Home</p>
        <p>{JSON.stringify(session)}</p>
        <SignOut />
      </main>
      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'>
        <p>Footer</p>
      </footer>
    </div>
  );
}
