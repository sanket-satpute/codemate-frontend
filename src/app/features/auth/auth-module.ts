import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Auth } from './auth';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    Auth // Import standalone component
  ]
})
export class AuthModule { }
