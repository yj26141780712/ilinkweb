import { AreaFormComponent } from './area-form/area-form.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Global, GlobalService } from '../tools/services/global';
import { AreaService } from '../tools/services/area.service';

@Component({
  selector: 'areaManagement',
  templateUrl: './areaManagement.html',
  styleUrls: ['./Machine.scss']
})
export class AreaManagement implements OnInit {

  navigations: Array<string> = ['主页', '档案管理', '片区管理'];
  bsModalRef: BsModalRef;
  companyId: string;
  settings: any;
  source: any[];
  operationObj: any;
  constructor(private gs: GlobalService,
    private as: AreaService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.formHideObservers();
    this.createOperation();
    this.bindSettings();
    this.bindSource();
  }

  formHideObservers() {
    this.as.areaSubject.subscribe(() => {
      this.bindSource();
    })
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
      self.bsModalRef = self.modalService.show(AreaFormComponent, { initialState });
    }
    this.operation.prototype.delete = (item) => {
      self.gs.confirm().then(value => {
        if (value) {
          self.as.deleteArea(item.id).subscribe(json => {
            if (json.code == 200) {
              self.bindSource();
            }
          });
        }
      });
    }
    this.operationObj = new this.operation();
  }

  bindSettings() {
    this.settings = {
      columns: [
        { field: 'areaName', title: '片区名称' },
        { field: 'remark', title: '备注' }
      ],
      operation: [
        { type: 'edit', iconClass: 'fa-pencil', title: "编辑", callBack: this.operationObj.edit },
        { type: 'delete', iconClass: 'fa-trash', title: "删除", callBack: this.operationObj.delete },
      ],
      search: { search: "companyName", name: "公司名称" },
    }
  }

  bindSource() {
    this.as.getAreaList(this.companyId).subscribe(json => {
      if (json.code == 200) {
        let data = json.obj;
        var array = []
        for (var i = 0; i < data.length; i++) {
          var item: any = {};
          item.areaName = data[i].name;
          item.remark = data[i].note;
          item.id = data[i].id;
          array.push(item);
        }
        this.source = [].concat(array);
      }
    })
  }

  add() {
    this.bsModalRef = this.modalService.show(AreaFormComponent);
  }
}