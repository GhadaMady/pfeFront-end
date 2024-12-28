import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajout-agence',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './ajout-agence.component.html',
  styleUrls: ['./ajout-agence.component.css']
})
export class AjoutAgenceComponent implements OnInit {
  agenceForm: FormGroup;
  postObj: PostElem = new PostElem();
  isEditMode = false;
  agenceId: string | null = null;

  Gouvernorat: string[] = [ 
    'Tunis', 'Ariana', 'Ben Arous', 'La Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 'Jendouba',
    'Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
  ];
  
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { 
    this.agenceForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],  // Nom de l'agence
      Gouvernorat: ['', Validators.required],  // Gouvernorat obligatoire
      adresse: ['', [Validators.required, Validators.minLength(5)]],  // Adresse
      tel: ['+216', [Validators.required, Validators.pattern('^\\+216[0-9]{8}$')]],  // Téléphone fixe
      portable: ['+216', [Validators.required, Validators.pattern('^\\+216[0-9]{8}$')]],  // Portable
      fax: ['+216', [Validators.required, Validators.pattern('^\\+216[0-9]{8}$')]],  // Fax
      latitude: ['', [Validators.required, Validators.pattern('^(-?\\d+(\\.\\d+)?).*$')]],  // Latitude (décimale)
      longitude: ['', [Validators.required, Validators.pattern('^(-?\\d+(\\.\\d+)?).*$')]]  // Longitude (décimale)
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.agenceId = params['id'];
        if (this.agenceId) {
          this.loadAgence(this.agenceId);
        }
      }
    });
  }

  loadAgence(id: string): void {
    this.http.get<any>('http://127.0.0.1:8800/api/agence/' + id).subscribe(
      (data) => {
        this.agenceForm.patchValue(data);
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'agence : ', error);
      }
    );
  }

  saveAgency(): void {
    if (this.agenceForm.invalid) {
      this.agenceForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.postObj = this.agenceForm.value;

    if (this.isEditMode && this.agenceId) {
      this.http.put('http://127.0.0.1:8800/api/agence/' + this.agenceId, this.postObj, { observe: 'response' })
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.router.navigateByUrl('/dashboard/agences');
          } else {
            alert(res.message);
          }
        });
    } else {
      this.http.post('http://127.0.0.1:8800/api/agence', this.postObj, { observe: 'response' })
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.router.navigateByUrl('/dashboard/agences');
          } else {
            alert(res.message);
          }
        });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.agenceForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.agenceForm.get(field);
    if (control?.errors?.['required']) {
      return 'Ce champ est requis.';
    } else if (control?.errors?.['minlength']) {
      return `Ce champ doit avoir au moins ${control.errors['minlength'].requiredLength} caractères.`;
    } else if (control?.errors?.['pattern']) {
      if (field === 'tel' || field === 'portable' || field === 'fax') {
        return 'Le numéro doit commencer par +216 et contenir 8 chiffres.';
      }
      return 'Format invalide.';
    }
    return '';
  }
}

export class PostElem {
  nom: string = '';
  Gouvernorat: string = '';
  adresse: string = '';
  tel: string = '+216';
  portable: string = '+216';
  fax: string = '+216';
  latitude: string = '';
  longitude: string = '';
}
