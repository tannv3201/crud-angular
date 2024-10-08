import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  classListProp: any[] = [];
  schoolList: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private httpProvider: HttpProviderService,
    private messageService: MessageService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required], // Required validation
      classroom_id: ['', Validators.required],
      school_id: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit() {
    this.studentForm.patchValue(this.config.data?.student);
    this.mode = this.config.data?.mode;
    this.classListProp = this.config.data?.classList;
    this.schoolList = this.config.data?.schoolList;

    if (this.mode == 'edit' || this.mode == 'view') {
      this.classList = this.classListProp.filter(
        (item) => item.school_id == this.studentForm.value?.school_id
      );
    }
  }

  handleChangeDropdown(event: any, field: string) {
    this.studentForm.controls[field].patchValue(event.value);
    if (field === 'school_id') {
      this.classList = this.classListProp.filter(
        (item) => item.school_id == event.value
      );
      this.studentForm.controls['classroom_id'].patchValue('');
    }
    console.log('aaaa', this.studentForm.value);
  }

  submit() {
    if (this.studentForm.valid) {
      if (this.mode == 'add') {
        const { id, school_id, ...dataSubmit } = this.studentForm.value;
        this.httpProvider.createStudent(dataSubmit).subscribe(
          (data: any) => {
            if (data) {
              this.ref.close(this.studentForm.value);
            }
          },
          (error: any) => {
            if (error) {
              console.log(
                '🚀 ~ DetailModalStudentComponent ~ submit ~ error:',
                error
              );
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Có lỗi xảy ra khi thêm mới học sinh',
              });
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
                  '🚀 ~ DetailModalStudentComponent ~ submit ~ error:',
                  error
                );
                this.messageService.add({
                  severity: 'error',
                  summary: 'Lỗi',
                  detail: 'Có lỗi xảy ra khi cập nhật học sinh',
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
      this.studentForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
