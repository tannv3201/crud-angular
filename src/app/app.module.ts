import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SchoolComponent } from './school/list-school/school.component';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DetailModalSchoolComponent } from './school/detail-modal-school/detail-modal-school.component';
import { DialogModule } from 'primeng/dialog';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CommonModule } from '@angular/common';
import { ClassComponent } from './class/list-class/class.component';
import { DetailModalClassComponent } from './class/detail-modal-class/detail-modal-class.component';
import { DropdownModule } from 'primeng/dropdown';
import { DetailModalStudentComponent } from './student/detail-modal-student/detail-modal-student.component';
import { StudentComponent } from './student/list-student/student.component';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StudentsComponent } from './students/students.component';

@NgModule({
  declarations: [
    AppComponent,
    SchoolComponent,
    DetailModalSchoolComponent,
    ClassComponent,
    DetailModalClassComponent,
    DetailModalStudentComponent,
    StudentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    DynamicDialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmPopupModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    PaginatorModule,
    ConfirmDialogModule,
  ],
  providers: [
    DialogService,
    DynamicDialogRef,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
