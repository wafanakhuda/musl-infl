// backend-connection-test.ts

type TestResult =
  | { name: string; status: "✅ PASS" | "❌ FAIL"; response: any }
  | { name: string; status: "❌ ERROR"; error: string }

interface TestCase {
  name: string
  url: string
  expected: "array" | "object" | Record<string, any>
}

// Run the backend test cases
export async function testBackendConnection(): Promise<TestResult[]> {
  const tests: TestCase[] = [
    {
      name: "Health Check",
      url: "/health",
      expected: { status: "healthy" },
    },
    {
      name: "Get Creators",
      url: "/creators?limit=1",
      expected: "array",
    },
    {
      name: "Get Campaigns",
      url: "/campaigns?limit=1",
      expected: "array",
    },
    {
      name: "Platform Stats",
      url: "/analytics/platform-stats",
      expected: "object",
    },
  ]

  const results: TestResult[] = []
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  for (const test of tests) {
    try {
      const response = await fetch(`${baseUrl}${test.url}`)
      const data = await response.json()

      let passed = false
      if (Array.isArray(data) && test.expected === "array") {
        passed = true
      } else if (typeof data === "object" && !Array.isArray(data)) {
        if (test.expected === "object") {
          passed = true
        } else if (typeof test.expected === "object") {
          passed = Object.entries(test.expected).every(
            ([key, value]) => data[key] === value,
          )
        }
      }

      results.push({
        name: test.name,
        status: passed ? "✅ PASS" : "❌ FAIL",
        response: data,
      })
    } catch (error: any) {
      results.push({
        name: test.name,
        status: "❌ ERROR",
        error: error.message || "Unknown error",
      })
    }
  }

  return results
}
