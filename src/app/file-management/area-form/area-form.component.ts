import { AreaService } from './../../tools/services/area.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../tools/services/global';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.scss']
})
export class AreaFormComponent implements OnInit {

  companyId: string;
  title: string = "新增片区";
  areaForm: FormGroup;
  formErrors = {
    'areaName': ''
  }
  validationMessages = {
    'areaName': {
      'required': '必填!'
    }
  }
  item: any;
  constructor(private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private gs: GlobalService,
    private as: AreaService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.createForm();
    this.item = this.modalService.config.initialState['item'];
    if (this.item) this.bindData();
  }

  createForm() {
    this.areaForm = this.fb.group({
      'areaName': ['', Validators.required],
      'remark': ['']
    });
    this.areaForm.valueChanges.subscribe(data => {
      this.gs.checkErrors(this, 'areaForm');
    });
  }

  bindData() {
    this.title = '编辑片区';
    this.areaForm.reset(this.item);
  }

  close() {
    this.bsModalRef.hide();
  }

  submit(formValue) {
    if (this.item) {
      this.as.editArea(this.companyId, this.item.id, formValue).subscribe(json => {
        if (json.code == 200) {
          this.as.areaSubject.next();
          this.close();
        }
      })
    } else {
      this.as.addArea(this.companyId, formValue).subscribe(json => {
        if (json.code == 200) {
          this.as.areaSubject.next();
          this.close();
        }
      });
    }
  }
}
