/**
 * Adds an artificial delay in development mode
 * Useful for testing loading states and animations
 *
 * @param ms - Milliseconds to delay (default: 2000ms)
 * @returns Promise that resolves after the delay
 *
 * @example
 * // In a server action:
 * export async function getData() {
 *   await devDelay();
 *   // ... rest of the function
 * }
 */
export async function devDelay(ms: number = 2000): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
