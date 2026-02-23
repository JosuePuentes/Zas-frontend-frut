'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ComprasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/cliente/pedidos');
  }, [router]);
  return null;
}
