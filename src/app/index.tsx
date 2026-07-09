import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import * as QuickActions from "expo-quick-actions";

export default function Index() {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );
  const isQuickAddEscaped = useSelector(
    (state: RootState) => state.settings.isQuickAddEscaped,
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
