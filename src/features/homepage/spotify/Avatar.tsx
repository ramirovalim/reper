import { auth } from '@/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default async function SpotifyAvatar() {
  const session = await auth();

  const url = session?.user?.image;

  return (
    <div className='flex gap-2 items-center justify-between'>
      <h2 className='text-lg font-semibold'>
        Bem vindo, {session?.user?.name || 'Usuário'}
      </h2>
      <Avatar>
        <AvatarImage src={url || ''} />
        <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
