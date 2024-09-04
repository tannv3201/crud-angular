import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetailModalStudentComponent } from '../detail-modal-student/detail-modal-student.component';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  @ViewChild(DetailModalStudentComponent)
  detailModalClassComponent!: DetailModalStudentComponent;
  closeResult = '';
  studentList: any = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  first: number = 0;
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private modalService: NgbModal,
    private httpProvider: HttpProviderService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ref?: DynamicDialogRef;

  ngOnInit(): void {
    this.getStudents(this.currentPage + 1, this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.currentPage = event.page;
    this.getStudents(event.page + 1, event.rows);
  }

  changeRowsPerPage(event: any) {
    this.pageSize = event;
    this.getStudents(this.currentPage, event);
  }

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  async getAllStudent() {
    this.httpProvider.getAllStudent({ has_class: true }).subscribe(
      (data: any) => {
        this.studentList = data;
      },
      (error: any) => {
        if (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Có lỗi xảy ra khi GET danh sách học sinh',
          });
        }
      }
    );
  }

  async getStudents(page: number, pageSize: number) {
    this.httpProvider
      .getStudents({ has_class: true, page: page, pageSize: pageSize })
      .subscribe(
        (data: any) => {
          this.studentList = data?.results;
          this.totalRecords = data.totalRecords;
          this.pageSize = data.pageSize;
          this.currentPage = data.currentPage;
          this.totalPages = data.totalPages;
        },
        (error: any) => {
          if (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Có lỗi xảy ra khi GET danh sách học sinh',
            });
          }
        }
      );
  }

  openStudentDetailModal(studentData: any, mode: any) {
    const _title =
      mode == 'view'
        ? 'Chi tiết học sinh'
        : mode == 'edit'
        ? 'Cập nhật học sinh'
        : mode == 'add'
        ? 'Thêm học sinh'
        : '';
    this.ref = this.dialogService.open(DetailModalStudentComponent, {
      header: _title,
      width: '60%',
      height: '60%',
      contentStyle: { overflow: 'auto', height: '100%' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        student: studentData,
        mode: mode,
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (mode === 'add') {
          this.messageService.add({
            severity: 'success',
            summary: 'Thêm mới học sinh',
            detail: 'Thêm mới thành công',
          });
        } else if (mode === 'edit') {
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật học sinh',
            detail: 'Cập nhật thành công',
          });
        }

        this.getStudents(this.currentPage, this.pageSize);
      }
    });
  }

  confirm(event: Event, studentData: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: `Bạn có chắc chắn muốn xóa ${studentData?.name}`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStudent(studentData?.id);
      },
      reject: () => {},
    });
  }

  deleteStudent(studentId: any) {
    this.httpProvider.deleteStudent(studentId).subscribe(
      (data: any) => {
        this.getStudents(this.currentPage, this.pageSize);
        this.messageService.add({
          severity: 'info',
          summary: 'Xóa học sinh',
          detail: 'Bạn đã xóa thành công',
        });
      },
      (error: any) => {
        console.log('🚀 ~ StudentComponent ~ deleteStudent ~ error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Có lỗi xảy ra khi xóa học sinh',
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
