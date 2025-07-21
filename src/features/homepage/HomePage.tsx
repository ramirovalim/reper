import { auth } from '@/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default async function HomePage() {
  const session = await auth();
  console.log(session);
  const imageUrl = session?.user?.image;
  return (
    <div className='py-4 px-2'>
      <div className='flex gap-2 items-center justify-between'>
        <h2 className='text-lg font-semibold'>
          Bem vindo, {session?.user?.name || 'Usuário'}
        </h2>
        <Avatar>
          <AvatarImage src={imageUrl || ''} />
          <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>

      <div></div>
    </div>
  );
}
