import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import * as QuickActions from 'expo-quick-actions';

let hasProcessedInitialAction = false;

export default function Index() {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );

  if (!hasProcessedInitialAction && QuickActions.initial?.id === 'quick-add') {
    hasProcessedInitialAction = true;
    return <Redirect href="/quick-add" />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
