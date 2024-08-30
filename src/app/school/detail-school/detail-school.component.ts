import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpProviderService } from '../../service/http-provider.service';
import { WebApiService } from '../../service/web-api.service';

@Component({
  selector: 'app-detail-school',
  templateUrl: './detail-school.component.html',
  styleUrls: ['./detail-school.component.scss'],
})
export class DetailSchoolComponent implements OnInit {
  schoolId: any;
  schoolDetail: any;

  constructor(
    public webApiService: WebApiService,
    private route: ActivatedRoute,
    private httpProvider: HttpProviderService
  ) {}

  ngOnInit(): void {
    this.schoolId = this.route.snapshot.params['schoolId'];
    this.getDetailSchool();
  }

  async getDetailSchool() {
    this.httpProvider.getDetailSchool(this.schoolId).subscribe(
      (data: any) => {
        console.log('🚀 ~ HomeComponent ~ getAllEmployee ~ data:', data);
        this.schoolDetail = data;
      },
      (error: any) => {
        if (error) {
          console.log(
            '🚀 ~ DetailSchoolComponent ~ getDetailSchool ~ error:',
            error
          );
        }
      }
    );
  }
}
