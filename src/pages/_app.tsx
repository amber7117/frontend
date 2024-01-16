import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "src/redux/store";
import ThemeProvider from "src/theme";
import GlobalStyles from "src/theme/globalStyles";
import ThemePrimaryColor from "src/components/themePrimaryColor";
import AuthProvider from "src/components/AuthProvider";
import Layout from "src/layout";
import ProgressBar from "src/components/progressBar";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import '../components/styled.css';

// Server-side props
export async function getServerSideProps({ ...ctx }) {
  const { res } = ctx;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {},
  };
}

export default function App({
  Component,
  pageProps,
}: AppProps & { session: any }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const { pathname } = useRouter();

  return (
    <>
      {/* SEO */}
      <DefaultSeo {...SEO} />

      {/* Toast notification */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Authentication session provider */}
      <SessionProvider session={pageProps.session}>
        {/* Redux provider */}
        <ReduxProvider store={store}>
          {/* Theme provider */}
          <ThemeProvider>
            {/* Authentication provider */}
            <AuthProvider>
              {/* Theme primary color */}
              <ThemePrimaryColor>
                {/* React Query provider */}
                <QueryClientProvider client={queryClient}>
                  {/* Hydration for react-query */}
                  <Hydrate state={pageProps.dehydratedState}>
                    {/* Main layout */}
                    {pathname === "/demo" ? (
                      <Box>
                        <GlobalStyles />

                        {/* Progress bar */}
                        <ProgressBar />

                        {/* Render the current page */}
                        <Component {...pageProps} />
                      </Box>
                    ) : (
                      <Layout>
                        {/* Global styles */}
                        <GlobalStyles />

                        {/* Progress bar */}
                        <ProgressBar />

                        {/* Render the current page */}
                        <Component {...pageProps} />
                        
                      </Layout>
                    )}
                  </Hydrate>
                </QueryClientProvider>
              </ThemePrimaryColor>
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </SessionProvider>
    </>
  );
}
