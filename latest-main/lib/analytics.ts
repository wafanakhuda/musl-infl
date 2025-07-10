"use client"

import { useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Analytics event types
export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  user_id?: string
  session_id?: string
  timestamp?: number
  properties?: Record<string, any>
}

// User properties for analytics
export interface UserProperties {
  user_id: string
  user_type: "creator" | "brand" | "admin"
  email_verified: boolean
  subscription_tier?: string
  registration_date: string
  last_login: string
  total_campaigns?: number
  total_earnings?: number
  location?: string
  age_group?: string
  interests?: string[]
}

// Campaign analytics properties
export interface CampaignProperties {
  campaign_id: string
  campaign_title: string
  campaign_type: string[]
  budget_range: string
  category: string
  brand_id: string
  creator_id?: string
  status: string
  created_date: string
  deadline?: string
}

class AdvancedAnalytics {
  private isInitialized = false
  private sessionId: string
  private userId?: string
  private userProperties?: UserProperties
  private eventQueue: AnalyticsEvent[] = []
  private isOnline = true

  constructor() {
    this.sessionId = this.generateSessionId()

    if (typeof window !== "undefined") {
      this.initializeAnalytics()
      this.setupEventListeners()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async initializeAnalytics() {
    try {
      // Initialize Google Analytics 4
      if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        await this.initializeGA4()
      }

      // Initialize Facebook Pixel
      if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
        await this.initializeFacebookPixel()
      }

      // Initialize custom analytics
      await this.initializeCustomAnalytics()

      this.isInitialized = true
      this.flushEventQueue()
    } catch (error) {
      console.error("Analytics initialization failed:", error)
    }
  }

  private async initializeGA4() {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!

    // Load gtag script
    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }

