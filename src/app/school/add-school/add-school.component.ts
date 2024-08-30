import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../../service/http-provider.service';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
})
export class AddSchoolComponent implements OnInit {
  addSchoolForm: schoolForm = new schoolForm();

  @ViewChild('schoolForm')
  schoolForm!: NgForm;

  isSubmitted: boolean = false;

  constructor(
    private router: Router,
    private httpProvider: HttpProviderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  addSchool(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider.createSchool(this.addSchoolForm).subscribe(
        (data: any) => {
          if (data) {
            this.router.navigate(['/school']);
          }
        },
        (error: any) => {
          if (error) {
            console.log('🚀 ~ AddSchoolComponent ~ addSchool ~ error:', error);
          }
        }
      );
    }
  }
}

export class schoolForm {
  name: string = '';
  address: string = '';
}
