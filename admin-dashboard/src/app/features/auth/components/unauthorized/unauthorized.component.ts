import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card-wrapper">
        <p-card class="unauthorized-card">
          <ng-template pTemplate="header">
            <div class="unauthorized-header">
              <i class="pi pi-lock" style="font-size: 3rem; color: #ef4444;"></i>
              <h2>Access Denied</h2>
            </div>
          </ng-template>

          <div class="unauthorized-content">
            <p>
              You don't have sufficient permissions to access this page.
              This area is restricted to administrators only.
            </p>
            
            @if (authService.currentUser()) {
              <div class="user-info">
                <p><strong>Current User:</strong> {{ authService.currentUser()?.email }}</p>
                <p><strong>Role:</strong> {{ authService.currentUser()?.role }}</p>
              </div>
            }

            <div class="action-buttons">
              <p-button 
                label="Go to Dashboard" 
                icon="pi pi-home"
                (onClick)="goToDashboard()"
                styleClass="mr-2"
              ></p-button>
              
              <p-button 
                label="Logout" 
                icon="pi pi-sign-out"
                severity="secondary"
                (onClick)="logout()"
              ></p-button>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      padding: 1rem;
    }

    .unauthorized-card-wrapper {
      width: 100%;
      max-width: 500px;
    }

    .unauthorized-card {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: none;
      border-radius: 12px;
    }

    .unauthorized-header {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      margin: -1.5rem -1.5rem 0;
      border-radius: 12px 12px 0 0;
      color: white;
    }

    .unauthorized-header h2 {
      margin: 1rem 0 0;
      font-weight: 600;
      font-size: 1.75rem;
    }

    .unauthorized-content {
      padding: 2rem;
      text-align: center;
    }

    .unauthorized-content p {
      margin-bottom: 1.5rem;
      color: #4b5563;
      line-height: 1.6;
    }

    .user-info {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .user-info p {
      margin: 0.5rem 0;
      text-align: left;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    @media (max-width: 480px) {
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .action-buttons p-button {
        width: 100%;
        margin: 0.25rem 0;
      }
    }
  `]
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Logout method handles navigation to login
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force navigation to login even if logout fails
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
