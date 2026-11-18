import { createServerFn } from "@tanstack/react-start";

async function core() {
  return import("./paylink.core");
}

function asRecord(input: unknown): Record<string, unknown> {
  return typeof input === "object" && input ? (input as Record<string, unknown>) : {};
}

export const fetchMerchant = createServerFn({ method: "GET" }).handler(async () => {
  const api = await core();
  return api.getPublicMerchant();
});

export const fetchPayPage = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const id = asRecord(input).id;
    return { id: typeof id === "string" ? id : "" };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.getPayPage(data.id);
  });

export const fetchConsole = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const key = asRecord(input).key;
    return { key: typeof key === "string" ? key : "" };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.consoleGate(data.key);
  });

export const claimConsole = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const key = asRecord(input).key;
    return { key: typeof key === "string" ? key : "" };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.claimConsole(data.key);
  });

export const saveProfile = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = asRecord(input);
    return {
      key: typeof record.key === "string" ? record.key : "",
      businessName: typeof record.businessName === "string" ? record.businessName : "",
      tagline: typeof record.tagline === "string" ? record.tagline : "",
      city: typeof record.city === "string" ? record.city : "",
      primaryRail: typeof record.primaryRail === "string" ? record.primaryRail : "qrph",
      sandbox: record.sandbox === true,
    };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.saveProfile(data);
  });

export const saveQr = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = asRecord(input);
    return {
      key: typeof record.key === "string" ? record.key : "",
      rail: typeof record.rail === "string" ? record.rail : "",
      dataUrl: typeof record.dataUrl === "string" ? record.dataUrl : "",
    };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.saveQr(data);
  });

export const createCharge = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = asRecord(input);
    return {
      amountPesos: record.amountPesos,
      description: record.description,
      returnUrl: record.returnUrl,
      source: record.source,
    };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.createCharge(data);
  });

export const claimPayment = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const id = asRecord(input).id;
    return { id: typeof id === "string" ? id : "" };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.claimPayment(data.id);
  });

export const simulatePayment = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const id = asRecord(input).id;
    return { id: typeof id === "string" ? id : "" };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.simulatePayment(data.id);
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = asRecord(input);
    return {
      key: typeof record.key === "string" ? record.key : "",
      id: typeof record.id === "string" ? record.id : "",
    };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.confirmPayment(data);
  });

export const cancelPayment = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = asRecord(input);
    return {
      key: typeof record.key === "string" ? record.key : "",
      id: typeof record.id === "string" ? record.id : "",
    };
  })
  .handler(async ({ data }) => {
    const api = await core();
    return api.cancelPayment(data);
  });
