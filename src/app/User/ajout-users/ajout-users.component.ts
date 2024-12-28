import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajout-users',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './ajout-users.component.html',
  styleUrls: ['./ajout-users.component.css']
})
export class AjoutUsersComponent implements OnInit {
  userForm: FormGroup;
  postObj: PostUser = new PostUser();
  isEditMode = false;
  userId: string | null = null;

  regions: string[] = [
    'Tunis', 'Ariana', 'Ben Arous', 'La Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 'Jendouba',
    'Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      userLastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]+$')]],
      region: ['', Validators.required],
      genre: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'];
        if (this.userId) {
          this.loadUser(this.userId);
        }
      }
    });
  }

  loadUser(id: string): void {
    this.http.get<any>('http://127.0.0.1:8800/api/users/' + id).subscribe(
      (data) => {
        this.userForm.patchValue(data);
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur : ', error);
      }
    );
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.postObj = this.userForm.value;
    this.postObj.activer = true;

    const request = this.isEditMode && this.userId
      ? this.http.put('http://127.0.0.1:8800/api/users/' + this.userId, this.postObj, { observe: 'response' })
      : this.http.post('http://127.0.0.1:8800/api/users', this.postObj, { observe: 'response' });

    request.subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 201) {
          this.router.navigateByUrl('/dashboard/users');
        } else {
          alert(res.message);
        }
      },
      (error) => {
        if (error.error?.message?.includes('duplicate key error')) {
          alert('L\'email est déjà utilisé.');
        } else {
          alert('Erreur lors de l\'enregistrement de l\'utilisateur.');
        }
      }
    );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis.';
      }
      if (control.errors['minlength']) {
        return `Ce champ doit avoir au moins ${control.errors['minlength'].requiredLength} caractères.`;
      }
      if (control.errors['maxlength']) {
        return `Ce champ doit avoir au maximum ${control.errors['maxlength'].requiredLength} caractères.`;
      }
      if (control.errors['pattern']) {
        return 'Le format est invalide.';
      }
      if (control.errors['email']) {
        return 'L\'email n\'est pas valide.';
      }
    }
    return '';
  }
}

export class PostUser {
  username: string = '';
  userLastname: string = '';
  email: string = '';
  tel: string = '';
  region: string = '';
  genre: string = '';
  password: string = '';
  activer = true;
}
