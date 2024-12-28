import { CommonModule, NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-paiment',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './ajouter-paiment.component.html',
  styleUrls: ['./ajouter-paiment.component.css']
})
export class AjouterPaimentComponent implements OnInit {
  paiementForm: FormGroup;
  users: any[] = [];
  contrats: any[] = [];
  isEditMode = false;
  paiementId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { 
    this.paiementForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(19),
        Validators.pattern(/^\d{16,19}$/)
      ]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/(2[3-9]|[3-9]\d)$/) // Mois 01-12 et année >= 2023
      ]],
      cvv: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(4),
        Validators.pattern(/^\d{3,4}$/) // CVV de 3 ou 4 chiffres
      ]],
      datePaiement: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) // Format de date YYYY-MM-DD
      ]],
      cardHolderName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]+$/) // Lettres et espaces seulement
      ]],
      user: ['', [Validators.required]],
      contrat: ['', [Validators.required]],
      isDeleted: [false] // Valeur par défaut
    });
  }
  
  ngOnInit(): void {  
    this.loadUsers();

    this.paiementForm.get('user')?.valueChanges.subscribe(userId => {
      this.loadContrats(userId);
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.paiementId = params['id'];
        if (this.paiementId) {
          this.loadPaiement(this.paiementId);
        }
      }
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

  loadContrats(userId: string): void {
    if (userId) {
      this.http.get<any[]>(`http://127.0.0.1:8800/api/contrat`, {
        params: { userId: userId }
      }).subscribe(
        (data) => {
          this.contrats = data.filter(contrat =>
            contrat.Etat === 'Valider' && contrat.Payer === false
          );

          if (this.contrats.length === 0) {
            alert('Ce utilisateur n\'a pas de contrats activés ou validés.');
          }
        },
        (error) => {
          console.error('Erreur lors du chargement des contrats : ', error);
        }
      );
    }
  }

  loadPaiement(id: string): void {
    this.http.get<any>(`http://127.0.0.1:8800/api/paeiment/${id}`).subscribe(
      (data) => {
        this.paiementForm.patchValue(data);
        this.loadContrats(data.user); // Charger les contrats pour l'utilisateur sélectionné
      },
      (error) => {
        console.error('Erreur lors du chargement du paiement : ', error);
      }
    );
  }

  savePaiement(): void {
    if (this.paiementForm.invalid) {
      this.paiementForm.markAllAsTouched();
      return;
    }

    const postObj = this.paiementForm.value;

    if (this.isEditMode && this.paiementId) {
      this.http.put(`http://127.0.0.1:8800/api/paeiment/${this.paiementId}`, postObj, { observe: 'response' })
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.router.navigateByUrl('/dashboard/paiments');
          } else {
            alert('Erreur : ' + res.message);
          }
        }, error => {
          console.error('Erreur lors de la sauvegarde du paiement : ', error);
        });
    } else {
      this.http.post('http://127.0.0.1:8800/api/paeiment', postObj, { observe: 'response' })
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.router.navigateByUrl('/dashboard/paiments');
          } else {
            alert('Erreur : ' + res.message);
          }
        }, error => {
          console.error('Erreur lors de l\'ajout du paiement : ', error);
        });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.paiementForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.paiementForm.get(field);

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
