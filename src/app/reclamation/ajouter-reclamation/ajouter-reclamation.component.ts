import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajout-reclamation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './ajouter-reclamation.component.html',
  styleUrls: ['./ajouter-reclamation.component.css']
})
export class AjoutReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  isEditMode = false;
  users: any[] = [];
  etats: string[] = ['en attente', 'En cours'];

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reclamationForm = this.fb.group({
      Titre: ['', [
        Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(100) 
      ]],
    
      Date: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) // Format de date YYYY-MM-DD
      ]],
    
      message: ['', [
        Validators.required,
        Validators.minLength(10), 
        Validators.maxLength(2000) 
      ]],
    
      Etat: ['', [
        Validators.required,
        Validators.pattern(/^(En cours|Probléme résolu|en attente)$/) 
      ]],
    
      User: ['', [
        Validators.required,
       
      ]]
    });
    

    this.loadUsers();
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];
    this.reclamationForm.patchValue({
      Date: today
    });
  }

  loadUsers(): void {
    this.http.get<any[]>('http://127.0.0.1:8800/api/users').subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs : ', error);
      }
    );
  }

  saveReclamation(): void {
    if (this.reclamationForm.invalid) {
      this.reclamationForm.markAllAsTouched(); // Marquer tous les champs comme touchés pour afficher les messages d'erreur
      return;
    }
  
    const postObj = this.reclamationForm.value;

    this.http.post('http://127.0.0.1:8800/api/reclamation', postObj, { observe: 'response' })
      .subscribe(
        (res) => {
          if (res.status === 200) {
            this.router.navigateByUrl('/dashboard/reclamations');
          } else {
            console.error('Erreur lors de la sauvegarde de la réclamation :', res.statusText);
            alert('Erreur lors de la sauvegarde de la réclamation.');
          }
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde de la réclamation :', error);
          alert('Erreur lors de la sauvegarde de la réclamation.');
        }
      );
  }
  
  isFieldInvalid(field: string): boolean {
    const control = this.reclamationForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  
  getErrorMessage(field: string): string {
    const control = this.reclamationForm.get(field);
    
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors['minlength']) {
        return `Le champ doit contenir au moins ${control.errors['minlength'].requiredLength} caractères.`;
      }
      if (control.errors['maxlength']) {
        return `Le champ ne doit pas dépasser ${control.errors['maxlength'].requiredLength} caractères.`;
      }
      if (control.errors['pattern']) {
        return 'Le format du champ est invalide.';
      }
    }
    
    return '';
  }
  
}