    gtag("js", new Date())
    gtag("config", measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: "user_type",
        custom_parameter_2: "campaign_category",
      },
    })

    // Store gtag globally
    window.gtag = gtag
  }

  private async initializeFacebookPixel() {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!

    // Load Facebook Pixel
    const script = document.createElement("script")
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }

  private async initializeCustomAnalytics() {
    // Initialize our custom analytics endpoint
    try {
      await fetch("/api/analytics/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: this.sessionId,
          timestamp: Date.now(),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          referrer: document.referrer,
        }),
      })
    } catch (error) {
      console.error("Custom analytics initialization failed:", error)
    }
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.track("page_hidden", "engagement", "page_visibility")
      } else {
        this.track("page_visible", "engagement", "page_visibility")
      }
    })

    // Track scroll depth
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)

      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth
        this.track("scroll_depth", "engagement", "scroll", undefined, scrollDepth)
      }
    }

    window.addEventListener("scroll", trackScrollDepth, { passive: true })

    // Track time on page
    const startTime = Date.now()
    window.addEventListener("beforeunload", () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      this.track("time_on_page", "engagement", "duration", undefined, timeOnPage)
    })

    // Track online/offline status
    window.addEventListener("online", () => {
      this.isOnline = true
      this.flushEventQueue()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })
  }

  // Public methods
  public setUser(userProperties: UserProperties) {
    this.userId = userProperties.user_id
    this.userProperties = userProperties

    // Set user properties in GA4
    if (window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: userProperties.user_id,
        custom_map: {
          user_type: userProperties.user_type,
          email_verified: userProperties.email_verified,
        },
      })
    }

    // Set user properties in Facebook Pixel
    if (window.fbq) {
      window.fbq("setUserProperties", {
        user_type: userProperties.user_type,
        email_verified: userProperties.email_verified,
      })
    }

    // Send to custom analytics
    this.sendToCustomAnalytics({
      event: "user_identified",
      category: "user",
      action: "identify",
      user_id: userProperties.user_id,
      properties: userProperties,
    })
  }

  public track(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>,
  ) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: Date.now(),
      properties,
    }

    if (this.isInitialized && this.isOnline) {
      this.sendEvent(analyticsEvent)
    } else {
      this.eventQueue.push(analyticsEvent)
    }
  }

  public trackPageView(path: string, title?: string) {
    // GA4 page view
    if (window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title || document.title,
      })
    }

    // Facebook Pixel page view
    if (window.fbq) {
      window.fbq("track", "PageView")
    }

    // Custom analytics page view
    this.track("page_view", "navigation", "page_view", path, undefined, {
      page_path: path,
      page_title: title || document.title,
      referrer: document.referrer,
    })
  }

  public trackConversion(conversionType: string, value?: number, currency = "USD", properties?: Record<string, any>) {
    // GA4 conversion
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        value: value,
        currency: currency,
        transaction_id: `conv_${Date.now()}`,
        ...properties,
      })
    }

    // Facebook Pixel conversion
    if (window.fbq) {
      window.fbq("track", "Purchase", {
        value: value,
        currency: currency,
        ...properties,
      })
    }

    // Custom analytics conversion
    this.track("conversion", "ecommerce", conversionType, undefined, value, {
      currency,
      ...properties,
    })
  }

  public trackCampaignEvent(
    action: string,
    campaignProperties: CampaignProperties,
    additionalProperties?: Record<string, any>,
  ) {
    this.track(`campaign_${action}`, "campaign", action, campaignProperties.campaign_id, undefined, {
      ...campaignProperties,
      ...additionalProperties,
    })
  }

  public trackUserEngagement(action: string, element?: string, properties?: Record<string, any>) {
    this.track(`engagement_${action}`, "engagement", action, element, undefined, properties)
  }

  public startFunnelTracking(funnelName: string, step: string) {
    this.track("funnel_step", "funnel", "step_entered", `${funnelName}_${step}`, undefined, {
      funnel_name: funnelName,
      step_name: step,
      step_number: this.getFunnelStepNumber(funnelName, step),
    })
  }

  public trackError(error: Error, context?: string, severity: "low" | "medium" | "high" = "medium") {
    this.track("error_occurred", "error", "javascript_error", context, undefined, {
      error_message: error.message,
      error_stack: error.stack,
      severity,
      context,
    })
  }

  private sendEvent(event: AnalyticsEvent) {
    // Send to GA4
    if (window.gtag) {
      window.gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: this.userProperties?.user_type,
        ...event.properties,
      })
    }

    // Send to custom analytics
    this.sendToCustomAnalytics(event)
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent) {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Failed to send analytics event:", error)
      // Add back to queue for retry
      this.eventQueue.push(event)
    }
  }

  private flushEventQueue() {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    events.forEach((event) => this.sendEvent(event))
  }

  private getFunnelStepNumber(funnelName: string, step: string): number {
    const funnelSteps: Record<string, string[]> = {
      creator_onboarding: ["signup", "profile_setup", "portfolio_upload", "verification", "first_application"],
      brand_onboarding: ["signup", "company_setup", "first_campaign", "creator_selection", "payment_setup"],
      campaign_creation: ["campaign_details", "requirements", "budget", "review", "publish"],
      application_process: [
        "browse_campaigns",
        "view_details",
        "create_proposal",
        "submit_application",
        "await_response",
      ],
    }

    const steps = funnelSteps[funnelName] || []
    return steps.indexOf(step) + 1
  }
}

// Global analytics instance
export const analytics = new AdvancedAnalytics()

// React hooks for analytics
export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    analytics.trackPageView(url)
  }, [pathname, searchParams])

  return {
    track: analytics.track.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackCampaignEvent: analytics.trackCampaignEvent.bind(analytics),
    trackUserEngagement: analytics.trackUserEngagement.bind(analytics),
    startFunnelTracking: analytics.startFunnelTracking.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setUser: analytics.setUser.bind(analytics),
  }
}

export function usePageAnalytics(pageName: string, properties?: Record<string, any>) {
  useEffect(() => {
    analytics.track("page_loaded", "navigation", "page_load", pageName, undefined, properties)

    const startTime = Date.now()
    return () => {
      const timeOnPage = Date.now() - startTime
      analytics.track("page_unloaded", "navigation", "page_unload", pageName, timeOnPage, properties)
    }
  }, [pageName, properties])
}

export function useFunnelAnalytics(funnelName: string) {
  const trackStep = useCallback(
    (step: string, properties?: Record<string, any>) => {
      analytics.startFunnelTracking(funnelName, step)
      analytics.track(`${funnelName}_${step}`, "funnel", "step_completed", step, undefined, properties)
    },
    [funnelName],
  )

  return { trackStep }
}

// Declare global types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
    dataLayer: any[]
  }
}
