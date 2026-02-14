import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login'; // Import the LoginComponent

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Add other auth-related routes here (e.g., register, profile)
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
