import { EmployeeService } from './../../tools/services/employee.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from '../../tools/services/global';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  companyId: string;
  title: string = "新增用户";
  employeeForm: FormGroup;
  roles = [];
  formErrors = {
    'userName': '',
    'passWord': '',
    'role': '',
    'name': '',
    'phone': '',
  }
  validationMessages = {
    'userName': {
      'required': '必填!'
    },
    'passWord': {
      'required': '必填!'
    },
    'role': {
      'required': '必填!'
    },
    'name': {
      'required': '必填!'
    },
    'phone': {
      'required': '必填!',
      'pattern': '请输入正确的手机号码!'
    },
  }
  item: any;
  constructor(private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private gs: GlobalService,
    private es: EmployeeService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.createForm();
    this.item = this.modalService.config.initialState['item'];
  }

  createForm() {
    this.employeeForm = this.fb.group({
      'userName': ['', Validators.required],
      'passWord': ['', Validators.required],
      'role': ['', Validators.required],
      'name': ['', Validators.required],
      'phone': ['', [Validators.required, Validators.pattern(/^[0-9]{11,11}$/)]],
      'remark': [],
    });
    this.employeeForm.valueChanges.subscribe(data => {
      this.gs.checkErrors(this, 'employeeForm');
    })
  }

  close() {
    this.bsModalRef.hide();
  }

  submit(formValue) {
    if (this.item) {
      //
    } else {

    }
  }
}
