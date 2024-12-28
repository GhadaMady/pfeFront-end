import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contrat',
  standalone: true,
  imports: [FormsModule , CommonModule, HttpClientModule],
  templateUrl: './contrat.component.html',
  styleUrl: './contrat.component.css'
})
export class ContratComponent {
  getJsonValue:any;
  dataSource :any=[];
  
 ngOnInit(): void {   
   this.getMothod();
 }
  getMothod(){
this.http.get('http://127.0.0.1:8800/api/contrat').subscribe((data)=>{
 console.log(data);
 this.getJsonValue= data;
 this.dataSource=data;
})
 }

 onPut(id: string) {
  this.http.put(`http://127.0.0.1:8800/api/contrat/${id}`, { Etat: 'Valider' }).subscribe(res => {
    console.log(res);
    window.location.reload();
  }, error => {
    console.error('Erreur lors de la validation du contrat :', error);
    alert('Erreur lors de la validation du contrat.');
  });
}

onPutR(id: string) {
  this.http.put(`http://127.0.0.1:8800/api/contrat/${id}`, { Etat: 'Réglement' }).subscribe(res => {
    console.log(res);
    window.location.reload(); 
  }, error => {
    console.error('Erreur lors de la reglement du contrat :', error);
    alert('Erreur lors de la reglement du contrat.');
  });
}

onPutC(id: string) {
  this.http.put(`http://127.0.0.1:8800/api/contrat/${id}`, { Etat: 'En cours' }).subscribe(res => {
    console.log(res);
    window.location.reload(); 
  }, error => {
    console.error('Erreur lors de la mettre en cours du contrat :', error);
    alert('Erreur lors de la mettre en cours du contrat.');
  });
}
onPutRef(id: string){
  
  this.http.put('http://127.0.0.1:8800/api/contrat/'+id,{"Etat":"Reffuser"},{ observe: 'response' }).subscribe((res:any)=>{
    if(res.status===200){
      window.location.reload();
    }else{
      alert(res.message)
      
  
    }
  })
  }
 
  onDelete(id: string): void {
    const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?');
  
    if (isConfirmed) {
      this.http.delete(`http://127.0.0.1:8800/api/contrat/${id}`, { observe: 'response' }).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.dataSource = this.dataSource.filter((item: any) => item._id !== id);
          } else {
            alert('Erreur de suppression : ' + res.message || 'Une erreur est survenue');
          }
        },
        error => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression');
        }
      );
    }
  }

  onModify(id: string) {
    this.router.navigate(['/dashboard/contrats', 'Modifier', id]);
  }
 

  constructor(private http:HttpClient , private router : Router) {


  }
 
}

