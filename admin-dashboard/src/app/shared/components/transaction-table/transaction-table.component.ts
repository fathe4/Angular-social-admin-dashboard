import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  reference_type: string;
  reference_id: string;
  transaction_id: string | null;
  created_at: string | null;
  completed_at: string | null;
}

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, RouterLink],
  templateUrl: './transaction-table.component.html',
})
export class TransactionTableComponent {
  @Input() transactions: Transaction[] = [];
  @Input() showUserColumn: boolean = true;
  @Input() showPaginator: boolean = true;
  @Input() rowsPerPage: number = 10;
  @Input() loading: boolean = false;

  @Output() transactionClick = new EventEmitter<Transaction>();
  @Output() userClick = new EventEmitter<string>();

  onTransactionClick(transaction: Transaction): void {
    this.transactionClick.emit(transaction);
  }

  onUserClick(userId: string, event: Event): void {
    event.stopPropagation();
    this.userClick.emit(userId);
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'cancelled':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getReferenceTypeSeverity(referenceType: string): string {
    switch (referenceType) {
      case 'subscription':
        return 'info';
      case 'purchase':
        return 'success';
      case 'refund':
        return 'warning';
      case 'boost':
        return 'help';
      default:
        return 'secondary';
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatAmount(amount: number, currency: string): string {
    return `$${amount} ${currency.toUpperCase()}`;
  }

  truncateId(id: string, length: number = 8): string {
    return id.substring(0, length) + '...';
  }
}
