import { Button } from '@/components/ui/button';
import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <div>
      <Button
        size='lg'
        onClick={async () => {
          'use server';
          await signIn('spotify');
        }}
      >
        Entrar com Spotify
      </Button>
    </div>
  );
}
