import { Button } from '@/components/ui/button';
import { SignIn } from '@/components/SignIn';

export default function LoginPage() {
  return (
    <div className='w-full max-w-sm'>
      <SignIn />
      <Button variant='outline' className='w-full'>
        Login with Google
      </Button>
    </div>
  );
}
