import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SchoolComponent } from './school/list-school/school.component';
import { DetailSchoolComponent } from './school/detail-school/detail-school.component';
import { AddSchoolComponent } from './school/add-school/add-school.component';
import { EditSchoolComponent } from './school/edit-school/edit-school.component';
import { ClassComponent } from './class/list-class/class.component';
import { DetailClassComponent } from './class/detail-class/detail-class.component';

@NgModule({
  declarations: [
    AppComponent,
    SchoolComponent,
    DetailSchoolComponent,
    AddSchoolComponent,
    EditSchoolComponent,
    ClassComponent,
    DetailClassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
