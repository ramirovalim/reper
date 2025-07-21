export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='h-svh w-svw flex flex-col items-center justify-center gap-24 bg-slate-50'>
      <div className='px-12 text-center'>
        <h1 className='text-4xl font-bold'>Faça login para continuar</h1>
      </div>
      <main>{children}</main>
      <footer className='text-center'>
        <p className='fixed bottom-2 left-2 right-2 text-sm text-muted-foreground'>
          © {new Date().getFullYear()} Reper. Todos os direitos reservados.
        </p>
      </footer>
    </section>
  );
}
