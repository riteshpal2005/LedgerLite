import { useEffect } from "react";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";

export function useProtectedRoute(
  user: any,
  isLoading: boolean,
  hasCompletedOnboarding: boolean,
  isSettingsLoaded: boolean,
) {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !isSettingsLoaded || !navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isOnboarding = segments[0] === "onboarding";

    if (!hasCompletedOnboarding) {
      if (!isOnboarding && !inAuthGroup) {
        router.replace("/onboarding");
      }
    } else {
      if (isOnboarding || (user && !user.isAnonymous && inAuthGroup)) {
        router.replace("/(tabs)");
      }
    }
  }, [
    user,
    isLoading,
    segments,
    hasCompletedOnboarding,
    navigationState?.key,
    isSettingsLoaded,
  ]);
}
