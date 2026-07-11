import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Index() {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.settings.hasCompletedOnboarding,
  );

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/transactions" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
