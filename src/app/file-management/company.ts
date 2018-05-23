import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyService } from './../tools/services/company.service';
import { Component, OnInit } from '@angular/core';
import { Global, GlobalService } from '../tools/services/global';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'company',
  templateUrl: './company.html',
  styleUrls: ['./Machine.scss']
})
export class Company implements OnInit {
  navigations: Array<string> = ['主页', '档案管理', '公司管理'];
  bsModalRef: BsModalRef;
  companyId: any;
  settings: any;
  source: any[];
  operationObj: any;
  constructor(private modalService: BsModalService, private gs: GlobalService, private cs: CompanyService) {

  }
  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.formHideObservers();
    this.createOperation();
    this.bindSettings();
    this.bindSource();
  }

  /**
 * 注册窗体关闭时执行事件
 */
  formHideObservers() {
    this.cs.companySubject.subscribe(() => {
      this.bindSource();
    });
  }

  operation() {
  }
  /**
   * 创建自定义操作
   */
  createOperation() {
    let self = this;
    this.operation.prototype.edit = (item) => {
      let initialState = {
        item: item
      }
      self.bsModalRef = self.modalService.show(CompanyFormComponent, { initialState });
    }
    this.operation.prototype.delete = (item) => {
      self.gs.confirm().then(value => {
        if (value) {
          self.cs.deleteCompany(self.companyId, item.id).subscribe(json => {
            if (json.code == 200) {

            }
          });
        }
      });
    }
    this.operationObj = new this.operation();
  }

  bindSettings() {
    console.log(this.operationObj);
    this.settings = {
      columns: [
        //{ field: 'sn', title: '序号' },
        { field: 'companyName', title: '公司名称' },
        { field: 'companyAddress', title: '公司地址' },
        { field: 'phone', title: '联系电话' },
        { field: 'state', title: '公司状态' },
        { field: 'remark', title: '备注信息' },
      ],
      operation: [
        { type: 'edit', iconClass: 'fa-pencil', title: "编辑", callBack: this.operationObj.edit },
        { type: 'delete', iconClass: 'fa-trash', title: "删除", callBack: this.operationObj.delete },
      ],
      search: { search: "companyName", name: "公司名称" },
    }
  }

  bindSource() {
    this.cs.getCompanyList(this.companyId).subscribe(json => {
      if (json.code == 200) {
        let data = json.obj;
        var array = [];
        for (var i = 0; i < data.length; i++) {
          var item: any = {};
          item.companyName = data[i].name;
          item.companyAddress = data[i].address;
          item.phone = data[i].phone;
          item.state = data[i].state;
          item.remark = data[i].note;
          item.id = data[i].id;
          array.push(item);
        }
        this.source = [].concat(array);
      }
    });
  }

  add() {
    this.bsModalRef = this.modalService.show(CompanyFormComponent);
  }
}