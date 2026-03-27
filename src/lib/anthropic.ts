import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateReviewResponse(review: {
  content: string
  rating: number
  author_name: string
}) {
  try {
    let systemPrompt = ''

    if (review.rating >= 4) {
      systemPrompt =
        'You are a professional business owner responding to positive reviews. Thank the customer, express genuine appreciation, and encourage them to visit again or recommend your business to others. Keep the response professional, warm, and around 1800-2000 characters (detailed and engaging).'
    } else if (review.rating >= 3) {
      systemPrompt =
        'You are a professional business owner responding to a neutral/mixed review. Acknowledge their feedback, show you understand their perspective, and explain how you plan to improve their experience or address their concerns. Keep the response professional and around 1800-2000 characters (detailed and addressing concerns thoroughly).'
    } else {
      systemPrompt =
        'You are a professional business owner responding to a negative review. Apologize sincerely for their experience, acknowledge any specific issues they mentioned, offer a concrete solution or next steps, and invite them to contact you directly to resolve the issue. Keep the response professional and around 1800-2000 characters (thorough and solution-focused).'
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Please write a response to this customer review. The customer's name is ${review.author_name} and they wrote:\n\n"${review.content}"`,
        },
      ],
      system: systemPrompt,
    })

    let responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Truncate to 4000 characters max (Google Reviews limit)
    if (responseText.length > 4000) {
      responseText = responseText.substring(0, 4000).trim()
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