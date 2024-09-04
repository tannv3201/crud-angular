import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpProviderService } from 'src/app/service/http-provider.service';

@Component({
  selector: 'app-detail-modal-school',
  templateUrl: './detail-modal-school.component.html',
  styleUrls: ['./detail-modal-school.component.scss'],
})
export class DetailModalSchoolComponent implements OnInit {
  schoolForm: FormGroup;
  mode: any;

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private router: Router,
    private httpProvider: HttpProviderService,
    private messageService: MessageService
  ) {
    this.schoolForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit() {
    this.schoolForm.patchValue(this.config.data?.school);
    this.mode = this.config.data?.mode;
  }

  submit() {
    if (this.schoolForm.valid) {
      if (this.mode == 'add') {
        const { id, ...dataSubmit } = this.schoolForm.value;
        this.httpProvider.createSchool(dataSubmit).subscribe(
          (data: any) => {
            if (data) {
              this.ref.close(this.schoolForm.value);
            }
          },
          (error: any) => {
            if (error) {
              console.log(
                '🚀 ~ DetailModalSchoolComponent ~ submit ~ error:',
                error
              );

              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Có lỗi xảy ra khi thêm mới trường học',
              });
            }
          }
        );
      } else if (this.mode == 'edit') {
        this.httpProvider
          .updateSchool(this.config.data?.school?.id, this.schoolForm.value)
          .subscribe(
            (data: any) => {
              if (data) {
                this.ref.close(this.schoolForm.value);
              }
            },
            (error: any) => {
              if (error) {
                console.log(
                  '🚀 ~ DetailModalSchoolComponent ~ submit ~ error:',
                  error
                );
                this.messageService.add({
                  severity: 'error',
                  summary: 'Lỗi',
                  detail: 'Có lỗi xảy ra khi cập nhật trường học',
                });
              }
            }
          );
      }
      // Pass form value when closing modal
    } else {
      // Handle invalid form case
      this.messageService.add({
        severity: 'error',
        summary: 'Thiếu dữ liệu',
        detail: 'Vui lòng nhập đầy đủ thông tin',
      });
      this.schoolForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
