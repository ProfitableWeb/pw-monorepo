/** PW-064 | Типы AI-провайдеров. */

export type AiApiType = 'openai_compatible' | 'anthropic';

export interface AiProvider {
  id: string;
  name: string;
  apiType: AiApiType;
  apiKeyPrefix: string;
  baseUrl: string | null;
  modelName: string;
  isDefault: boolean;
  isActive: boolean;
  maxContextTokens: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiProviderCreatePayload {
  name: string;
  api_type: AiApiType;
  api_key: string;
  base_url?: string | null;
  model_name: string;
  max_context_tokens?: number | null;
  description?: string | null;
  is_default?: boolean;
}

export interface AiProviderUpdatePayload {
  name?: string;
  api_key?: string;
  base_url?: string | null;
  model_name?: string;
  max_context_tokens?: number | null;
  description?: string | null;
  is_active?: boolean;
}

export interface AiProviderTestResult {
  success: boolean;
  latencyMs: number;
  modelResponse: string | null;
  error: string | null;
}
