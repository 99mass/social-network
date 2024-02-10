import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isValideSession } from '../utils/cookies';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const isValid = await isValideSession();
      if (!isValid) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);
}
export function useAuthGuard2() {
    const router = useRouter();
  
    useEffect(() => {
      const checkSession = async () => {
        const isValid = await isValideSession();
        if (isValid) {
          router.push('/home');
        }
      };
      checkSession();
    }, [router]);
  }