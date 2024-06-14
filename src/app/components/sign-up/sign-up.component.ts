import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  hidePassword: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).pipe(
        tap(response => {
          this.successMessage = 'User registered successfully';
          console.log(this.successMessage, response);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // Redirect to sign-in after 3 seconds
        }),
        catchError(error => {
          this.errorMessage = 'Registration failed. Please try again.';
          console.error(this.errorMessage, error);
          return of(null); // Return null to keep the observable stream intact
        })
      ).subscribe();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
