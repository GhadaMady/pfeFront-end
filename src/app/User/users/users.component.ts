import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  getJsonValue: any;
  dataSource: any[] = [];


  
  constructor(private http: HttpClient, private router: Router) {
  

  }

  ngOnInit(): void {
    this.getMothod();
  }

  getMothod() {
    this.http.get<any[]>('http://127.0.0.1:8800/api/users').subscribe(data => {
      console.log(data);
      // Filtrer les utilisateurs avec isDeleted === false et activer === true et role === 'user'
      this.getJsonValue = data.filter(user => user.isDeleted === false && user.activer === true && user.role === 'user');
      this.dataSource = this.getJsonValue; // Assigner le résultat filtré à dataSource
    });
  }

  onPut(id: string) {
    this.http.put('http://127.0.0.1:8800/api/users/' + id, { "activer": true }, { observe: 'response' }).subscribe((res: any) => {
      if (res.status === 200) {
        // Rafraîchir la liste des utilisateurs après mise à jour
        this.getMothod();
      } else {
        alert(res.message);
      }
    });
  }

  onPutD(id: string) {
    this.http.put('http://127.0.0.1:8800/api/users/' + id, { "activer": false }, { observe: 'response' }).subscribe((res: any) => {
      if (res.status === 200) {
        // Rafraîchir la liste des utilisateurs après mise à jour
        this.getMothod();
      } else {
        alert(res.message);
      }
    });
  }

  onModify(id: string) {
    // Rediriger vers la même page avec l'ID de l'utilisateur comme paramètre
    this.router.navigate(['/dashboard/users/Modifier', id]);
  }

  onSoftDelete(id: string) {
    this.http.delete('http://127.0.0.1:8800/api/users/' + id, { observe: 'response' })
      .subscribe((res: any) => {
        if (res.status === 200) {
          window.location.reload();
        } else {
          alert(res.message);
        }
      });
  }
  
}



