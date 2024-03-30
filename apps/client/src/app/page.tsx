'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd'

export default async function App() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/welcome');
  }, []);

  return (
    <>
      <Spin spinning fullscreen tip='loading' />
    </>
  );
}
