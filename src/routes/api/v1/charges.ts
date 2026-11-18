import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/charges")({
  server: {
    handlers: {
      OPTIONS: async () => {
        const { corsEmpty } = await import("@/lib/paylink.core");
        return corsEmpty();
      },
      POST: async ({ request }) => {
        const { apiCreateCharge } = await import("@/lib/paylink.core");
        return apiCreateCharge(request);
      },
    },
  },
});
