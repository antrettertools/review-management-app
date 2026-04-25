import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Models — Haiku 4.5 for high-volume reply generation (cheap, fast),
// Sonnet 4.6 for higher-quality insight analysis.
const RESPONSE_MODEL = 'claude-haiku-4-5-20251001'
const INSIGHTS_MODEL = 'claude-sonnet-4-6'

export async function generateReviewInsights(reviews: Array<{
  content: string
  rating: number
  author_name: string
  platform: string
}>) {
  try {
    const reviewSummary = reviews.slice(0, 50).map((r, i) =>
      `Review ${i + 1} (${r.rating} stars, ${r.platform}): "${r.content}"`
    ).join('\n')

    const systemPrompt = `You are a business intelligence analyst specializing in customer review analysis.
Analyze the provided customer reviews and return a structured JSON response.
Be concise, specific, and actionable. Base all insights strictly on the review content provided.
Return ONLY valid JSON, no markdown, no explanation outside the JSON.`

    const userPrompt = `Analyze these ${reviews.length} customer reviews and return a JSON object with exactly this structure:
{
  "topLoves": ["string", "string", "string"],
  "topComplaints": ["string", "string", "string"],
  "topRequests": ["string", "string", "string"],
  "sentimentSummary": "string (2-3 sentences describing overall sentiment and customer satisfaction level)",
  "keyInsights": ["string", "string", "string"]
}

Reviews to analyze:
${reviewSummary}`

    const message = await client.messages.create({
      model: INSIGHTS_MODEL,
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)

    return { success: true, insights: parsed }
  } catch (error) {
    console.error('Error generating insights:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export type ResponseTone = 'professional' | 'friendly' | 'casual' | 'formal'

const TONE_GUIDANCE: Record<ResponseTone, string> = {
  professional: 'Use a polished, professional tone. Clear, courteous, and business-appropriate.',
  friendly: 'Use a warm, friendly, conversational tone. Sound approachable and human, like a small-business owner who genuinely cares.',
  casual: 'Use a relaxed, casual tone. Plain language, no corporate-speak, but still polite.',
  formal: 'Use a formal tone with respectful, traditional phrasing. Suitable for upscale or professional-services brands.',
}

export async function generateReviewResponse(review: {
  content: string
  rating: number
  author_name: string
}, options: { tone?: ResponseTone; businessName?: string } = {}) {
  const tone: ResponseTone = options.tone || 'professional'
  const toneGuidance = TONE_GUIDANCE[tone]
  const businessLine = options.businessName
    ? `You are responding on behalf of "${options.businessName}". `
    : ''

  try {
    let systemPrompt = ''

    if (review.rating >= 4) {
      systemPrompt =
        `${businessLine}You are a business owner responding to a positive review. ${toneGuidance} Thank the customer specifically (reference what they liked when possible), express genuine appreciation, and invite them back. Keep it concise — 2 to 4 short sentences, around 300–500 characters. Do not start with "Dear" or "Hi [name]" unless it fits the tone naturally. Never make promises you can't keep. Never offer discounts or compensation unless the review specifically asks. Sign off naturally; do not include placeholders like [Your Name] or [Business Name].`
    } else if (review.rating >= 3) {
      systemPrompt =
        `${businessLine}You are a business owner responding to a neutral or mixed review. ${toneGuidance} Acknowledge what they liked AND what fell short, show you understand, and briefly note how you'll improve. Keep it concise — 2 to 4 short sentences, around 300–500 characters. Avoid being defensive. Never make promises you can't keep. Never include placeholders like [Your Name].`
    } else {
      systemPrompt =
        `${businessLine}You are a business owner responding to a negative review. ${toneGuidance} Apologize sincerely without being defensive, acknowledge the specific issue mentioned, and invite them to contact you privately to make it right (no public refund offers). Keep it concise — 2 to 4 short sentences, around 300–500 characters. Never include placeholders like [Your Name] or [Phone Number].`
    }

    const message = await client.messages.create({
      model: RESPONSE_MODEL,
      max_tokens: 350,
      messages: [
        {
          role: 'user',
          content: `Write a reply to this customer review. The customer's name is ${review.author_name} and they wrote:\n\n"${review.content}"\n\nReturn ONLY the reply text, no preamble, no quotation marks.`,
        },
      ],
      system: systemPrompt,
    })

    let responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Strip wrapping quotes that the model sometimes adds
    responseText = responseText.trim().replace(/^["'`]+|["'`]+$/g, '').trim()

    if (responseText.length > 2000) {
      responseText = responseText.substring(0, 2000).trim()
    }

    return {
      response: responseText,
      success: true,
    }
  } catch (error) {
    console.error('Error generating response:', error)
    return {
      response: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}