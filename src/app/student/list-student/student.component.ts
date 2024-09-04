import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetailModalStudentComponent } from '../detail-modal-student/detail-modal-student.component';
import { debounceTime, Subject, Subscription } from 'rxjs';

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
  studentList: any[] = [];
  classList: any[] = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  first: number = 0;
  filterName: string = '';
  filterClass: string = '';
  private filterSubject: Subject<void> = new Subject<void>();
  private filterSubscription: Subscription = new Subscription();
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
    this.getAllClass();

    this.filterSubscription = this.filterSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.getStudents(
          this.currentPage,
          this.pageSize,
          this.filterName,
          this.filterClass
        );
      });
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.currentPage = event.page;
    this.getStudents(event.page + 1, event.rows);
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

  changeRowsPerPage(event: any) {
    this.pageSize = event;
    this.getStudents(this.currentPage, event);
  }

  onChangeFilterName(event: any) {
    this.filterName = event;
    this.filterSubject.next();
  }

  onChangeFilterClass(event: any) {
    this.filterClass = event.value;
    this.filterSubject.next();
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

  async getStudents(
    page: number,
    pageSize: number,
    search?: string,
    classId?: string
  ) {
    this.httpProvider
      .getStudents({
        has_class: true,
        page: page,
        pageSize: pageSize,
        ...(search && { search: search }),
        ...(classId && { classId: classId }),
      })
      .subscribe(
        (data: any) => {
          console.log('🚀 ~ StudentComponent ~ data?.results:', data?.results);
          this.studentList = data.results;
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
        classList: this.classList,
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

  confirmDelete(event: Event, studentData: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn có chắc chắn muốn xóa ${studentData?.name}`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy',
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
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }

    if (this.ref) {
      this.ref.close();
    }
  }
}
