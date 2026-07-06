import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import * as QuickActions from "expo-quick-actions";
import { isQuickAddEscaped } from "./_layout";

export default function Index() {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );




  if (QuickActions.initial?.id === "quick-add" && !isQuickAddEscaped) {
    return <Redirect href="/quick-add" />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/transactions" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
