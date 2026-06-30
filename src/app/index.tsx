import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import { storage } from "../core/utils/storage";

export default function Index() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const data = await storage.getItem("ledgerLite_settings");
        if (data) {
          const parsed = JSON.parse(data);
          setHasCompletedOnboarding(!!parsed?.hasCompletedOnboarding);
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (e) {
        setHasCompletedOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  if (hasCompletedOnboarding === null) return null;

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
