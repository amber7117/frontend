import { useState } from "react";
import PropTypes from "prop-types";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// redux
import { useSelector } from "react-redux";
// login
const Login = dynamic(() => import("src/components/_main/auth/guardLogin"));
// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ ...props }) {
  const { children } = props;
  const user = useSelector(({ user }: { user: any }) => user);
  const { isAuthenticated } = user;
  const { pathname, push } = useRouter();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname as any);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    push(requestedLocation);
    return null;
  }

  return children;
}
