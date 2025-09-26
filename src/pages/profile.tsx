// material-ui components
import { Container, Box } from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import LogoLoading from "src/components/logoLoading";
// components
import Page from "src/components/page";
const Tabs = dynamic(() => import("src/components/_main/profile/profileTabs"));
const ProfileCover = dynamic(
  () => import("src/components/_main/profile/profileCover")
);

// ----------------------------------------------------------------------

export default function UserProfile() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login?redirect=/profile");
    },
  });
  if (status === "loading") {
    return (
     <LogoLoading />
    );
  }
  return (
    <Page title="User Profile | Nextstore" canonical="profile">
      <ProfileCover />
      <Container maxWidth={"lg"}>
        <Tabs />
      </Container>
    </Page>
  );
}
