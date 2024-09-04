import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetailModalClassComponent } from '../detail-modal-class/detail-modal-class.component';

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
    this.getClasses(this.currentPage + 1, this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.currentPage = event.page;
    this.getClasses(event.page + 1, event.rows);
  }

  changeRowsPerPage(event: any) {
    this.pageSize = event;
    this.getClasses(this.currentPage, event);
  }

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  async getClasses(page: number, pageSize: number) {
    this.httpProvider
      .getClasses({ has_school: true, page: page, pageSize: pageSize })
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

  confirm(event: Event, classData: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: `Bạn có chắc chắn muốn xóa ${classData?.name}`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteClass(classData?.id);
      },
      reject: () => {},
    });
  }

  deleteClass(classId: any) {
    this.httpProvider.deleteClass(classId).subscribe(
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
    if (this.ref) {
      this.ref.close();
    }
  }
}
