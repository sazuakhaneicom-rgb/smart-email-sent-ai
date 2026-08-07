import { billingRepository, BillingPlan, PlanTier } from '../../repositories/billing.repository';
import { getPaginationOptions } from '../../utils/pagination';
import { SubscribePlanDto } from './validation';
import { logger } from '../../utils/logger';
import { config } from '../../config';

const PLAN_CONFIG: Record<Exclude<PlanTier, 'free'>, {
  name: string;
  emailsPerMonth: number;
  contactsLimit: number;
  workspaceMembersLimit: number;
  monthlyPrice: number;
  yearlyPrice: number;
}> = {
  starter: {
    name: 'Starter',
    emailsPerMonth: 10000,
    contactsLimit: 2500,
    workspaceMembersLimit: 3,
    monthlyPrice: 990,  // BDT
    yearlyPrice: 9900,
  },
  growth: {
    name: 'Growth',
    emailsPerMonth: 50000,
    contactsLimit: 10000,
    workspaceMembersLimit: 5,
    monthlyPrice: 2490,
    yearlyPrice: 24900,
  },
  pro: {
    name: 'Pro',
    emailsPerMonth: 200000,
    contactsLimit: 50000,
    workspaceMembersLimit: 15,
    monthlyPrice: 5990,
    yearlyPrice: 59900,
  },
  enterprise: {
    name: 'Enterprise',
    emailsPerMonth: 1000000,
    contactsLimit: 500000,
    workspaceMembersLimit: 999,
    monthlyPrice: 19990,
    yearlyPrice: 199900,
  },
};

export class BillingService {
  async getCurrentPlan(workspaceId: string) {
    return billingRepository.getCurrentPlan(workspaceId);
  }

  async getInvoices(workspaceId: string, query: Record<string, string>) {
    const options = getPaginationOptions(query);
    const { data, total } = await billingRepository.getInvoices(workspaceId, options);
    return {
      data,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async subscribe(workspaceId: string, dto: SubscribePlanDto) {
    const planConfig = PLAN_CONFIG[dto.tier as Exclude<PlanTier, 'free'>];
    if (!planConfig) throw new Error('Invalid plan tier');

    const price = dto.billingCycle === 'yearly' ? planConfig.yearlyPrice : planConfig.monthlyPrice;

    // SSLCommerz payment initiation (placeholder)
    if (dto.paymentMethod === 'sslcommerz') {
      if (!config.payment.sslcommerzStoreId) {
        logger.warn('SSLCommerz not configured — simulating payment');
      }
      logger.info(`SSLCommerz payment initiated for workspace ${workspaceId}, plan ${dto.tier}`);
      // In production: call SSLCommerz API and return redirect URL
      const simulatedTransactionId = `ssl-${Date.now()}`;
      await billingRepository.updatePlan(workspaceId, {
        tier: dto.tier,
        name: planConfig.name,
        emailsPerMonth: planConfig.emailsPerMonth,
        contactsLimit: planConfig.contactsLimit,
        workspaceMembersLimit: planConfig.workspaceMembersLimit,
        price,
        currency: 'BDT',
        billingCycle: dto.billingCycle,
        subscribedAt: new Date(),
        renewsAt: this.calculateRenewalDate(dto.billingCycle),
        sslcommerzTransactionId: simulatedTransactionId,
        emailsSentThisMonth: 0,
        monthResetAt: new Date(),
      });
      await billingRepository.createInvoice(workspaceId, {
        amount: price,
        currency: 'BDT',
        status: 'paid',
        description: `${planConfig.name} Plan — ${dto.billingCycle}`,
        paymentMethod: 'sslcommerz',
        sslcommerzValId: simulatedTransactionId,
        paidAt: new Date(),
      });
      return { success: true, transactionId: simulatedTransactionId };
    }

    // Stripe payment (placeholder)
    if (!config.payment.stripeSecretKey) {
      logger.warn('Stripe not configured — simulating payment');
    }
    logger.info(`Stripe payment initiated for workspace ${workspaceId}, plan ${dto.tier}`);
    const simulatedStripeSubId = `sub_${Date.now()}`;
    await billingRepository.updatePlan(workspaceId, {
      tier: dto.tier,
      name: planConfig.name,
      emailsPerMonth: planConfig.emailsPerMonth,
      contactsLimit: planConfig.contactsLimit,
      workspaceMembersLimit: planConfig.workspaceMembersLimit,
      price,
      currency: 'USD',
      billingCycle: dto.billingCycle,
      subscribedAt: new Date(),
      renewsAt: this.calculateRenewalDate(dto.billingCycle),
      stripeSubscriptionId: simulatedStripeSubId,
      emailsSentThisMonth: 0,
      monthResetAt: new Date(),
    });
    await billingRepository.createInvoice(workspaceId, {
      amount: Math.round(price / 110), // BDT to rough USD
      currency: 'USD',
      status: 'paid',
      description: `${planConfig.name} Plan — ${dto.billingCycle}`,
      paymentMethod: 'stripe',
      stripeInvoiceId: simulatedStripeSubId,
      paidAt: new Date(),
    });
    return { success: true, subscriptionId: simulatedStripeSubId };
  }

  async handleWebhook(event: Record<string, unknown>) {
    logger.info('Payment webhook received:', event.type);
    // Handle Stripe events
    if (typeof event.type === 'string') {
      switch (event.type) {
        case 'invoice.paid':
          logger.info('Invoice paid webhook processed');
          break;
        case 'invoice.payment_failed':
          logger.warn('Invoice payment failed webhook');
          break;
        case 'customer.subscription.deleted':
          logger.info('Subscription cancelled');
          break;
        default:
          logger.debug('Unhandled webhook event type:', event.type);
      }
    }
    return { received: true };
  }

  private calculateRenewalDate(cycle: 'monthly' | 'yearly'): Date {
    const date = new Date();
    if (cycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }
}

export const billingService = new BillingService();
