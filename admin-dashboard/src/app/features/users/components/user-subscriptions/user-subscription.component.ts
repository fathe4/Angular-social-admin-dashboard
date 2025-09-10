import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TableModule } from "primeng/table";

@Component({
  selector: 'user-subscriptions',
  imports: [TableModule, CommonModule],
  templateUrl: `user-subscription.component.html`,
})
export class UserSubscriptions {
  subscriptions: any[] = [];

  ngOnInit() {
    this.subscriptions = [
      {
        id: 'sub_001',
        user_id: 'user_101',
        status: 'active',
        started_at: '2025-09-02T12:00:00Z',
        expires_at: '2025-10-02T12:00:00Z',
        created_at: '2025-09-02T12:00:00Z',
        updated_at: '2025-09-02T12:00:00Z',
        subscription_tier: {
          id: 'tier_basic',
          name: 'Basic',
          description: 'Basic plan for casual users',
          price: 9.99,
          duration_days: 30,
          listing_limit: 5,
          featured_listings: false,
          priority_search: false,
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-01T10:00:00Z',
        },
      },
      {
        id: 'sub_002',
        user_id: 'user_102',
        status: 'expired',
        started_at: '2025-08-15T08:30:00Z',
        expires_at: '2025-09-15T08:30:00Z',
        created_at: '2025-08-15T08:30:00Z',
        updated_at: '2025-09-15T08:30:00Z',
        subscription_tier: {
          id: 'tier_pro',
          name: 'Pro',
          description: 'Pro plan for active users',
          price: 29.99,
          duration_days: 30,
          listing_limit: 20,
          featured_listings: true,
          priority_search: true,
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-01T10:00:00Z',
        },
      },
      {
        id: 'sub_003',
        user_id: 'user_103',
        status: 'active',
        started_at: '2025-07-01T09:00:00Z',
        expires_at: '2026-07-01T09:00:00Z',
        created_at: '2025-07-01T09:00:00Z',
        updated_at: '2025-07-01T09:00:00Z',
        subscription_tier: {
          id: 'tier_premium',
          name: 'Premium',
          description: 'Annual premium subscription with max features',
          price: 199.99,
          duration_days: 365,
          listing_limit: 100,
          featured_listings: true,
          priority_search: true,
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-01T10:00:00Z',
        },
      },
      {
        id: 'sub_004',
        user_id: 'user_104',
        status: 'canceled',
        started_at: '2025-06-01T09:00:00Z',
        expires_at: '2025-07-01T09:00:00Z',
        created_at: '2025-06-01T09:00:00Z',
        updated_at: '2025-06-15T09:00:00Z',
        subscription_tier: {
          id: 'tier_basic',
          name: 'Basic',
          description: 'Basic plan for casual users',
          price: 9.99,
          duration_days: 30,
          listing_limit: 5,
          featured_listings: false,
          priority_search: false,
          created_at: '2025-09-01T10:00:00Z',
          updated_at: '2025-09-01T10:00:00Z',
        },
      },
    ];
  }
}
