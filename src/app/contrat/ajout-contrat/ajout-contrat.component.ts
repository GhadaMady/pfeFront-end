import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajout-contrat',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ajout-contrat.component.html',
  styleUrls: ['./ajout-contrat.component.css']
})
export class AjoutContratComponent implements OnInit {
  contratForm!: FormGroup;
  isEditMode = false;
  contratId: string | null = null;
  users: any[] = [];
  produits: any[] = [];
  etats: string[] = ['En attente', 'En cours', 'Réglement', 'Valider', 'Réfuser'];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
    this.loadProduits();
    this.setDefaultDates();

    this.route.paramMap.subscribe(params => {
      this.contratId = params.get('id');
      console.log('Contract ID:', this.contratId);  // Debugging
      if (this.contratId) {
        this.isEditMode = true;
        this.loadContrat();
      } else {
        this.isEditMode = false;
      }
    });
  }

  initializeForm(): void {
    this.contratForm = this.fb.group({
      nameC: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      DateDebut: ['', Validators.required],
      DateFin: ['', [Validators.required, this.dateRangeValidator]],
      Etat: ['En cours', Validators.required],
      User: ['', Validators.required],
      Produit: ['', Validators.required]
    });
  }

  setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];
    this.contratForm.patchValue({
      DateDebut: today,
      DateFin: today
    });
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

  loadProduits(): void {
    this.http.get<any[]>('http://127.0.0.1:8800/api/produit').subscribe(
      (data) => {
        this.produits = data;
      },
      (error) => {
        console.log('Erreur lors du chargement des produits : ', error);
      }
    );
  }

  loadContrat(): void {
    if (!this.contratId) return;

    this.http.get<any>(`http://127.0.0.1:8800/api/contrat/${this.contratId}`).subscribe(
      (data) => {
        console.log('Contract Data:', data);  // Debugging
        this.contratForm.patchValue(data);
      },
      (error) => {
        console.log('Erreur lors du chargement du contrat : ', error);
      }
    );
  }

  saveContrat(): void {
    if (this.contratForm.invalid) {
      return;
    }

    const postObj = this.contratForm.value;
    const request$ = this.isEditMode 
      ? this.http.put(`http://127.0.0.1:8800/api/contrat/${this.contratId}`, postObj, { observe: 'response' })
      : this.http.post('http://127.0.0.1:8800/api/contrat', postObj, { observe: 'response' });

    request$.subscribe((res: any) => {
      if (res.status === 200) {
        this.router.navigateByUrl('/dashboard/contrats');
      } else {
        alert(res.message);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contratForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(field: string): string {
    const control = this.contratForm.get(field);
    if (control) {
      if (control.errors?.['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors?.['pattern']) {
        return 'Le nom doit contenir uniquement des lettres.';
      }
      if (control.errors?.['dateRange']) {
        return 'La date de fin doit être après la date de début.';
      }
    }
    return '';
  }

  dateRangeValidator(control: any): { [key: string]: boolean } | null {
    const form = control.parent;
    if (form) {
      const startDate = form.get('DateDebut')?.value;
      const endDate = control.value;
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return { dateRange: true };
      }
    }
    return null;
  }
}
