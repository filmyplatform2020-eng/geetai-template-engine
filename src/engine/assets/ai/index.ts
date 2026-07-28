import type { AIProvider, AIImageRequest, AIImageResult, AssetPrompt } from "./types"
import { generatePrompt, generateAllAssetPrompts } from "./prompts"

export type { AIProvider, AIImageRequest, AIImageResult, AssetPrompt }

export interface AIAssetEngine {
  name: string
  generate(request: AIImageRequest): Promise<AIImageResult>
}

export function createAIAssetEngine(provider: AIProvider = "custom"): AIAssetEngine {
  switch (provider) {
    case "openai":
      return openAIEngine()
    case "replicate":
      return replicateEngine()
    case "stability":
      return stabilityEngine()
    default:
      return customEngine(provider)
  }
}

function openAIEngine(): AIAssetEngine {
  return {
    name: "OpenAI DALL-E",
    async generate(request: AIImageRequest): Promise<AIImageResult> {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          n: 1,
          size: `${request.width ?? 1024}x${request.height ?? 1024}`,
          negative_prompt: request.negativePrompt,
        }),
      })
      const data = await res.json()
      return { url: data.data?.[0]?.url ?? "", provider: "openai", prompt: request.prompt }
    },
  }
}

function replicateEngine(): AIAssetEngine {
  return {
    name: "Replicate",
    async generate(request: AIImageRequest): Promise<AIImageResult> {
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
        body: JSON.stringify({
          version: "stability-ai/sdxl",
          input: { prompt: request.prompt, negative_prompt: request.negativePrompt },
        }),
      })
      const data = await res.json()
      return { url: data.output?.[0] ?? "", provider: "replicate", prompt: request.prompt }
    },
  }
}

function stabilityEngine(): AIAssetEngine {
  return {
    name: "Stability AI",
    async generate(request: AIImageRequest): Promise<AIImageResult> {
      const res = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: request.prompt, weight: 1 }, { text: request.negativePrompt, weight: -1 }],
          width: request.width ?? 1024,
          height: request.height ?? 1024,
        }),
      })
      const data = await res.json()
      return { url: data.artifacts?.[0]?.base64 ?? "", provider: "stability", prompt: request.prompt }
    },
  }
}

function customEngine(provider: AIProvider): AIAssetEngine {
  return {
    name: `Custom (${provider})`,
    async generate(_request: AIImageRequest): Promise<AIImageResult> {
      throw new Error(`Provider ${provider} not implemented. Override by implementing the AIAssetEngine interface.`)
    },
  }
}

export { generatePrompt, generateAllAssetPrompts }
