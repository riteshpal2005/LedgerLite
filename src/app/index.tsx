import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import * as QuickActions from "expo-quick-actions";

export default function Index() {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );

  // Ref: Index-1
  // On a true Quick Add cold start _layout.tsx already renders QuickAddOnlyLayout
  // so this component is never mounted. This guard is a safety net for warm launches.
  if (QuickActions.initial?.id === "quick-add") {
    return <Redirect href="/quick-add" />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
