import { getVercelFlagOverrides } from "@/lib/getVercelFlagOverrides"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"


export async function ThirdParties() {
  const flags = await getVercelFlagOverrides()

  return (
    <>
      {flags?.isVercelAnalyticsEnabled ? <Analytics /> : null}
      {flags?.isSpeedInsightsEnabled && process.env.NODE_ENV === "production" ? <SpeedInsights /> : null}
      {/* {flags?.isGoogleTagManagerEnabled ? <GoogleTagManager gtmId={env.GTM_ID} /> : null} */}
    </>
  )
}