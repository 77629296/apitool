import Link from 'next/link';
import { memo } from 'react';

const TopActions = memo(() => {
  return (
    <>
      <Link
        href={'/workbench'}
      >
        W
      </Link>
      <Link href={'/settings'}>
        S
      </Link>
    </>
  );
});

export default TopActions;
