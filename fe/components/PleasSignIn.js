import { useUser } from './User';
import SignIn from './SignIn';
import Link from 'next/link';

export default function ({ children }) {
  const me = useUser();
  if (!me)
    return (
      <>
        <Link href="/signin">Sign In</Link>
      </>
    );
  return children;
}
