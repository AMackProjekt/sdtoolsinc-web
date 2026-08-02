// Minimal Convex API reference for builds where generated schema output is absent.
// Replace this shim by running `npx convex codegen` when the Convex schema is restored.
import { anyApi } from "convex/server";

export const api: any = anyApi;

export default api;
