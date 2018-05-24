import { CompanyService } from './../../tools/services/company.service';
import { GlobalService } from './../../tools/services/global';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-admin',
  templateUrl: './set-admin.component.html',
  styleUrls: ['./set-admin.component.scss']
})
export class SetAdminComponent implements OnInit {

  companyId: string;
  title: string = "配置管理员";
  adminForm: FormGroup;
  roles = [];
  formErrors = {
    'userName': '',
    'name': '',
    'phone': '',
  }
  validationMessages = {
    'userName': {
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
  userId: string;
  itemcompanyId: string;
  constructor(private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private gs: GlobalService,
    private cs: CompanyService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.createForm();
    this.item = this.modalService.config.initialState['item'];
    this.bindData();
  }

  createForm() {
    this.adminForm = this.fb.group({
      'userName': ['', Validators.required],
      'name': ['', Validators.required],
      'phone': ['', [Validators.required, Validators.pattern(/[0-9]{11,11}/)]],
      'remark': [''],
    });
    this.adminForm.valueChanges.subscribe(data => {
      this.gs.checkErrors(this, 'adminForm');
    });
  }

  bindData() {
    if (this.item) {
      this.cs.findAdmin(this.item.id).subscribe(json => {
        if (json.code == 200) {
          let userInfo: any = {};
          userInfo.userName = json.obj.username;
          userInfo.name = json.obj.name;
          userInfo.phone = json.obj.phone;
          userInfo.remark = json.obj.note;
          this.userId = json.obj.id;
          this.adminForm.reset(userInfo);
        }
      });
    }
  }

  close() {
    this.bsModalRef.hide();
  }

  submit(formValue) {
    this.cs.editAdmin(this.item.id, this.userId, formValue).subscribe(json => {
      if (json.code == 200) {
        this.bsModalRef.hide();
      }
    });
  }
}
