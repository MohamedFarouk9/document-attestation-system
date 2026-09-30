import { z } from 'zod';
import { RequestStatus } from './enums';

// Valid state transitions for the request lifecycle
export const REQUEST_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  [RequestStatus.DRAFT]:                    [RequestStatus.SUBMITTED, RequestStatus.CANCELLED],
  [RequestStatus.SUBMITTED]:                [RequestStatus.PAYMENT_PENDING, RequestStatus.CANCELLED],
  [RequestStatus.PAYMENT_PENDING]:          [RequestStatus.PAYMENT_CONFIRMED, RequestStatus.CANCELLED],
  [RequestStatus.PAYMENT_CONFIRMED]:        [RequestStatus.ASSIGNED, RequestStatus.ON_HOLD, RequestStatus.CANCELLED],
  [RequestStatus.ASSIGNED]:                 [RequestStatus.PICKED_UP, RequestStatus.ON_HOLD, RequestStatus.CANCELLED],
  [RequestStatus.PICKED_UP]:                [RequestStatus.IN_TRANSIT_TO_AUTHORITY, RequestStatus.ON_HOLD],
  [RequestStatus.IN_TRANSIT_TO_AUTHORITY]:   [RequestStatus.AT_AUTHORITY, RequestStatus.ON_HOLD],
  [RequestStatus.AT_AUTHORITY]:             [RequestStatus.AUTHENTICATED, RequestStatus.REJECTED_BY_AUTHORITY, RequestStatus.ON_HOLD],
  [RequestStatus.AUTHENTICATED]:            [RequestStatus.IN_TRANSIT_TO_CITIZEN, RequestStatus.ON_HOLD],
  [RequestStatus.REJECTED_BY_AUTHORITY]:    [RequestStatus.ON_HOLD, RequestStatus.CANCELLED, RequestStatus.REFUNDED],
  [RequestStatus.IN_TRANSIT_TO_CITIZEN]:    [RequestStatus.DELIVERED, RequestStatus.ON_HOLD],
  [RequestStatus.DELIVERED]:                [RequestStatus.CLOSED],
  [RequestStatus.CLOSED]:                   [],
  [RequestStatus.ON_HOLD]:                  [
    RequestStatus.PAYMENT_CONFIRMED, RequestStatus.ASSIGNED, RequestStatus.PICKED_UP,
    RequestStatus.IN_TRANSIT_TO_AUTHORITY, RequestStatus.AT_AUTHORITY,
    RequestStatus.AUTHENTICATED, RequestStatus.IN_TRANSIT_TO_CITIZEN,
    RequestStatus.CANCELLED, RequestStatus.REFUNDED,
  ],
  [RequestStatus.CANCELLED]:                [RequestStatus.REFUNDED],
  [RequestStatus.REFUNDED]:                 [],
};

export function isValidTransition(from: RequestStatus, to: RequestStatus): boolean {
  return REQUEST_TRANSITIONS[from]?.includes(to) ?? false;
}

// --- Zod Schemas for API validation ---

export const CreateRequestSchema = z.object({
  documentTypeId: z.string().uuid(),
  authorityId: z.string().uuid(),
  originGovernorateId: z.string().uuid(),
  destinationGovernorateId: z.string().uuid().optional(),
  pickupAddress: z.string().min(5).max(500),
  pickupPhone: z.string().min(8).max(20),
  deliveryAddress: z.string().min(5).max(500).optional(),
  deliveryPhone: z.string().min(8).max(20).optional(),
  notes: z.string().max(1000).optional(),
  isExpedited: z.boolean().default(false),
});

export type CreateRequestDto = z.infer<typeof CreateRequestSchema>;

export const UpdateRequestStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus),
  reason: z.string().max(1000).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type UpdateRequestStatusDto = z.infer<typeof UpdateRequestStatusSchema>;
