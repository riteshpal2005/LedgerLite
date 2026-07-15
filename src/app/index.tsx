import { Redirect } from "expo-router";

export default function Index() {
  // Developer override at boot
  return <Redirect href="/(tabs)" />;
}
