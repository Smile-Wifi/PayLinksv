import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/charges/$chargeId")({
  server: {
    handlers: {
      OPTIONS: async () => {
        const { corsEmpty } = await import("@/lib/paylink.core");
        return corsEmpty();
      },
      GET: async ({ request, params }) => {
        const { apiGetCharge } = await import("@/lib/paylink.core");
        return apiGetCharge(request, params.chargeId);
      },
    },
  },
});
