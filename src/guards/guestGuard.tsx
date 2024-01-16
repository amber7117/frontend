import { useSession, signIn, signOut } from "next-auth/react";
export default function GuestGuard({ ...props }) {
  const { children } = props;
  const { data: session } = useSession();
  if (session) {
    return <>{children}</>;
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
