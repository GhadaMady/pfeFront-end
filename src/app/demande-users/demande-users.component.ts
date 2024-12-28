import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demande-users',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './demande-users.component.html',
  styleUrls: ['./demande-users.component.css'],
})
export class DemandeUsersComponent {
  getJsonValue: any;
  dataSource: any[] = [];
  postObj: PostElem;

  constructor(private http: HttpClient, private router: Router) {
    this.postObj = new PostElem();
  }

  ngOnInit(): void {
    this.getMothod();
  }

  getMothod() {
    this.http.get<any[]>('http://127.0.0.1:8800/api/users').subscribe((data) => {
      console.log(data);
      this.getJsonValue = data.filter(
        (user) => user.activer === false && user.role === 'user'
      );
      this.dataSource = this.getJsonValue;
    });
  }

  onPutRejet(id: string, idSub: string) {
    this.http
      .put(
        'http://127.0.0.1:8800/api/users/' + id,
        { activer: false },
        { observe: 'response' }
      )
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.postObj.userId = idSub;
          this.postObj.user = id;
          this.postObj.message = 'Bonjour, nous sommes désolés, mais votre inscription à DAE Assurance na pas été acceptée. Veuillez vérifier vos informations et réessayer. Si le problème persiste, contactez notre support pour obtenir de laide.';
          this.postObj.title = 'Inscription Non Acceptée ❌';
          this.onPost();
          this.onHardDelete(id);
        } else {
          alert(res.message);
        }
      });
  }

  onPutAccepte(id: string, idSub: string) {
    this.http
      .put(
        'http://127.0.0.1:8800/api/users/' + id,
        { activer: true },
        { observe: 'response' }
      )
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.postObj.userId = idSub;
          this.postObj.user = id;
          this.postObj.message = 'Bonjour, votre inscription à DAE Assurance est confirmée. Vous pouvez maintenant vous connecter pour accéder à toutes les fonctionnalités de lapplication !';
          this.postObj.title = 'Inscription Acceptée ! 🎉';
          this.onPost();
        } else {
          alert(res.message);
        }
      });
  }

  onPost() {
    this.http
      .post(
        'http://127.0.0.1:8800/api/notification/send-notification',
        this.postObj,
        { observe: 'response' }
      )
      .subscribe((res: any) => {
        if (res.status === 200) {
          alert('notification envoyée');
        } else {
          alert(res.message);
        }
      });
  }

  onHardDelete(id: string) {
    console.log('Tentative de suppression de l\'utilisateur avec ID:', id);
  
    this.http.delete('http://127.0.0.1:8800/api/users/' + id, { observe: 'response' })
      .subscribe({
        next: (res: any) => {
          console.log('Réponse de la suppression:', res);
          if (res.status === 200) {
            console.log('Utilisateur supprimé avec succès.');
            window.location.reload(); // Recharger la page après la suppression
          } else {
            console.error('Erreur lors de la suppression:', res);
            alert('Erreur lors de la suppression de l\'utilisateur.');
          }
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Une erreur est survenue lors de la suppression de l\'utilisateur.');
        }
      });
  }
  
}

export class PostElem {
  title: string;
  message: string;
  userId: string;
  user: string;
  date: string;

  constructor() {
    this.title = '';
    this.message = '';
    this.userId = '';
    this.user = '';
    this.date = this.getCurrentFormattedDate();
  }

  private getCurrentFormattedDate(): string {
    const now = new Date();
    const day = this.padZero(now.getDate());
    const month = this.padZero(now.getMonth() + 1);
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
