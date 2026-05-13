import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useIsClient } from "@uidotdev/usehooks";
import { memo, useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster, type ToasterProps } from "sonner";
import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import GlobalModals from "@/components/Shared/GlobalModals";
import Navbar from "@/components/Shared/Navbar";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import { Spinner } from "@/components/Shared/UI";
import reloadAllTabs from "@/helpers/reloadAllTabs";
import { useTheme } from "@/hooks/useTheme";
import { useMeQuery } from "@/indexer/generated";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { hydrateAuthTokens, signOut } from "@/store/persisted/useAuthStore";
import ReloadTabsWatcher from "./ReloadTabsWatcher";

const Layout = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const isMounted = useIsClient();
  const { accessToken } = hydrateAuthTokens();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const onError = useCallback(() => {
    signOut();
    reloadAllTabs();
  }, []);

  const { loading } = useMeQuery({
    onCompleted: ({ me }) => {
      setCurrentAccount(me.loggedInAs.account);
    },
    onError,
    skip: !accessToken
  });

  const accountLoading = !currentAccount && loading;

  if (accountLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Toaster
        icons={{
          error: <XCircleIcon className="size-5" />,
          loading: <Spinner size="xs" />,
          success: <CheckCircleIcon className="size-5" />
        }}
        position="bottom-right"
        theme={theme as ToasterProps["theme"]}
        toastOptions={{
          className: "font-sofia-pro",
          style: { boxShadow: "none", fontSize: "16px" }
        }}
      />
      <GlobalModals />
      <GlobalAlerts />
      <ReloadTabsWatcher />
      <div className="border-gray-800 border-b bg-black px-4 py-2 text-center font-medium text-sm text-white dark:border-gray-200 dark:bg-white dark:text-black">
        hey.xyz is for sale along with all the assets, contact{" "}
        <a
          className="underline underline-offset-2"
          href="mailto:yoginth@hey.com"
        >
          yoginth@hey.com
        </a>{" "}
        for details
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-start gap-x-8 px-0 md:px-5">
        <Navbar />
        <Outlet />
        <BottomNavigation />
      </div>
    </>
  );
};

export default memo(Layout);
