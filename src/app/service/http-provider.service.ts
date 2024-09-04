import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api.service';

//var apiUrl = "https://localhost:44370/";

var apiUrl = 'http://127.0.0.1:8000/api';

var httpLink = {
  getAllEmployee: apiUrl + '/employee/getAllEmployee',
  deleteEmployeeById: apiUrl + '/employee/deleteEmployeeById',
  getEmployeeDetailById: apiUrl + '/employee/getEmployeeDetailById',
  saveEmployee: apiUrl + '/employee/saveEmployee',

  createSchool: apiUrl + '/school/create',
  getAllSchool: apiUrl + '/school/all',
  getSchools: apiUrl + '/school/list',
  getDetailSchool: apiUrl + '/school',
  updateSchool: apiUrl + '/school/update',
  deleteSchool: apiUrl + '/school/delete',

  createClass: apiUrl + '/class/create',
  getAllClass: apiUrl + '/class/all',
  getClasses: apiUrl + '/class/list',
  getDetailClass: apiUrl + '/class',
  updateClass: apiUrl + '/class/update',
  deleteClass: apiUrl + '/class/delete',

  createStudent: apiUrl + '/student/create',
  getAllStudent: apiUrl + '/student/all',
  getStudents: apiUrl + '/student/list',
  getDetailStudent: apiUrl + '/student',
  updateStudent: apiUrl + '/student/update',
  deleteStudent: apiUrl + '/student/delete',
};

@Injectable({
  providedIn: 'root',
})
export class HttpProviderService {
  constructor(private webApiService: WebApiService) {}

  public createSchool(data?: any): Observable<any> {
    return this.webApiService.post(httpLink.createSchool, data);
  }
  public getAllSchool(params?: any): Observable<any> {
    return this.webApiService.get(httpLink.getAllSchool, params);
  }

  public getSchools(params?: any): Observable<any> {
    return this.webApiService.get(httpLink.getSchools, params);
  }

  public getDetailSchool(id: string, params?: any): Observable<any> {
    return this.webApiService.get(`${httpLink.getDetailSchool}/${id}`, params);
  }

  public updateSchool(id: string, data: any): Observable<any> {
    return this.webApiService.patch(`${httpLink.updateSchool}/${id}`, data);
  }

  public deleteSchool(id: string): Observable<any> {
    return this.webApiService.delete(`${httpLink.deleteSchool}/${id}`);
  }

  //   -----------------------

  public createClass(data?: any): Observable<any> {
    return this.webApiService.post(httpLink.createClass, data);
  }
  public getAllClass(params?: any): Observable<any> {
    return this.webApiService.get(httpLink.getAllClass, params);
  }

  public getClasses(params?: any): Observable<any> {
    return this.webApiService.get(httpLink.getClasses, params);
  }

  public getDetailClass(id: string, params: any): Observable<any> {
    return this.webApiService.get(`${httpLink.getDetailClass}/${id}`, params);
  }

  public updateClass(id: string, data: any): Observable<any> {
    return this.webApiService.patch(`${httpLink.updateClass}/${id}`, data);
  }

  public deleteClass(id: string): Observable<any> {
    return this.webApiService.delete(`${httpLink.deleteClass}/${id}`);
  }

  //   ----------------------------

  public createStudent(data?: any): Observable<any> {
    return this.webApiService.post(httpLink.createStudent, data);
  }
  public getAllStudent(params: any): Observable<any> {
    return this.webApiService.get(httpLink.getAllStudent, params);
  }

  public getStudents(params: any): Observable<any> {
    return this.webApiService.get(httpLink.getStudents, params);
  }

  public getDetailStudent(id: string, params: any): Observable<any> {
    return this.webApiService.get(`${httpLink.getDetailStudent}/${id}`, params);
  }

  public updateStudent(id: string, data: any): Observable<any> {
    return this.webApiService.patch(`${httpLink.updateStudent}/${id}`, data);
  }

  public deleteStudent(id: string): Observable<any> {
    return this.webApiService.delete(`${httpLink.deleteStudent}/${id}`);
  }
}
