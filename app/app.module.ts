import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent }  from './app.component';
import { ToDoListComponent }  from './todo-list.component';
import { ToDoRepositoryService }  from './todo-repository.service';
import { GuidGeneratorService }  from './guid-generator.service';

@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule,
    HttpModule
   ],
  declarations: [ 
    AppComponent,
    ToDoListComponent
  ],
  providers: [
    ToDoRepositoryService,
    GuidGeneratorService
  ],
  bootstrap: [ 
    AppComponent 
  ]
})
export class AppModule { }