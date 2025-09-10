import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TransactionTableComponent, Transaction } from '../../../../shared/components/transaction-table/transaction-table.component';
import { TransactionService } from '../../services/transaction.service';
import { TransactionFilters } from '../../models/transaction.model';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DatePicker,
    Select,
    TransactionTableComponent,
    ToastModule,
  ],
  templateUrl: './transactions-page.component.html',
  providers: [MessageService],
})
export class TransactionsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();
  loading: boolean = false;

  // Filter properties
  searchTerm: string = '';
  statusFilter: any = undefined;
  paymentMethodFilter: any = undefined;
  referenceTypeFilter: any = undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;

  // Filter options
  statusOptions = [
    { name: 'All Status', code: '' },
    { name: 'Pending', code: 'pending' },
    { name: 'Completed', code: 'completed' },
    { name: 'Failed', code: 'failed' },
    { name: 'Cancelled', code: 'cancelled' },
  ];

  paymentMethodOptions = [
    { name: 'All Payment Methods', code: '' },
    { name: 'Stripe', code: 'stripe' },
    { name: 'PayPal', code: 'paypal' },
    { name: 'Bank Transfer', code: 'bank_transfer' },
    { name: 'Credit Card', code: 'credit_card' },
  ];

  referenceTypeOptions = [
    { name: 'All Reference Types', code: '' },
    { name: 'Subscription', code: 'subscription' },
    { name: 'Purchase', code: 'purchase' },
    { name: 'Refund', code: 'refund' },
    { name: 'Boost', code: 'boost' },
  ];

  constructor(
    private transactionService: TransactionService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTransactions(): void {
    this.loading = true;

    const filters: TransactionFilters = {
      status: this.statusFilter?.code || undefined,
      referenceType: this.referenceTypeFilter?.code || undefined,
      paymentMethod: this.paymentMethodFilter?.code || undefined,
      dateFrom: this.startDate ? this.startDate.toISOString() : undefined,
      dateTo: this.endDate ? this.endDate.toISOString() : undefined,
      limit: 100,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };

    this.transactionService.getAllTransactions(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.transactionsSubject.next(transactions);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load transactions. Please try again.',
          });
          this.loading = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadTransactions();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = undefined;
    this.paymentMethodFilter = undefined;
    this.referenceTypeFilter = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
    this.loadTransactions(); // Reload from API with cleared filters
  }

  onTransactionClick(transaction: Transaction): void {
    console.log('Transaction clicked:', transaction);
    // TODO: Navigate to transaction details or show modal
  }

  onUserClick(userId: string): void {
    console.log('User clicked:', userId);
    // TODO: Navigate to user details
  }
}
