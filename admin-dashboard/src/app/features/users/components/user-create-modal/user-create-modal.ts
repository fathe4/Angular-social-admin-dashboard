import { Component, inject, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User, UserRole, CreateUserRequest } from '../../models/user.model';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-user-create-modal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    Textarea,
    ProgressSpinnerModule,
  ],
  templateUrl: './user-create-modal.html',
  styleUrl: './user-create-modal.scss',
})
export class UserCreateModal implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  @Output() userCreated = new EventEmitter<User>();
  @Output() modalClosed = new EventEmitter<void>();

  visible = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  showPassword = false;
  showOptionalFields = false;

  // Form
  userForm!: FormGroup;

  // Options
  roleOptions = [
    { label: 'User', value: UserRole.USER },
    { label: 'Moderator', value: UserRole.MODERATOR },
    { label: 'Admin', value: UserRole.ADMIN },
    { label: 'Super Admin', value: UserRole.SUPER_ADMIN },
  ];

  verificationOptions = [
    { label: 'Verified', value: true },
    { label: 'Not Verified', value: false },
  ];

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [UserRole.USER, [Validators.required]],
      is_verified: [false],
      is_active: [true],
      bio: [''],
      location: [''],
    });
  }

  show(): void {
    this.visible.set(true);
    this.resetForm();
  }

  onShow(): void {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const firstInput = document.querySelector(
        'input[formControlName="first_name"]'
      ) as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  onClose(): void {
    this.hide();
  }

  hide(): void {
    this.visible.set(false);
    this.resetForm();
    this.modalClosed.emit();
  }

  private resetForm(): void {
    // Batch form operations to reduce reflows
    this.userForm.patchValue({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      role: UserRole.USER,
      is_verified: false,
      is_active: true,
      bio: '',
      location: '',
    });
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();
    
    this.error.set(null);
    this.success.set(null);
    this.showOptionalFields = false;
    this.showPassword = false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleOptionalFields(): void {
    this.showOptionalFields = !this.showOptionalFields;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.createUser();
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  private async createUser(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const formValue = this.userForm.value;

    // Prepare user data
    const userData: CreateUserRequest = {
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      is_verified: formValue.is_verified,
      is_active: formValue.is_active,
      bio: formValue.bio || null,
      location: formValue.location || null,
    };

    try {
      const newUser = await firstValueFrom(this.userService.createUser(userData));
      this.success.set('User created successfully!');

      // Emit the created user
      this.userCreated.emit(newUser);

      // Close modal after a short delay
      setTimeout(() => {
        this.hide();
      }, 1500);
    } catch (error: any) {
      console.error('Error creating user:', error);

      // Handle specific error messages
      let errorMessage = 'Failed to create user';
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      first_name: 'First name',
      last_name: 'Last name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      role: 'Role',
    };
    return labels[fieldName] || fieldName;
  }

  // Password strength indicator
  getPasswordStrength(): string {
    const password = this.userForm.get('password')?.value || '';
    if (password.length === 0) return '';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'Weak':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Strong':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  }
}
