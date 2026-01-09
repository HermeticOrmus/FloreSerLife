import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
if (!anthropicApiKey) {
  console.warn("ANTHROPIC_API_KEY not set - mAIa LLM features will be disabled");
}

const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

// mAIa system prompt for facilitator onboarding
const MAIA_SYSTEM_PROMPT = `You are mAIa (pronounced "my-ah"), the AI Guardian of FloreSer.Life - a wellness marketplace connecting clients with facilitators (practitioners).

Your role in this conversation is to guide potential facilitators through their application to join FloreSer's community of wellness practitioners, known as "Pollinators."

## About FloreSer
FloreSer uses a nature-inspired archetype system with four Pollinator types:
- **Bee (Foundation)**: Creates safe, grounding spaces. Perfect for new facilitators. Focuses on foundational wellness practices.
- **Hummingbird (Precision)**: Quick insights, spiritual guidance. For experienced practitioners offering targeted interventions.
- **Butterfly (Transformation)**: Life transitions, metamorphosis. For those guiding deep personal change.
- **Beetle (Integration)**: Deep work, shadow integration. For experienced practitioners doing intensive healing work.

Experience levels:
- **Rising** (0-2 years): New to facilitating
- **Evolving** (3-7 years): Developing expertise
- **Wise** (8+ years): Established practitioners

## Your Conversation Goals
1. Learn about the applicant's background and experience
2. Understand their healing modalities and approach
3. Explore their motivation for joining FloreSer
4. Gather practical details (virtual/in-person, availability, pricing)
5. Help them understand which archetype resonates with their practice
6. Assess fit for the FloreSer community

## Conversation Guidelines
- Be warm, welcoming, and genuine
- Ask one or two questions at a time, not overwhelming lists
- Listen and respond to what they share before moving on
- For new facilitators, emphasize that Bee is a wonderful starting point
- Don't rush - this is a conversation, not an interrogation
- Share brief insights about FloreSer's philosophy when relevant
- Be encouraging while maintaining discernment about fit

## Information to Gather (organically through conversation)
- Name and basic background
- Healing modalities/practices they offer
- Years of experience
- Whether they work virtually, in-person, or both
- Location (if in-person)
- Hourly rate range they're considering
- What drew them to FloreSer
- Their philosophy on healing/wellness

## At the End
When you feel you have enough information, summarize what you've learned and let them know their application will be reviewed. Express genuine appreciation for their interest.

Remember: You are the first point of contact for facilitators joining our community. Make them feel welcomed and valued.`;

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface ApplicationData {
  firstName?: string;
  lastName?: string;
  yearsExperience?: number;
  modalities?: string[];
  suggestedArchetype?: "bee" | "hummingbird" | "butterfly" | "beetle";
  isVirtual?: boolean;
  isInPerson?: boolean;
  location?: string;
  hourlyRateMin?: string; // Stored as decimal in DB
  hourlyRateMax?: string; // Stored as decimal in DB
  motivation?: string;
}

export class ClaudeService {
  /**
   * Chat with mAIa for facilitator onboarding
   */
  async chat(
    conversationHistory: ConversationMessage[],
    userMessage: string
  ): Promise<string> {
    if (!anthropic) {
      // Fallback response when API not available
      return "I'm sorry, I'm currently experiencing some technical difficulties. Please try again later or contact support at hello@floreser.life for assistance with your facilitator application.";
    }

    try {
      // Build messages array
      const messages = [
        ...conversationHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: userMessage },
      ];

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: MAIA_SYSTEM_PROMPT,
        messages,
      });

      // Extract text from response
      const textBlock = response.content.find((block) => block.type === "text");
      return textBlock ? textBlock.text : "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Claude API error:", error);
      throw new Error("Failed to generate response from mAIa");
    }
  }

  /**
   * Extract structured application data from conversation history
   */
  async extractApplicationData(
    conversationHistory: ConversationMessage[]
  ): Promise<ApplicationData> {
    if (!anthropic) {
      return {};
    }

    const extractionPrompt = `Based on the following conversation between mAIa and a potential facilitator, extract the application data in JSON format.

Conversation:
${conversationHistory.map((m) => `${m.role}: ${m.content}`).join("\n\n")}

Extract the following fields if mentioned (use null for unknown):
- firstName
- lastName
- yearsExperience (number)
- modalities (array of strings - their healing practices)
- suggestedArchetype ("bee", "hummingbird", "butterfly", or "beetle" based on their experience and approach)
- isVirtual (boolean)
- isInPerson (boolean)
- location (string, if in-person)
- hourlyRateMin (number, in USD)
- hourlyRateMax (number, in USD)
- motivation (string - why they want to join FloreSer)

Respond ONLY with valid JSON, no other text.`;

    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: extractionPrompt }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock) return {};

      // Parse JSON response
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return {};

      const parsed = JSON.parse(jsonMatch[0]);

      // Convert numeric rates to strings for database compatibility
      return {
        ...parsed,
        hourlyRateMin: parsed.hourlyRateMin != null ? String(parsed.hourlyRateMin) : undefined,
        hourlyRateMax: parsed.hourlyRateMax != null ? String(parsed.hourlyRateMax) : undefined,
      };
    } catch (error) {
      console.error("Error extracting application data:", error);
      return {};
    }
  }

  /**
   * Generate a welcome message for new applicants
   */
  getWelcomeMessage(): string {
    return `Hello! I'm mAIa, the AI Guardian of FloreSer. I'm so glad you're interested in joining our community of wellness facilitators - we call them Pollinators here.

I'd love to learn more about you and your healing practice. This isn't a formal interview - just a conversation to help us understand who you are and how you might flourish in our community.

To start, could you tell me a little about yourself and what kind of wellness work you do?`;
  }

  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return anthropic !== null;
  }
}

export const claudeService = new ClaudeService();
