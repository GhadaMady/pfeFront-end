import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Création du validateur personnalisé
function alphaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si le champ est vide, ne pas appliquer la validation.
    }
    const pattern = /^[a-zA-Z\s]*$/;
    return pattern.test(control.value) ? null : { alpha: true };
  };
}

@Component({
  selector: 'app-ajout-sinistre',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './ajout-sinistre.component.html',
  styleUrls: ['./ajout-sinistre.component.css']
})
export class AjoutSinistreComponent implements OnInit {
  sinistreForm!: FormGroup;
  isEditMode = false;
  sinistreId: string | null = null;
  users: any[] = [];
  contrats: any[] = [];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sinistreForm = this.fb.group({
      nameS: ['', [Validators.required, alphaValidator()]], // Utilisation du validateur alphabétique
      Date: ['', Validators.required],
      accident: ['', Validators.required],
      Etat: ['', Validators.required],
      User: ['', Validators.required],
      Contrat: ['', Validators.required]
    });

    this.loadUsers();
    this.setDefaultDates();

    this.route.paramMap.subscribe(params => {
      this.sinistreId = params.get('id');
      if (this.sinistreId) {
        this.isEditMode = true;
        this.loadSinistre(this.sinistreId);
      }
    });
  }

  setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];
    this.sinistreForm.patchValue({
      Date: today
    });
  }

  loadSinistre(id: string): void {
    this.http.get<any>('http://127.0.0.1:8800/api/sinistre/' + id).subscribe(
      (data) => {
        console.log('Sinistre data:', data); // Debugging line
        this.sinistreForm.patchValue(data);
        if (data.User) {
          this.loadContrat(data.User);
        }
      },
      (error) => {
        console.log('Erreur lors du chargement du sinistre : ', error);
      }
    );
  }

  loadUsers(): void {
    this.http.get<any[]>('http://127.0.0.1:8800/api/users').subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.log('Erreur lors du chargement des utilisateurs : ', error);
      }
    );
  }

  loadContrat(userId: string): void {
    if (userId) {
      this.http.get<any[]>('http://127.0.0.1:8800/api/contrat', {
        params: { userId: userId }
      }).subscribe(
        (data) => {
          console.log('Contrats data:', data); // Debugging line
          this.contrats = data.filter(contrat => contrat.Payer === true);
          if (this.contrats.length === 0) {
            alert('Ce utilisateur n\'a pas de contrats payés.');
          }
        },
        (error) => {
          console.error('Erreur lors du chargement des contrats : ', error);
        }
      );
    }
  }

  onUserChange(event: Event): void {
    const userId = (event.target as HTMLSelectElement).value;
    this.loadContrat(userId);
  }

  saveSinistre(): void {
    if (this.sinistreForm.invalid) {
      return;
    }
  
    const postObj = this.sinistreForm.value;
    
    this.http.post('http://127.0.0.1:8800/api/sinistre', postObj, { observe: 'response' })
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.router.navigateByUrl('/dashboard/sinistres');
          } else {
            console.error('Erreur lors de la sauvegarde du sinistre :', res.statusText);
            alert('Erreur lors de la sauvegarde du sinistre.');
          }
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde du sinistre :', error);
          alert('Erreur lors de la sauvegarde du sinistre.');
        }
      );
  }
  
  isFieldInvalid(field: string): boolean {
    const control = this.sinistreForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(field: string): string {
    const control = this.sinistreForm.get(field);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors['alpha']) {
        return 'Ce champ doit contenir uniquement des lettres.';
      }
    }
    return '';
  }
}
