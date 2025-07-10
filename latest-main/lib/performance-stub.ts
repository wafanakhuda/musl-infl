export function usePerformanceMonitor() {
  return {
    start: (label: string) => {
      if (process.env.NODE_ENV === "development") {
        console.time(label)
      }
    },
    end: (label: string) => {
      if (process.env.NODE_ENV === "development") {
        console.timeEnd(label)
      }
    },
  }
}
