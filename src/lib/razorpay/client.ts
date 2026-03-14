// Razorpay server-side client — only import in server contexts (API routes, Server Actions)
// The razorpay npm package is CommonJS; dynamic import avoids ESM issues in edge runtime.

export async function getRazorpayInstance() {
  const Razorpay = (await import('razorpay')).default
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

export const RAZORPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!
