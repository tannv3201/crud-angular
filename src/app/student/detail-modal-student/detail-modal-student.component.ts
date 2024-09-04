import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpProviderService } from 'src/app/service/http-provider.service';

@Component({
  selector: 'app-detail-modal-student',
  templateUrl: './detail-modal-student.component.html',
  styleUrls: ['./detail-modal-student.component.scss'],
})
export class DetailModalStudentComponent implements OnInit {
  studentForm: FormGroup;
  mode: any;
  classList: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private httpProvider: HttpProviderService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required], // Required validation
      classId: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit() {
    this.studentForm.patchValue(this.config.data?.student);
    this.mode = this.config.data?.mode;
    this.getAllClass();
  }

  async getAllClass() {
    this.httpProvider.getAllClass().subscribe(
      (data: any) => {
        this.classList = data;
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.classList = [];
            }
          }
        }
      }
    );
  }

  handleChangeClass(event: any) {
    this.studentForm.controls['classId'].patchValue(event.value);
  }

  submit() {
    if (this.studentForm.valid) {
      if (this.mode == 'add') {
        const { id, ...dataSubmit } = this.studentForm.value;
        this.httpProvider.createStudent(dataSubmit).subscribe(
          (data: any) => {
            if (data) {
              this.ref.close(this.studentForm.value);
            }
          },
          (error: any) => {
            if (error) {
              console.log(
                '🚀 ~ ViewEmployeeComponent ~ getDetailSchool ~ error:',
                error
              );
            }
          }
        );
      } else if (this.mode == 'edit') {
        this.httpProvider
          .updateStudent(this.config.data?.student?.id, this.studentForm.value)
          .subscribe(
            (data: any) => {
              if (data) {
                this.ref.close(this.studentForm.value);
              }
            },
            (error: any) => {
              if (error) {
                console.log(
                  '🚀 ~ ViewEmployeeComponent ~ getDetailSchool ~ error:',
                  error
                );
              }
            }
          );
      }
      // Pass form value when closing modal
    } else {
      // Handle invalid form case
      console.log('Form is invalid');
      this.studentForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
