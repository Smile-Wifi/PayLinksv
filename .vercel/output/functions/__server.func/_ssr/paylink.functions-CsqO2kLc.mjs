import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paylink.functions-CsqO2kLc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function core() {
	return import("./paylink.core-DccOj7TW.mjs");
}
function asRecord(input) {
	return typeof input === "object" && input ? input : {};
}
var fetchMerchant_createServerFn_handler = createServerRpc({
	id: "e3c64d3791becbfbe54626fc8eef6ca4966b3f62a5a63a0824328e06e5e23a0d",
	name: "fetchMerchant",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => fetchMerchant.__executeServer(opts));
var fetchMerchant = createServerFn({ method: "GET" }).handler(fetchMerchant_createServerFn_handler, async () => {
	return (await core()).getPublicMerchant();
});
var fetchPayPage_createServerFn_handler = createServerRpc({
	id: "50cffdcbcdef57c397949d7e29393da46a181a3d3d485d42ff9e0fc9c491d0c6",
	name: "fetchPayPage",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => fetchPayPage.__executeServer(opts));
var fetchPayPage = createServerFn({ method: "GET" }).validator((input) => {
	const id = asRecord(input).id;
	return { id: typeof id === "string" ? id : "" };
}).handler(fetchPayPage_createServerFn_handler, async ({ data }) => {
	return (await core()).getPayPage(data.id);
});
var fetchConsole_createServerFn_handler = createServerRpc({
	id: "409d6bdebaeef228d545f09998f684b679e5456d58e72f61621c951afbf4c6f1",
	name: "fetchConsole",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => fetchConsole.__executeServer(opts));
var fetchConsole = createServerFn({ method: "POST" }).validator((input) => {
	const key = asRecord(input).key;
	return { key: typeof key === "string" ? key : "" };
}).handler(fetchConsole_createServerFn_handler, async ({ data }) => {
	return (await core()).consoleGate(data.key);
});
var claimConsole_createServerFn_handler = createServerRpc({
	id: "6588af47cb18d5724cc5cfb85398dd10fdbf7e6f3d0b878be6b9101b5baf6392",
	name: "claimConsole",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => claimConsole.__executeServer(opts));
var claimConsole = createServerFn({ method: "POST" }).validator((input) => {
	const key = asRecord(input).key;
	return { key: typeof key === "string" ? key : "" };
}).handler(claimConsole_createServerFn_handler, async ({ data }) => {
	return (await core()).claimConsole(data.key);
});
var saveProfile_createServerFn_handler = createServerRpc({
	id: "dbda83cd271ec73989855ec21d58bb335b6a682b43ad8ab74e0169aa7490b652",
	name: "saveProfile",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => saveProfile.__executeServer(opts));
var saveProfile = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	return {
		key: typeof record.key === "string" ? record.key : "",
		businessName: typeof record.businessName === "string" ? record.businessName : "",
		tagline: typeof record.tagline === "string" ? record.tagline : "",
		city: typeof record.city === "string" ? record.city : "",
		primaryRail: typeof record.primaryRail === "string" ? record.primaryRail : "qrph",
		sandbox: record.sandbox === true
	};
}).handler(saveProfile_createServerFn_handler, async ({ data }) => {
	return (await core()).saveProfile(data);
});
var saveQr_createServerFn_handler = createServerRpc({
	id: "5b3f07d623675c5768d453524780850e865108e29f406e14a946b4b540aad21d",
	name: "saveQr",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => saveQr.__executeServer(opts));
var saveQr = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	return {
		key: typeof record.key === "string" ? record.key : "",
		rail: typeof record.rail === "string" ? record.rail : "",
		dataUrl: typeof record.dataUrl === "string" ? record.dataUrl : ""
	};
}).handler(saveQr_createServerFn_handler, async ({ data }) => {
	return (await core()).saveQr(data);
});
var createCharge_createServerFn_handler = createServerRpc({
	id: "28bd0baff92f25285bc64e76aee7a9b6bb7260a7c9ba7eefd5052267c96ca366",
	name: "createCharge",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => createCharge.__executeServer(opts));
var createCharge = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	return {
		amountPesos: record.amountPesos,
		description: record.description,
		returnUrl: record.returnUrl,
		source: record.source
	};
}).handler(createCharge_createServerFn_handler, async ({ data }) => {
	return (await core()).createCharge(data);
});
var claimPayment_createServerFn_handler = createServerRpc({
	id: "50d45a510419f745e58e7d7e3fe070db5c4838e4dcb0f527ef8042afd1edf897",
	name: "claimPayment",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => claimPayment.__executeServer(opts));
var claimPayment = createServerFn({ method: "POST" }).validator((input) => {
	const id = asRecord(input).id;
	return { id: typeof id === "string" ? id : "" };
}).handler(claimPayment_createServerFn_handler, async ({ data }) => {
	return (await core()).claimPayment(data.id);
});
var simulatePayment_createServerFn_handler = createServerRpc({
	id: "2d857650ce1ef4b5138a3100abb1c349b78ade3fd689cd215dd793619b07aea7",
	name: "simulatePayment",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => simulatePayment.__executeServer(opts));
var simulatePayment = createServerFn({ method: "POST" }).validator((input) => {
	const id = asRecord(input).id;
	return { id: typeof id === "string" ? id : "" };
}).handler(simulatePayment_createServerFn_handler, async ({ data }) => {
	return (await core()).simulatePayment(data.id);
});
var confirmPayment_createServerFn_handler = createServerRpc({
	id: "198ffee39fe0d5a232dc758e372d7139450c78b084548c78ca8dfed6b4c17548",
	name: "confirmPayment",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => confirmPayment.__executeServer(opts));
var confirmPayment = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	return {
		key: typeof record.key === "string" ? record.key : "",
		id: typeof record.id === "string" ? record.id : ""
	};
}).handler(confirmPayment_createServerFn_handler, async ({ data }) => {
	return (await core()).confirmPayment(data);
});
var cancelPayment_createServerFn_handler = createServerRpc({
	id: "ca4ddbda5028a9d284ae54ce082fa49ab86c2c45298f132343ebd7357cf76b5e",
	name: "cancelPayment",
	filename: "src/lib/paylink.functions.ts"
}, (opts) => cancelPayment.__executeServer(opts));
var cancelPayment = createServerFn({ method: "POST" }).validator((input) => {
	const record = asRecord(input);
	return {
		key: typeof record.key === "string" ? record.key : "",
		id: typeof record.id === "string" ? record.id : ""
	};
}).handler(cancelPayment_createServerFn_handler, async ({ data }) => {
	return (await core()).cancelPayment(data);
});
//#endregion
export { cancelPayment_createServerFn_handler, claimConsole_createServerFn_handler, claimPayment_createServerFn_handler, confirmPayment_createServerFn_handler, createCharge_createServerFn_handler, fetchConsole_createServerFn_handler, fetchMerchant_createServerFn_handler, fetchPayPage_createServerFn_handler, saveProfile_createServerFn_handler, saveQr_createServerFn_handler, simulatePayment_createServerFn_handler };
