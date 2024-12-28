import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ajout-actualites',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './ajout-actualites.component.html',
  styleUrls: ['./ajout-actualites.component.css']
})
export class AjoutActualitesComponent implements OnInit {
  actualiteForm: FormGroup;
  isEditMode = false;
  actualiteId: string | null = null;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.actualiteForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9 .,:;\'"@!%&()*+-/=?_éèàêçù]+$')]],
      desc: ['', [Validators.required, Validators.maxLength(300), Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9 .,:;\'"@!%&()*+-/=?_éèàêçù]+$')]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.actualiteId = params['id'];
        if (this.actualiteId) {
          this.loadActualite(this.actualiteId);
        }
      }
    });
  }

  // Load existing news (for edit mode)
  loadActualite(id: string): void {
    this.http.get<any>(`http://127.0.0.1:8800/api/actualite/${id}`).subscribe(
      (data) => {
        this.actualiteForm.patchValue(data);
      },
      (error) => {
        this.errorMessage = error.message ? error.message : 'Une erreur inconnue est survenue lors du chargement.';
      }
    );
  }

  // Save or update actualite
  saveActualite(): void {
    if (this.actualiteForm.invalid) {
      return;
    }

    const actualiteData = {
      ...this.actualiteForm.value,
      datePub: new Date(this.actualiteForm.value.date).toISOString().split('T')[0]
    };

    const request = this.isEditMode && this.actualiteId
      ? this.http.put(`http://127.0.0.1:8800/api/actualite/${this.actualiteId}`, actualiteData, { observe: 'response' })
      : this.http.post('http://127.0.0.1:8800/api/actualite', actualiteData, { observe: 'response' });

    request.subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.router.navigateByUrl('/dashboard/actualites');
        } else {
          alert(res.message);
        }
      },
      (error) => {
        this.errorMessage = 'Une erreur est survenue lors de l\'enregistrement de l\'actualité.';
      }
    );
  }

  // Validation Helpers
  isFieldInvalid(field: string): boolean {
    const control = this.actualiteForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.actualiteForm.get(field);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors['minlength']) {
        return `Le champ doit comporter au moins ${control.errors['minlength'].requiredLength} caractères.`;
      }
      if (control.errors['pattern']) {
        return 'Le format est invalide.';
      }
      if (control.errors['maxlength']) {
        return `Le champ ne doit pas dépasser ${control.errors['maxlength'].requiredLength} caractères.`;
      }
    }
    return '';
  }
  
}
