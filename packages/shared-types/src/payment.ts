import { z } from 'zod';
import { PaymentMethod } from './enums';

export const InitiatePaymentSchema = z.object({
  requestId: z.string().uuid(),
  method: z.nativeEnum(PaymentMethod).optional(), // optional for mock gateway
});

export type InitiatePaymentDto = z.infer<typeof InitiatePaymentSchema>;

export interface PaymentResult {
  paymentId: string;
  gatewayTransactionId: string;
  status: string;
  redirectUrl?: string;       // for hosted checkout (Paymob iframe, PayPal redirect)
  fawryCode?: string;         // for Fawry pay-at-outlet
  fawryExpiresAt?: string;    // ISO date string
}
