import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  private baseUrl = 'http://127.0.0.1:8800/api'; // Assurez-vous que cette URL est correcte

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const url = `${this.baseUrl}/auth/login`;
    const { email, password } = this.loginForm.value;

    this.http.post(url, { email, password }).subscribe({
      next: (response: any) => {
        if (response && response.role) {
          if (response.role === 'admin') {
            this.router.navigateByUrl('/dashboard/home').then(() => {
              window.location.reload();
            });
          } else {
            this.errorMessage = 'Accès réservé aux administrateurs.';
          }
        } else {
          this.errorMessage = 'Réponse invalide du serveur.';
        }
      },
      error: (error) => {
        console.error('Login Error:', error);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }
}
