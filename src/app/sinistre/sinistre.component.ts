
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sinistre',
  standalone: true,
  imports: [FormsModule , CommonModule, HttpClientModule],
  templateUrl: './sinistre.component.html',
  styleUrl: './sinistre.component.css'
})
export class SinistreComponent {
  getJsonValue:any;
  dataSource :any=[];

 ngOnInit(): void {   
   this.getMothod();

 }
  getMothod(){
this.http.get('http://127.0.0.1:8800/api/sinistre').subscribe((data)=>{
 console.log(data);
 this.getJsonValue= data;
 this.dataSource=data;
})
 }



 onPut(id: string){
  
  this.http.put('http://127.0.0.1:8800/api/sinistre/'+id,{"Etat":"valide"},{ observe: 'response' }).subscribe((res:any)=>{
    if(res.status===200){
      window.location.reload();
    }else{
      alert(res.message)
      
  
    }
  })
  }
  onPutR(id: string){
  
    this.http.put('http://127.0.0.1:8800/api/sinistre/'+id,{"Etat":"Réglement"},{ observe: 'response' }).subscribe((res:any)=>{
      if(res.status===200){
        window.location.reload();
      }else{
        alert(res.message)
        
    
      }
    })
    }
    onPutRef(id: string){
  
      this.http.put('http://127.0.0.1:8800/api/sinistre/'+id,{"Etat":"Reffuser"},{ observe: 'response' }).subscribe((res:any)=>{
        if(res.status===200){
          window.location.reload();
        }else{
          alert(res.message)
          
      
        }
      })
      }

      onPutC(id: string){
  
        this.http.put('http://127.0.0.1:8800/api/sinistre/'+id,{"Etat":"En cours"},{ observe: 'response' }).subscribe((res:any)=>{
          if(res.status===200){
            window.location.reload();
          }else{
            alert(res.message)
            
        
          }
        })
        }
        onDelete(id: string): void {
          // Afficher la boîte de confirmation
          const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer ce sinistre ?');
        
          // Si l'utilisateur confirme la suppression, procéder à la demande de suppression
          if (isConfirmed) {
            this.http.delete(`http://127.0.0.1:8800/api/sinistre/${id}`, { observe: 'response' }).subscribe(
              (res: any) => {
                if (res.status === 200) {
                  // Filtrer le sinistre supprimé localement
                  this.dataSource = this.dataSource.filter((item: any) => item._id !== id);
                } else {
                  alert('Erreur de suppression');
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
          this.router.navigate(['/dashboard/sinistres', 'Modifier', id]);
        }
       
      
        constructor(private http:HttpClient , private router : Router) {
      
      
        }
       


 }


