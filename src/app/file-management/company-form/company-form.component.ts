import { CompanyService } from './../../tools/services/company.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GlobalService } from '../../tools/services/global';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {

  companyId: string;
  companyForm: FormGroup;
  formErrors = {
    'companyName': '',
    'companyAddress': '',
    'phone': '',
  }
  validationMessages = {
    'companyName': {
      'required': '必填!'
    },
    'companyAddress': {
      'required': '必填!'
    },
    'phone': {
      'required': '必填!',
      'pattern':'请输入正确的手机号码!'
    },
  };
  title: string = '新增公司';
  item: any;
  constructor(private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private gs: GlobalService,
    private cs: CompanyService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.createForm();
    this.item = this.modalService.config.initialState['item'];
    if (this.item) this.bindData();
  }

  /**
   * 创建表单
   */
  createForm() {
    this.companyForm = this.fb.group({
      'companyName': ['', Validators.required],
      'companyAddress': ['', Validators.required],
      'phone': ['', [Validators.required, Validators.pattern(/^[0-9]{11,11}$/)]],
      'remark': ['']
    });
    this.companyForm.valueChanges.subscribe(data => {
      console.log(data);
      this.gs.checkErrors(this, 'companyForm');
      console.log(this.formErrors);

    })
  }

  /**
   * 绑定数据
   */
  bindData() {
    this.title = "编辑公司";
    this.companyForm.reset(this.item);
  }

  /**
   * 关闭modal
   */
  close() {
    this.bsModalRef.hide();
  }

  /**
   * 表单提交
   * @param formValue 表单值对象
   */
  submit(formValue) {
    if (this.item) {
      this.cs.editComapny(this.item.id, formValue).subscribe(json => {
        if (json.code == 200) {
          this.cs.companySubject.next();
          this.bsModalRef.hide();
        }
      })
    } else {
      this.cs.addCompany(this.companyId, formValue).subscribe(json => {
        if (json.code == 200) {
          this.cs.companySubject.next();
          this.bsModalRef.hide();
        }
      });
    }
  }

}