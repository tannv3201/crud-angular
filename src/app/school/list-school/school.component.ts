import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../../service/http-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DetailModalSchoolComponent } from '../detail-modal-school/detail-modal-school.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'ng-modal-confirm',
  template: `
    <div class="modal-header d-flex justify-content-between">
      <h5 class="modal-title" id="modal-title">Xác nhận xóa</h5>
      <button
        type="button"
        class="btn close"
        aria-label="Close button"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>
        Bạn có chắc chắn muốn xóa
        <span class="fw-semibold text-danger">{{ school?.name }}</span
        >?
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        CANCEL
      </button>
      <button
        type="button"
        ngbAutofocus
        class="btn btn-success"
        (click)="modal.close(school?.id)"
      >
        OK
      </button>
    </div>
  `,
})
export class NgModalConfirm {
  @Input() school: any; // Nhận prop
  constructor(public modal: NgbActiveModal) {}
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

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
    this.getAllSchool();
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

  addSchool() {
    this.router.navigate(['addSchool']);
  }

  openSchoolDetailModal(school: any, mode: any) {
    const _title =
      mode == 'view' ? 'Chi tiết trường học' : 'Cập nhật trường học';
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
        this.messageService.add({
          severity: 'success',
          summary: 'Cập nhật',
          detail: 'Cập nhật thành công',
        });

        this.getAllSchool();
      }
    });
  }

  deleteSchoolConfirmation(school: any) {
    const modalRef = this.modalService.open(NgModalConfirm);
    modalRef.componentInstance.school = school; // Truyền dữ liệu vào modal

    modalRef.result.then(
      (result: any) => {
        if (result) {
          this.deleteSchool(result);
        }
      },
      (reason: any) => {
        console.log(
          '🚀 ~ SchoolComponent ~ deleteSchoolConfirmation ~ reason:',
          reason
        );
      }
    );
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

  show() {
    console.log(123);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }

  deleteSchool(schoolId: any) {
    this.httpProvider.deleteSchool(schoolId).subscribe(
      (data: any) => {
        this.getAllSchool();
        this.messageService.add({
          severity: 'info',
          summary: 'Thành công',
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
