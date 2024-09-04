import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DetailModalSchoolComponent } from '../detail-modal-school/detail-modal-school.component';
import { ConfirmationService, MessageService } from 'primeng/api';

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

  async getSchools(page: number, pageSize: number) {
    this.httpProvider.getSchools({ page: page, pageSize: pageSize }).subscribe(
      (data: any) => {
        this.schoolList = data.results;
        this.totalRecords = data.totalRecords;
        this.pageSize = data.pageSize;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
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

        // this.getAllSchool();
        this.getSchools(this.currentPage, this.pageSize);
      }
    });
  }

  confirm(event: Event, school: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: `Bạn có chắc chắn muốn xóa ${school?.name}`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSchool(school?.id);
      },
      reject: () => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Rejected',
        //   detail: 'You have rejected',
        // });
      },
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

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
