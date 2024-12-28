import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajout-produit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent implements OnInit {
  produitForm: FormGroup;
  postObj: PostElem = new PostElem();
  isEditMode = false;
  produitId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.produitForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      desc: ['', [Validators.required, Validators.minLength(10)]],
      Prix: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.produitId = params['id'];
        if (this.produitId) {
          this.loadProduit(this.produitId);
        }
      }
    });
  }

  loadProduit(id: string): void {
    this.http.get<any>('http://127.0.0.1:8800/api/produit/' + id).subscribe(
      (data) => {
        this.produitForm.patchValue(data);
      },
      (error) => {
        console.error('Erreur lors du chargement du produit : ', error);
      }
    );
  }

  saveProduit(): void {
    if (this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
      return;
    }

    this.postObj = this.produitForm.value;

    const request = this.isEditMode && this.produitId
      ? this.http.put('http://127.0.0.1:8800/api/produit/' + this.produitId, this.postObj, { observe: 'response' })
      : this.http.post('http://127.0.0.1:8800/api/produit', this.postObj, { observe: 'response' });

    request.subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.router.navigateByUrl('/dashboard/produits');
        } else {
          alert(res.message);
        }
      },
      (error) => {
        alert('Une erreur est survenue lors de l\'enregistrement du produit.');
      }
    );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.produitForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.produitForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors['minlength']) {
        return `Ce champ doit avoir au moins ${control.errors['minlength'].requiredLength} caractères.`;
      }
      if (control.errors['pattern']) {
        return 'Le format est invalide.';
      }
      if (control.errors['min']) {
        return `La valeur doit être supérieure à ${control.errors['min'].min}.`;
      }
    }
    return '';
  }
}

export class PostElem {
  nom: string = '';
  desc: string = '';
  Prix: number = 0;
}
