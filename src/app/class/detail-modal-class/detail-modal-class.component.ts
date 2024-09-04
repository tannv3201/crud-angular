import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpProviderService } from 'src/app/service/http-provider.service';

@Component({
  selector: 'app-detail-modal-class',
  templateUrl: './detail-modal-class.component.html',
  styleUrls: ['./detail-modal-class.component.scss'],
})
export class DetailModalClassComponent implements OnInit {
  classForm: FormGroup;
  mode: any;
  schoolList: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private router: Router,
    private httpProvider: HttpProviderService,
    private messageService: MessageService
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required], // Required validation
      schoolId: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit() {
    this.classForm.patchValue(this.config.data?.class);
    this.mode = this.config.data?.mode;
    this.schoolList = this.config.data?.schoolList;
  }

  handleChangeSchool(event: any) {
    this.classForm.controls['schoolId'].patchValue(event.value);
  }

  submit() {
    if (this.classForm.valid) {
      if (this.mode == 'add') {
        const { id, ...dataSubmit } = this.classForm.value;
        this.httpProvider.createClass(dataSubmit).subscribe(
          (data: any) => {
            if (data) {
              this.ref.close(this.classForm.value);
            }
          },
          (error: any) => {
            if (error) {
              console.log(
                '🚀 ~ DetailModalClassComponent ~ submit ~ error:',
                error
              );
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Có lỗi xảy ra khi thêm mới lớp học',
              });
            }
          }
        );
      } else if (this.mode == 'edit') {
        this.httpProvider
          .updateClass(this.config.data?.class?.id, this.classForm.value)
          .subscribe(
            (data: any) => {
              if (data) {
                this.ref.close(this.classForm.value);
              }
            },
            (error: any) => {
              if (error) {
                console.log(
                  '🚀 ~ DetailModalClassComponent ~ submit ~ error:',
                  error
                );
                this.messageService.add({
                  severity: 'error',
                  summary: 'Lỗi',
                  detail: 'Có lỗi xảy ra khi cập nhật lớp học',
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
      this.classForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
