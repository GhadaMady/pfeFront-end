import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './User/users/users.component';
import { AjoutAgenceComponent } from './Agence/ajout-agence/ajout-agence.component';
import { ListeActualitesComponent } from './actualites/liste-actualites/liste-actualites.component';
import { AjoutActualitesComponent } from './actualites/ajout-actualites/ajout-actualites.component';
import { DemandeUsersComponent } from './demande-users/demande-users.component';
import { AjoutUsersComponent } from './User/ajout-users/ajout-users.component';
import { ListeProduitComponent } from './Produit/liste-produit/liste-produit.component';
import { AjoutProduitComponent } from './Produit/ajout-produit/ajout-produit.component';
import { SinistreComponent } from './sinistre/sinistre.component';

import { AjoutSinistreComponent } from './sinistre/ajout-sinistre/ajout-sinistre.component';
import { ListeAgencesComponent } from './Agence/liste-agences/liste-agences.component';
import { ContratComponent } from './contrat/contrat/contrat.component';
import { AjoutContratComponent } from './contrat/ajout-contrat/ajout-contrat.component';
import { HomeComponent } from './home/home.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { NotificationComponent } from './notification/notification.component';
import { PaimentComponent } from './paiment/paiment.component';
import { EnvNotComponent } from './notification/env-not/env-not.component';
import { AjoutReclamationComponent } from './reclamation/ajouter-reclamation/ajouter-reclamation.component';
import { AjouterPaimentComponent } from './paiment/ajouter-paiment/ajouter-paiment.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, 
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
      {path:'home', component: HomeComponent},
      {path:'demande_users', component: DemandeUsersComponent},
      {path:'users', component: UsersComponent},
      {path:'users/ajouter', component: AjoutUsersComponent},
    {path: 'users/Modifier/:id', component: AjoutUsersComponent },
      {path:'agences', component: ListeAgencesComponent},
      {path:'agences/ajouter', component: AjoutAgenceComponent},
      {path: 'agences/Modifier/:id', component: AjoutAgenceComponent },
      {path:'actualites', component: ListeActualitesComponent},
      {path:'actualites/ajouter', component: AjoutActualitesComponent},
      {path: 'actualites/Modifier/:id', component: AjoutActualitesComponent },
      {path:'produits', component: ListeProduitComponent},
      {path:'produits/ajouter', component: AjoutProduitComponent},
      {path: 'produits/Modifier/:id', component: AjoutProduitComponent },
      {path: 'sinistres' , component: SinistreComponent},
      {path:'sinistres/déclarer', component: AjoutSinistreComponent},
      {path: 'sinistres/Modifier/:id', component: AjoutSinistreComponent },
      {path: 'contrats' , component: ContratComponent},
      {path:'contrats/ajouter', component: AjoutContratComponent},
      {path: 'contrats/Modifier/:id', component: AjoutContratComponent },
      {path: 'paiments' , component: PaimentComponent},
      {path:'paiments/ajouter', component: AjouterPaimentComponent},
      {path: 'paiments/Modifier/:id', component:  AjouterPaimentComponent},
   {path: 'reclamations', component: ReclamationComponent },
   {path:'reclamations/ajouter', component: AjoutReclamationComponent},
   {path: 'reclamations/Modifier/:id', component: AjoutReclamationComponent },
       {path: 'notification', component: NotificationComponent }, 
       {path: 'notification/envoyer', component: EnvNotComponent },  

   
    ] },
];
