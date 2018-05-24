import { GlobalService } from './../../tools/services/global';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../../tools/services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  companyId: string;
  clientForm: FormGroup;
  formErrors = {
    'clientCode': '',
    'clientName': '',
    'clientState': '',
  }
  validationMessages = {
    'clientCode': {
      'required': '必填!'
    },
    'clientName': {
      'required': '必填!'
    },
    'clientState': {
      'required': '必填!'
    },
  };
  title: string = '新增客户';
  item: any;
  constructor(private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalServeice: BsModalService,
    private gs: GlobalService,
    private cs: ClientService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.createForm();
    this.item = this.modalServeice.config.initialState['item'];
    this.bindData();
    this.selectBind();
  }

  createForm() {
    this.clientForm = this.fb.group({
      'clientCode': ['', Validators.required],
      'clientName': ['', Validators.required],
      'clientState': ['', Validators.required],
      'remark': ['']
    })
    this.clientForm.valueChanges.subscribe(data => {
      this.gs.checkErrors(this, 'clientForm');
    })
  }

  bindData() {
    if (this.item) {
      this.title = "编辑客户";
      this.clientForm.reset(this.item);
    }
  }

  selectBind() {
    if (this.item) {
      this.clientForm.controls['clientState'].setValue(this.item.clientState == "正常" ? 0 : 1);
    }
  }

  close() {
    this.bsModalRef.hide();
  }

  submit(formValue) {
    if (this.item) {
      this.cs.editClient(this.item.id, formValue).subscribe(json => {
        if (json.code == 200) {
          this.cs.clientSubject.next();
          this.close();
        }
      });
    } else {
      this.cs.addClient(this.companyId, formValue).subscribe(json => {
        if (json.code == 200) {
          this.cs.clientSubject.next();
          this.close();
        }
      });
    }
  }
}
