import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DetailModalSchoolComponent } from '../detail-modal-school/detail-modal-school.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, Subject, Subscription } from 'rxjs';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
})
export class SchoolComponent implements OnInit {
  @ViewChild(DetailModalSchoolComponent)
  detailModalSchoolComponent!: DetailModalSchoolComponent;
  closeResult = '';
  schoolList: any = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  first: number = 0;
  filterName: string = '';
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
    this.getSchools(this.currentPage + 1, this.pageSize);

    this.filterSubscription = this.filterSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.getSchools(this.currentPage, this.pageSize, this.filterName);
      });
  }

  onChangeFilterName(event: any) {
    this.filterName = event;
    this.filterSubject.next();
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.currentPage = event.page;
    this.getSchools(event.page + 1, event.rows);
  }

  changeRowsPerPage(event: any) {
    this.pageSize = event;
    this.getSchools(this.currentPage, event);
  }

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  async getAllSchool() {
    this.httpProvider.getAllSchool().subscribe(
      (data: any) => {
        this.schoolList = data;
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.schoolList = [];
            }
          }
        }
      }
    );
  }

  async getSchools(page: number, pageSize: number, search?: string) {
    this.httpProvider
      .getSchools({
        page: page,
        pageSize: pageSize,
        ...(search && { search: search }),
      })
      .subscribe(
        (data: any) => {
          this.schoolList = data.results;
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
              detail: 'Có lỗi xảy ra khi GET danh sách trường học',
            });
          }
        }
      );
  }

  openSchoolDetailModal(school: any, mode: any) {
    const _title =
      mode == 'view'
        ? 'Chi tiết trường học'
        : mode == 'edit'
        ? 'Cập nhật trường học'
        : mode == 'add'
        ? 'Thêm trường học'
        : '';
    this.ref = this.dialogService.open(DetailModalSchoolComponent, {
      header: _title,
      width: '60%',
      height: '60%',
      contentStyle: { overflow: 'auto', height: '100%' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        school: school,
        mode: mode,
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (mode === 'add') {
          this.messageService.add({
            severity: 'success',
            summary: 'Thêm mới trường',
            detail: 'Thêm mới thành công',
          });
        } else if (mode === 'edit') {
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật trường',
            detail: 'Cập nhật thành công',
          });
        }

        this.getSchools(this.currentPage, this.pageSize);
      }
    });
  }

  confirmDelete(event: Event, schoolData: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn có chắc chắn muốn xóa ${schoolData?.name}`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy',

      accept: () => {
        this.deleteSchool(schoolData?.id);
      },
      reject: () => {},
    });
  }

  deleteSchool(schoolId: any) {
    this.httpProvider.deleteSchool(schoolId).subscribe(
      (data: any) => {
        this.getSchools(this.currentPage, this.pageSize);
        this.messageService.add({
          severity: 'info',
          summary: 'Xóa trường',
          detail: 'Bạn đã xóa thành công',
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Có lỗi xảy ra khi xóa trường học',
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
