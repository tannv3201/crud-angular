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
import { DetailSchoolComponent } from './school/detail-school/detail-school.component';
import { AddSchoolComponent } from './school/add-school/add-school.component';
import { EditSchoolComponent } from './school/edit-school/edit-school.component';
import { ClassComponent } from './class/list-class/class.component';
import { DetailClassComponent } from './class/detail-class/detail-class.component';
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

@NgModule({
  declarations: [
    AppComponent,
    SchoolComponent,
    DetailSchoolComponent,
    AddSchoolComponent,
    EditSchoolComponent,
    ClassComponent,
    DetailClassComponent,
    DetailModalSchoolComponent,
    DetailModalSchoolComponent,
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
