import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-env-not',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './env-not.component.html',
  styleUrls: ['./env-not.component.css']
})
export class EnvNotComponent implements OnInit {
  
  dataSource: any[] = []; // Utilisez un tableau pour stocker les utilisateurs
  postObj: PostElem; // Objet contenant les informations du formulaire

  constructor(private http: HttpClient, private router: Router) {
    this.postObj = new PostElem(); // Initialisation de l'objet PostElem
  }

  ngOnInit(): void {
    this.getUsers(); // Charger les utilisateurs dès l'initialisation
  }

  // Méthode pour récupérer la liste des utilisateurs via une API
  getUsers() {
    this.http.get('http://127.0.0.1:8800/api/users').subscribe((data: any) => {
      console.log(data);
      this.dataSource = data; // Assigner les données récupérées au tableau dataSource
    });
  }

  // Méthode pour changer l'utilisateur sélectionné
  ChangeUser(event: any) {
    const [subId, user] = event.target.value.split('|'); // Séparer l'ID et le nom d'utilisateur
    console.log(event.target.value);
    this.postObj.userId = subId;
    this.postObj.User = user;
  }

  // Méthode pour envoyer les données à l'API
  onPost() {
    // Vérifier si tous les champs requis sont remplis
    if (!this.postObj.title || !this.postObj.message || !this.postObj.userId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Envoyer la notification à l'API
    this.http.post('http://127.0.0.1:8800/api/notification', this.postObj, { observe: 'response' })
      .subscribe((res: any) => {
        if (res.status === 200) {
          // Si la notification est sauvegardée, on l'envoie
          this.http.post('http://127.0.0.1:8800/api/notification/send-notification', this.postObj, { observe: 'response' })
            .subscribe((sendRes: any) => {
              if (sendRes.status === 200) {
                alert('Notification sauvegardée et envoyée avec succès');
                this.router.navigateByUrl('/dashboard/notification'); // Redirection après succès
              } else {
                alert('Échec de l\'envoi de la notification: ' + sendRes.message);
              }
            });
        } else {
          alert('Échec de la sauvegarde: ' + res.message);
        }
      });
  }
}

// Classe représentant les objets de notification
export class PostElem {
  title: string;
  message: string;
  userId: string;
  User: string;
  Date: string;

  constructor() {
    this.title = '';
    this.message = '';
    this.userId = '';
    this.User = '';
    this.Date = this.getCurrentFormattedDate(); // Initialiser la date
  }

  // Méthode pour obtenir la date actuelle formatée
  private getCurrentFormattedDate(): string {
    const now = new Date();
    const day = this.padZero(now.getDate());
    const month = this.padZero(now.getMonth() + 1); // Les mois commencent à 0
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Ajouter un zéro devant les nombres inférieurs à 10
  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
