import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetailModalClassComponent } from '../detail-modal-class/detail-modal-class.component';
import { debounceTime, Subject, Subscription } from 'rxjs';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  @ViewChild(DetailModalClassComponent)
  detailModalClassComponent!: DetailModalClassComponent;
  closeResult = '';
  classList: any = [];
  schoolList: any = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  first: number = 0;
  filterName: string = '';
  filterSchool: any[] = [];
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
    this.getClasses(this.currentPage + 1, this.pageSize);
    this.getAllSchool();

    this.filterSubscription = this.filterSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.getClasses(
          this.currentPage,
          this.pageSize,
          this.filterName,
          this.filterSchool
        );
      });
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.currentPage = event.page;
    this.onFilter(
      this.currentPage + 1,
      this.pageSize,
      this.filterName,
      this.filterSchool
    );
  }

  changeRowsPerPage(event: any) {
    this.pageSize = event;
    this.onFilter(
      this.currentPage,
      this.pageSize,
      this.filterName,
      this.filterSchool
    );
  }

  onFilter(
    page?: number,
    pageSize?: number,
    search?: string,
    selected_schools?: any[],
    type?: string
  ) {
    console.log('🚀 ~ ClassComponent ~ selected_schools:', selected_schools);
    if (type === 'filter') {
      this.currentPage =
        (!!search || (selected_schools || []).length > 0 ? page : 1) || 1;
      this.first =
        (!search || (selected_schools || []).length === 0 ? 0 : this.first) ||
        0;
    } else {
      this.currentPage = page || 1;
    }
    this.pageSize = pageSize || 5;
    this.filterName = search || '';
    this.filterSchool = selected_schools || [];

    this.filterSubject.next();
  }

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  async getClasses(
    page: number,
    pageSize: number,
    search?: string,
    selected_schools?: any[]
  ) {
    this.httpProvider
      .getClasses({
        has_school: true,
        page: page,
        pageSize: pageSize,
        ...(search && { search: search }),
        ...((selected_schools || []).length > 0 && {
          school_id: selected_schools
            ?.map((school: any) => school.id)
            .join(','),
        }),
      })
      .subscribe(
        (data: any) => {
          this.classList = data?.results;
          this.totalRecords = data.totalRecords;
          this.pageSize = data.pageSize;
          this.currentPage = data.currentPage;
          this.totalPages = data.totalPages;
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Có lỗi xảy ra khi GET danh sách lớp',
          });
        }
      );
  }

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

  openClassDetailModal(classData: any, mode: any) {
    const _title =
      mode == 'view'
        ? 'Chi tiết lớp học'
        : mode == 'edit'
        ? 'Cập nhật lớp học'
        : mode == 'add'
        ? 'Thêm lớp học'
        : '';
    this.ref = this.dialogService.open(DetailModalClassComponent, {
      header: _title,
      width: '60%',
      height: '60%',
      contentStyle: { overflow: 'auto', height: '100%' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        class: classData,
        mode: mode,
        schoolList: this.schoolList,
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (mode === 'add') {
          this.messageService.add({
            severity: 'success',
            summary: 'Thêm mới lớp',
            detail: 'Thêm mới thành công',
          });
        } else if (mode === 'edit') {
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật lớp',
            detail: 'Cập nhật thành công',
          });
        }

        this.getClasses(this.currentPage, this.pageSize);
      }
    });
  }

  confirmDelete(event: Event, classData: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn có chắc chắn muốn xóa ${classData?.name}`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy',
      accept: () => {
        this.deleteClass(classData?.id);
      },
      reject: () => {},
    });
  }

  deleteClass(classroom_id: any) {
    this.httpProvider.deleteClass(classroom_id).subscribe(
      (data: any) => {
        this.getClasses(this.currentPage, this.pageSize);
        this.messageService.add({
          severity: 'info',
          summary: 'Xóa lớp',
          detail: 'Bạn đã xóa thành công',
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Có lỗi xảy ra khi xóa lớp',
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
