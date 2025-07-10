
export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.event || !body.category || !body.action) {
      return NextResponse.json({ error: "Missing required fields: event, category, action" }, { status: 400 })
    }

    // Get client information
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const clientIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    // Prepare analytics event
    const analyticsEvent = {
      ...body,
      timestamp: new Date().toISOString(),
      client_ip: clientIP,
      user_agent: userAgent,
      properties: {
        ...body.properties,
        user_agent: userAgent,
        client_ip: clientIP,
        referrer: body.properties?.referrer || "",
        page_url: body.properties?.page_url || "",
      },
    }

    // Send to backend analytics service
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ANALYTICS_API_KEY}`,
      },
      body: JSON.stringify(analyticsEvent),
    })

    if (!backendResponse.ok) {
      throw new Error("Failed to send to backend analytics")
    }

    // Also send to external analytics services if configured
    await Promise.allSettled([
      sendToGoogleAnalytics(analyticsEvent),
      sendToMixpanel(analyticsEvent),
      sendToAmplitude(analyticsEvent),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}

async function sendToGoogleAnalytics(event: any) {
  if (!process.env.GA_MEASUREMENT_ID) return

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: event.session_id || "anonymous",
          events: [
            {
              name: event.action,
              parameters: {
                event_category: event.category,
                event_label: event.label,
                value: event.value,
                custom_parameter_1: event.properties?.user_type,
                custom_parameter_2: event.properties?.campaign_category,
              },
            },
          ],
        }),
      },
    )
  } catch (error) {
    console.error("Failed to send to Google Analytics:", error)
  }
}

async function sendToMixpanel(event: any) {
  if (!process.env.MIXPANEL_TOKEN) return

  try {
    const mixpanelEvent = {
      event: `${event.category}_${event.action}`,
      properties: {
        token: process.env.MIXPANEL_TOKEN,
        distinct_id: event.user_id || event.session_id,
        time: Math.floor(new Date(event.timestamp).getTime() / 1000),
        ...event.properties,
      },
    }

    await fetch("https://api.mixpanel.com/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([mixpanelEvent]),
    })
  } catch (error) {
    console.error("Failed to send to Mixpanel:", error)
  }
}

async function sendToAmplitude(event: any) {
  if (!process.env.AMPLITUDE_API_KEY) return

  try {
    const amplitudeEvent = {
      user_id: event.user_id,
      session_id: event.session_id,
      event_type: `${event.category}_${event.action}`,
      time: new Date(event.timestamp).getTime(),
      event_properties: event.properties,
      user_properties: {
        user_type: event.properties?.user_type,
      },
    }

    await fetch("https://api2.amplitude.com/2/httpapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AMPLITUDE_API_KEY}`,
      },
      body: JSON.stringify({
        api_key: process.env.AMPLITUDE_API_KEY,
        events: [amplitudeEvent],
      }),
    })
  } catch (error) {
    console.error("Failed to send to Amplitude:", error)
  }
}
