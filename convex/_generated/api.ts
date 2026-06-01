// Minimal Convex API stub for local dev build to satisfy imports.
// Replace with generated Convex client when available.

export const api: any = {
  functions: new Proxy({}, { get: () => () => {
    throw new Error('Convex function stubs not implemented. Generate @/convex/_generated/api or run convex codegen.');
  } }),
};

export default api;
