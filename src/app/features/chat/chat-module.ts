import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing-module';
import { Chat } from './chat';


@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    Chat // Import standalone component
  ]
})
export class ChatModule { }
