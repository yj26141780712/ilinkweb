import { Employee } from './../../file-management/employee';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GlobalService } from './global';

@Injectable()
export class EmployeeService {

  public employeeSubject = new Subject();

  constructor(private gs: GlobalService) { }

  getEmployeeList(companyId: string) {

  }

  addEmployee() {

  }

  editEmployee() {

  }

  deleteEmployee() {

  }

}
