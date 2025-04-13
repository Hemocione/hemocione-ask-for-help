import type { PostHog } from "posthog-js";
import { usePersistentState } from "~/composables/usePersistentState";
import type { CurrentUserData } from "~/utils/userPayloadDecoder";

export function identifyOnPosthog(user: CurrentUserData, posthog?: PostHog | null) {
  if (!posthog) return;

  const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
  const userPropertiesLastSetIn = usePersistentState(
    "userPropertiesLastSetIn",
    ""
  );

  const shouldSetIdentify =
    !userPropertiesLastSetIn.value ||
    new Date().getTime() - new Date(userPropertiesLastSetIn.value).getTime() >
      ONE_MONTH;

  if (!shouldSetIdentify) return posthog.identify(user.id);

  posthog.identify(user.id, {
    email: user.email,
    name: user.givenName
  });

  // Set the last time user properties were set
  userPropertiesLastSetIn.value = new Date().toISOString();
}
