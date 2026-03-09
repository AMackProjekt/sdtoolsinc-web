export async function withMetric<T>(name: string, action: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const value = await action();
    const durationMs = Math.round(performance.now() - start);
    if (durationMs > 1500) {
      console.warn(`[perf] ${name} took ${durationMs}ms`);
    }
    return value;
  } catch (error) {
    const durationMs = Math.round(performance.now() - start);
    console.error(`[metric-error] ${name} failed after ${durationMs}ms`, error);
    throw error;
  }
}
