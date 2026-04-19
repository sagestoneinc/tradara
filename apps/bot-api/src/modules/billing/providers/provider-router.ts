import type { BotApiEnv } from "@tradara/shared-config";
import type { PaymentProvider } from "./provider-adapter";

export interface ProviderRouterConfig {
  paypalWeight: number;
  xenditWeight: number;
  paymongoWeight: number;
}

export class ProviderRouter {
  private readonly totalWeight: number;
  private readonly config: ProviderRouterConfig;
  private readonly providers: Map<string, PaymentProvider>;

  constructor(config: ProviderRouterConfig, providers: Map<string, PaymentProvider>) {
    this.config = config;
    this.providers = providers;
    this.totalWeight = config.paypalWeight + config.xenditWeight + config.paymongoWeight;

    if (this.totalWeight <= 0) {
      throw new Error("Provider weights must sum to a positive number");
    }
  }

  static fromEnv(env: BotApiEnv, providers: Map<string, PaymentProvider>): ProviderRouter {
    return new ProviderRouter(
      {
        paypalWeight: env.PAYMENT_PROVIDER_PAYPAL_WEIGHT,
        xenditWeight: env.PAYMENT_PROVIDER_XENDIT_WEIGHT,
        paymongoWeight: env.PAYMENT_PROVIDER_PAYMONGO_WEIGHT
      },
      providers
    );
  }

  /**
   * Selects a provider using consistent hashing based on userId
   * This ensures the same user always gets the same provider (good for A/B testing)
   */
  selectProvider(userId: string): PaymentProvider {
    const hash = this.hashUserId(userId);
    const normalized = hash % this.totalWeight;

    if (normalized < this.config.paypalWeight) {
      const provider = this.providers.get("paypal");
      if (!provider) throw new Error("PayPal provider not available");
      return provider;
    }

    if (normalized < this.config.paypalWeight + this.config.xenditWeight) {
      const provider = this.providers.get("xendit");
      if (!provider) throw new Error("Xendit provider not available");
      return provider;
    }

    const provider = this.providers.get("paymongo");
    if (!provider) throw new Error("PayMongo provider not available");
    return provider;
  }

  /**
   * Simple hash function for userId -> number
   * Uses djb2 algorithm for consistency across runs
   */
  private hashUserId(userId: string): number {
    let hash = 5381;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) + hash + userId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get distribution stats for monitoring
   */
  getDistribution() {
    return {
      paypal: this.config.paypalWeight,
      xendit: this.config.xenditWeight,
      paymongo: this.config.paymongoWeight,
      total: this.totalWeight,
      percentages: {
        paypal: ((this.config.paypalWeight / this.totalWeight) * 100).toFixed(1),
        xendit: ((this.config.xenditWeight / this.totalWeight) * 100).toFixed(1),
        paymongo: ((this.config.paymongoWeight / this.totalWeight) * 100).toFixed(1)
      }
    };
  }
}
