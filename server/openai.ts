import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface RiskAssessment {
  riskScore: number;
  factors: {
    category: string;
    impact: number;
    description: string;
  }[];
  recommendations: string[];
}

export async function analyzeSupplyChainRisk(nodeData: any): Promise<RiskAssessment> {
  const prompt = `Analyze the supply chain risk for the following node data and provide a detailed risk assessment. Respond with JSON in this format:
  {
    "riskScore": number between 0-100,
    "factors": [
      {
        "category": string (e.g. "Environmental", "Political", "Economic"),
        "impact": number between 0-10,
        "description": string explaining the risk factor
      }
    ],
    "recommendations": array of strings with specific mitigation strategies
  }
  
  Node data: ${JSON.stringify(nodeData)}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a supply chain risk analysis expert."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content) as RiskAssessment;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze supply chain risk");
  }
}
