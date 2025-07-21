import { SignOut } from '@/components/SignOut';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='h-svh w-svw px-8 py-4 flex flex-col gap-4 bg-slate-50'>
      <header className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Reper</h1>
        <SignOut />
      </header>
      <main>{children}</main>
    </section>
  );
}
