import { GlobalService, Global } from './../../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import swal from 'sweetalert2';

@Component({
  selector: 'app-factory-info',
  templateUrl: './factory-info.component.html',
  styleUrls: ['./factory-info.component.scss']
})
export class FactoryInfoComponent implements OnInit {

  myForm: FormGroup;
  companyId: string;
  // id: AbstractControl;
  // name: AbstractControl;
  // address: AbstractControl;
  // phone: AbstractControl;
  // note: AbstractControl;
  navigations: Array<string> = ['主页', '档案管理', '公司信息'];
  constructor(private gs: GlobalService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      'id': ['', Validators.required],
      'name': ['', Validators.required],
      'address': [''],
      'phone': [''],
      'note': [''],
    });
    // this.id = this.myForm.controls["id"];
    // this.name = this.myForm.controls["name"];
    // this.address = this.myForm.controls["address"];
    // this.phone = this.myForm.controls["phone"];
    // this.note = this.myForm.controls["note"];
  }

  ngOnInit() {
    this.companyId = localStorage.getItem("companyId")
    let url = Global.domain + 'api/apishowFactoryInfo.action';
    this.gs.httpGet(url, {companyId:this.companyId}, json => {
      if (json.code == 200) {
        //此处加载company数据
        this.myForm.reset(json.obj);
      }
    });
  }

  reset() {
    this.myForm.reset({ id: this.companyId });
  }

  onSubmit(value) {
    let url = Global.domain + 'api/apicompanyEdit.action';
    this.gs.httpGet(url,{
      'company.id':this.companyId,
      'company.name':value.name,
      'company.address':value.address,
      'company.phone':value.phone,
      'company.note':value.note
    },json=>{
        if(json.code==200){
          swal('信息', '修改成功!', 'success');
        }
    });
  }
}
