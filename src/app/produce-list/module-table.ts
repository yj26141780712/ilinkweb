import { SetMachineComponent } from '../file-management/set-machine/set-machine.component';
import { GlobalService } from './../tools/services/global';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import * as $ from 'jquery';
import { Global } from '../tools/services/global';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FittingComponent } from '../file-management/fitting/fitting.component';
import { MachineFormComponent } from '../file-management/machine-form/machine-form.component';

//update by yangjie 修改页面显示 20180427
//注塑机管理 <i class="fa fa-cogs" aria-hidden="true" title="设备配件" (click)='setFitting(num)'></i>
//片区管理 <i class="fa fa-cogs" aria-hidden="true" title="配置拥有机型" (click)='setMachine(num)'></i>
@Component({
  selector: 'module-table',
  template: `
  <div class="module-table">
    <div class="module-table-header">
      <p>
        显示<select [(ngModel)]="tbody_show_count" (change)="changeCount()"><option>10</option><option>20</option><option>50</option></select>项结果
      </p>
      <div>搜索:<input type="text" id="searchAttribute" (keyup)="searchAttr(search)" #search></div>
    </div>
    <table class="table table-bordered table-striped table-hover" [ngSwitch]="module_table_type">
      <thead>
        <tr>
          <td (click)="sort(num)" *ngFor="let item of module_table_thead;let num=index">{{item}}<i class="fa fa-sort" aria-hidden="true" *ngIf="sort_show"></i><i class="fa fa-sort-asc" aria-hidden="true"></i><i class="fa fa-sort-desc" aria-hidden="true"></i></td>
          <td *ngSwitchCase="'machine'"><button class="btn btn-default" (click)="addMachine()">添加</button></td>
          <td *ngSwitchCase="'area'"><button class="btn btn-default" (click)="addArea()">添加</button></td>
          <td *ngSwitchCase="'company'"><button class="btn btn-default" (click)="addCompany()">添加</button></td>
          <td *ngSwitchCase="'client'"><button class="btn btn-default" (click)="addclient()">添加</button></td>
          <td *ngSwitchCase="'employee'"><button class="btn btn-default" (click)="addEmployee()">添加</button></td>
          <td *ngSwitchCase="'produceData'"></td>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let content of page_data;let num=index">
          <td *ngFor='let attr of module_table_attr'>{{content[attr]}}</td>
          <td *ngSwitchCase="'machine'" class="machine"><i class="fa fa-pencil" aria-hidden="true" title="编辑" (click)="editMachine(num)"></i><i class="fa fa-trash" aria-hidden="true" title="删除" (click)="delMachine(num)"></i><i class="fa fa-usd" aria-hidden="true" title="指定工厂" (click)='setCompany(num)'></i></td>
          <td *ngSwitchCase="'area'"><i class="fa fa-pencil" aria-hidden="true" title="编辑" (click)="editArea(num)"></i><i class="fa fa-trash" aria-hidden="true" title="删除" (click)="delArea(num)"></i></td>
          <td *ngSwitchCase="'company'"><i class="fa fa-pencil" aria-hidden="true" title="编辑" (click)="editCompany(num)"></i><i class="fa fa-trash" aria-hidden="true" title="删除" (click)="deleteCompany(num)"></i><i class="fa fa-user" aria-hidden="true" title="配置管理员账号" (click)='setAdmin(num)'></i></td>
          <td *ngSwitchCase="'employee'"><i class="fa fa-pencil" aria-hidden="true" (click)="changeEmployee(num)" title="编辑"></i><i class="fa fa-power-off" *ngIf="content.state=='正常'" aria-hidden="true" (click)="stopEmployee(num)" title="停用"></i><i class="fa fa-power-off green" *ngIf="content.state=='停用'" aria-hidden="true" (click)="RunEmployee(num)" title="启用"></i><i class="fa fa-repeat" aria-hidden="true" title="重置密码" (click)="resetPsd(num)"></i></td>
          <td *ngSwitchCase="'client'"><i class="fa fa-pencil" aria-hidden="true" (click)="changeClient(num)" title="编辑"></i><i class="fa fa-trash" aria-hidden="true" title="删除" (click)="deleteClient(num)"></i></td>
          <td *ngSwitchCase="'produceData'"><button class="btn btn-default" (click)="showAllData(content)">详细</button></td>
        </tr>
      </tbody>
    </table>
    <div class="module-table-footer">
      <p>显示第<span>{{beginNum}}</span>到<span>{{endNum}}</span>项结果，共<span>{{total_count}}</span>项</p>
      <div class="btn-group">
        <button class="btn btn-default" (click)="prev()">上页</button>
        <button class="btn btn-default" (click)='page(btn1)' #btn1 [ngClass]="{'btn-select':current_page==1}">1</button>
        <button class="btn btn-default" *ngIf="pages>1" (click)='page(btn2)' #btn2 [ngClass]="{'btn-select':current_page==2}">2</button>
        <button class="btn btn-default" *ngIf="pages>2" (click)='page(btn3)' #btn3 [ngClass]="{'btn-select':current_page==3}">3</button>
        <button class="btn btn-default" *ngIf="pages==4" (click)='page(btn4)' #btn4 [ngClass]="{'btn-select':current_page==4}">4</button>
        <button class="btn btn-default" *ngIf="pages>4">...</button>
        <button class="btn btn-default" *ngIf="current_page>=4&&current_page<(pages-1)" [ngClass]="{'btn-select':current_page>=4}">{{current_page}}</button>
        <button class="btn btn-default" *ngIf="current_page<(pages-1)&&current_page>=4">...</button>
        <button class="btn btn-default" *ngIf="current_page==(pages-1)&&current_page>4" [ngClass]="{'btn-select':current_page==(pages-1)}">{{pages-1}}</button>
        <button class="btn btn-default" *ngIf="pages>4" (click)='page(btn5)' #btn5 [ngClass]="{'btn-select':current_page==pages}">{{pages}}</button>
        <button class="btn btn-default" (click)="next()">下页</button>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./produce-list.component.scss']
})
export class ModuleTable implements OnInit {
  bsModalRef: BsModalRef;
  @Input() module_table_thead: Array<string>;//表头的遍历(中文)
  @Input() module_table_tbody = [];//表身的数据
  @Input() module_table_attr: Array<string>; //表身的属性数组
  @Input() module_table_type: string;
  @Input() module_table_search: any;

  @Output() ClientEvent = new EventEmitter();
  @Output() EmployeeEvent = new EventEmitter();
  @Output() CompanyEvent = new EventEmitter();
  @Output() MachineEvent = new EventEmitter();
  @Output() AreaEvent = new EventEmitter();
  url: string = Global.domain + 'api/';
  total_data = [];//获取到的信息总数
  companyId: any;
  tbody_show_count: number = 10;//显示几条
  sort_show: boolean;//是否显示排序
  sort_flag: number = 2;//0升序，1降序，2双向箭头
  total_count: number = 0;//总信息数
  page_data = [];//当前页面数据
  current_page: number = 1;//当前页数
  beginNum: number;
  endNum: number;
  pages: number = 1;  //总页数
  constructor(private http: Http, private gs: GlobalService, private modalService: BsModalService) {

  }

  ngOnInit() {
    if (this.module_table_search != undefined) {
      document.getElementById('searchAttribute').setAttribute('placeholder', this.module_table_search.name);
    }
    this.companyId = localStorage.getItem('companyId');
    switch (this.module_table_type) {
      case "area":
      case 'log':
      case 'company':
      case 'employee':
        this.sort_show = true;
        break;
      default:
        this.sort_show = false;
        break;
    }
  }
  //搜索
  searchAttr(attr) {
    var Attr = this.module_table_search.search;
    if (attr.value == "") {
      this.module_table_tbody = [].concat(this.total_data);
    } else {
      var array = [];
      for (var i = 0; i < this.total_data.length; i++) {
        // add by yangjie 20150426 this.total_data[i][Attr] null 没有index方法   
        if (this.total_data[i][Attr] && this.total_data[i][Attr].indexOf(attr.value) > -1) {
          array.push(this.total_data[i]);
        }
      }
      this.module_table_tbody = [].concat(array);
    }
    this.firstPage();
  }
  ngAfterViewInit() {
    $('.module-table thead td').click(function () {
      var text = $(this).find('i:visible').attr('class');
      switch (text) {
        case "fa fa-sort":
          $(this).find('i.fa-sort').hide().siblings('i.fa-sort-asc').show();
          break;
        case 'fa fa-sort-asc':
          $(this).find('i.fa-sort-asc').hide().siblings('i.fa-sort-desc').show();
          break;
        case 'fa fa-sort-desc':
          $(this).find('i.fa-sort-desc').hide().siblings('i.fa-sort-asc').show();
          break;
        default:
          break;
      }
    })
  }
  ngOnChanges() {
    this.current_page = 1;
    this.firstPage();
    if (this.total_data.length < this.module_table_tbody.length) {
      this.total_data = [].concat(this.module_table_tbody);
    }
  }
  //数据剪切
  ngAfterContentChecked() {
    if (this.total_count == 0)//开始执行一次
    {
      //this.total_data=this.module_table_tbody;
      this.firstPage();
    }
  }
  //改变显示信息的条数
  changeCount() {
    this.current_page = 1;
    this.firstPage();
  }
  //第一页数据显示
  firstPage() {
    this.current_page = 1;
    $('.module-table-footer button.btn').removeClass('btn-select');
    this.total_count = this.module_table_tbody.length;
    this.page_data = this.module_table_tbody.slice(0, this.tbody_show_count);//显示当前的数据
    this.beginNum = 1;
    this.endNum = this.total_count > this.tbody_show_count ? this.tbody_show_count : this.total_count;
    this.pages = Math.ceil(this.total_count / this.tbody_show_count);
    $('.module-table-footer button.btn:eq(1)').addClass('btn-select');
  }
  prev() {
    if (this.current_page > 1) {
      this.current_page--;
      this.page_data = this.module_table_tbody.slice((this.current_page - 1) * this.tbody_show_count, this.tbody_show_count * this.current_page);
      this.beginNum = (this.current_page - 1) * this.tbody_show_count + 1;
      this.endNum = this.current_page * this.tbody_show_count;
    }
  }
  next() {
    if (this.current_page < this.pages) {
      this.current_page++;
      this.page_data = this.module_table_tbody.slice((this.current_page - 1) * this.tbody_show_count, this.tbody_show_count * this.current_page);
      this.beginNum = (this.current_page - 1) * this.tbody_show_count + 1;
      this.endNum = this.current_page * this.tbody_show_count > this.total_count ? this.total_count : (this.current_page * this.tbody_show_count);
    }
  }
  page(btn) {
    this.current_page = btn.innerText;
    this.page_data = this.module_table_tbody.slice((this.current_page - 1) * this.tbody_show_count, this.tbody_show_count * this.current_page);
    this.beginNum = (this.current_page - 1) * this.tbody_show_count + 1;
    this.endNum = this.current_page * this.tbody_show_count > this.total_count ? this.total_count : (this.current_page * this.tbody_show_count);
  }
  //添加的按键
  add() {
    switch (this.module_table_type) {
      case "value":

        break;
      default:

        break;
    }
  }
  //升序降序方法
  sort(num) {
    if (this.sort_show) {
      switch (this.sort_flag) {
        case 2:
          this.sort_flag = 1;
          break;
        case 1:
          this.sort_flag = 0;
          break;
        case 0:
          this.sort_flag = 1;
          break;
        default:
          break;
      }
      //数据排序
      var attr = this.module_table_attr[num];
      if (this.sort_flag) {
        this.module_table_tbody.sort((a, b) => {
          if (a[attr] < b[attr]) {
            return -1;
          }
          if (a[attr] > b[attr]) {
            return 1;
          }
        })
      } else {
        this.module_table_tbody.sort((a, b) => {
          if (a[attr] < b[attr]) {
            return 1;
          }
          if (a[attr] > b[attr]) {
            return -1;
          }
        })
      }
      this.firstPage();
    }
  }
  //新增客户接口
  addclient() {
    var html = `
    <style>
       .clientAdd{font-size:16px;}
       .clientAdd label{width:37%;text-align:right;}
       .clientAdd select{font-size:14px;height:24px;}
       .clientAdd>li{line-height:24px;text-align:left;}
    </style>
    <ul class="clientAdd">
      <li><label>编号: </label><input type="text" id="clientid"/></li>
      <li><label>名称：</label><input type="text" id="name"/></li>
      <li><label>状态： </label>
        <select id="status">
          <option>停用</option>
          <option>正常</option>
        </select>
      </li>
    </ul>
    `;
    swal({
      title: "添加",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      position: 'top',

    }).then((result) => {
      if (result.value) {
        var clientId = <HTMLInputElement>document.getElementById('clientid');
        var name = <HTMLInputElement>document.getElementById('name');
        var status = <HTMLInputElement>document.getElementById('status');
        this.gs.httpGet(Global.domain + 'api/apisaveClient.action?client.id=&client.clientId=' + clientId.value + '&client.clientName=' + name.value + '&client.status=' + status.value + '&companyId=' + this.companyId, {}, json => {
          if (json.code == 200) {
            this.ClientEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //修改客户接口
  changeClient(num) {
    let parent = document.getElementsByClassName('client_content')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[num];
    let clientId = parent.getElementsByTagName('td')[0].innerText;
    let name = parent.getElementsByTagName('td')[1].innerText;
    let remark = parent.getElementsByTagName('td')[3].innerText;
    let status = parent.getElementsByTagName('td')[4].innerText;
    var html = `
    <style>
       .clientCha{font-size:16px;}
       .clientCha label{width:37%;text-align:right;}
       .clientCha select{font-size:14px;height:24px;}
       .clientCha>li{line-height:24px;text-align:left;}
    </style>
    <ul class="clientCha">
      <li><label>塑料厂编号: </label><input type="text" id="clientid" disabled value='${clientId}'/></li>
      <li><label>塑料厂名称：</label><input type="text" id="name" value='${name}' /></li>
      <li><label style="float:left;">备注信息： </label>
        <textarea id="" placeholder="备注信息">${remark}</textarea>
      </li>
      <li>
        <label>状态： </label>
        <select id="status">
          <option ${status == '停用' ? 'selected="true"' : ''}>停用</option>
          <option ${status == '正常' ? 'selected="true"' : ''}>正常</option>
        </select>
      </li>
    </ul>
    `;
    swal({
      title: "修改",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      position: 'top'
    }).then((result) => {
      if (result.value) {
        var clientId = <HTMLInputElement>document.getElementById('clientid');
        var name = <HTMLInputElement>document.getElementById('name');
        var status = <HTMLInputElement>document.getElementById('status');
        this.gs.httpGet(Global.domain + 'api/apisaveClient.action?client.id=' + this.page_data[num].clientid + '&client.clientId=' + clientId.value + '&client.clientName=' + name.value + '&client.status=' + status.value, {}, json => {
          if (json.code == 200) {
            this.ClientEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //删除客户
  deleteClient(num) {
    swal({
      title: "确定删除吗？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        this.gs.httpGet(Global.domain + 'api/apidelClient.action?clientId=' + this.page_data[num].clientid, {}, json => {
          if (json.code == 200) {
            this.ClientEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }

  //启用
  RunEmployee(num) {
    swal({
      title: "确定启用吗？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定启用',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        this.gs.httpGet(this.url + 'apiuserStart.action?userId=' + this.page_data[num].id + '&companyId=' + this.companyId, {}, json => {

          if (json.code == 200) {
            this.EmployeeEvent.emit("ok");
          }
        });
      }
    }).catch(swal.noop);
  }
  //停用用户
  stopEmployee(num) {
    swal({
      title: "确定停用吗？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定停用',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        this.gs.httpGet(this.url + 'apiuserDel.action?userId=' + this.page_data[num].id + '&companyId=' + this.companyId, {}, json => {

          if (json.code == 200) {
            this.EmployeeEvent.emit("ok");
          }
        });
      }
    }).catch(swal.noop);
  }
  //新增用户
  addEmployee() {
    let _url = Global.domain + "api/apigetRoleListByCompany";
    this.gs.httpGet(_url, { companyId: this.companyId }, json => {
      this.addEmployeeBack(json.obj);
    })
  }
  addEmployeeBack(dataRole) {
    let _options = "";
    dataRole.forEach(r => {
      _options += `<option value="${r.id}">${r.rolename}</option>`;
    });
    var html = `
    <style>
       .EmployeeAdd{font-size:16px;}
       .EmployeeAdd label{width:37%;text-align:right;}
       .EmployeeAdd select{font-size:14px;height:24px;}
       .EmployeeAdd>li{line-height:30px;text-align:left;margin-bottom:10px;}
    </style>
    <ul class="EmployeeAdd">
      <li><label>用户账号: </label><input type="text" id="EmployeeId"/ placeholder="用户账号"></li>
      <li><label>用户密码: </label><input type="text" id="EmployeePassword"/ placeholder="用户密码"></li>
      <li><label>用户角色： </label>
        <select id="role">
          ${_options}
        </select>
      </li>
      <li><label>用户姓名：</label><input type="text" id="username"/ placeholder="用户姓名"></li>
      <li><label>联系电话：</label><input type="text" id="phone"/ placeholder="联系电话"></li>
      <li><label>备注信息：</label><input type="text" id="notes"/ placeholder="备注信息"></li>
    </ul>
    `;
    swal({
      title: "添加用户",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      position: 'top',
    }).then((result) => {
      if (result.value) {
        var Id = <HTMLInputElement>document.getElementById('EmployeeId');
        var Password = <HTMLInputElement>document.getElementById('EmployeePassword');
        var role = <HTMLInputElement>document.getElementById('role');
        var username = <HTMLInputElement>document.getElementById('username');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var notes = <HTMLInputElement>document.getElementById('notes');

        this.gs.httpGet(this.url + 'apiuserAdd.action?user.username=' + Id.value + '&user.password=' + Password.value + '&user.roleid=' + role.value + '&user.name=' + username.value + '&user.phone=' + phone.value + '&user.note=' + notes.value + '&user.companyId=' + this.companyId, {}, json => {

          if (json.code == 200) {
            this.EmployeeEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //修改用户
  changeEmployee(num) {
    let _url = Global.domain + "api/apigetRoleListByCompany";
    this.gs.httpGet(_url, { companyId: this.companyId }, json => {
      this.changeEmployeeBack(num, json.obj);
    })
  }
  changeEmployeeBack(num, dataRole) {
    let roleid = this.page_data[num].roleid;
    console.log(roleid);
    let _options = "";
    dataRole.forEach(r => {
      _options += `<option value="${r.id}" ${r.id == roleid ? 'selected="selected"' : ''}>${r.rolename}</option>`;
    });
    var html = `
    <style>
       .EmployeeCha{font-size:16px;}
       .EmployeeCha label{width:37%;text-align:right;}
       .EmployeeCha select{font-size:14px;height:24px;}
       .EmployeeCha>li{line-height:30px;text-align:left;margin-bottom:10px;}
       .EmployeeCha input{text-indent:5px;color:#333;}
    </style>
    <ul class="EmployeeCha">
      <li><label>用户账号: </label><input type="text" id="clientid"/></li>
      <li><label>用户角色 </label>
      <select id="role">
          ${_options}
        </select>
      </li>
      <li><label>用户姓名：</label><input type="text" id="name"/></li>
      <li><label>联系电话：</label><input type="text" id="phone"/></li>
      <li><label>备注信息：</label><input type="text" id="note"/></li>
    </ul>
    `;
    swal({
      title: "编辑",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      position: 'top',
      onOpen: () => {
        //获取当前行的值
        var userid = <HTMLInputElement>document.getElementById('clientid');
        userid.value = this.page_data[num].user_id;
        var name = <HTMLInputElement>document.getElementById('name');
        name.value = this.page_data[num].username;
        // var role = <HTMLInputElement>document.getElementById('role');
        // role.value = this.page_data[num].user_message == '机械厂总经理' ? "2" : "4";//存在管理员的不可编辑
        var phone = <HTMLInputElement>document.getElementById('phone');
        phone.value = this.page_data[num].phone;
        var note = <HTMLInputElement>document.getElementById('note');
        note.value = this.page_data[num].note;
      }
    }).then((result) => {
      if (result.value) {
        //var id = localStorage.getItem("id");

        var userid = <HTMLInputElement>document.getElementById('clientid');
        var name = <HTMLInputElement>document.getElementById('name');
        var role = <HTMLInputElement>document.getElementById('role');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var note = <HTMLInputElement>document.getElementById('note');
        let roleValue = roleid == 1 || roleid == -3 ? roleid : role.value;
        this.gs.httpGet(this.url + 'apiuserEdit.action?user.password=' + this.page_data[num].password + '&user.username=' + userid.value + '&user.roleid=' + roleValue + '&user.name=' + name.value + '&user.phone=' + phone.value + '&user.note=' + note.value + '&user.id=' + this.page_data[num].id, {}, json => {
          if (json.code == 200) {
            this.EmployeeEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //重置客户密码
  resetPsd(num) {
    swal({
      title: "将该用户密码重置为“123456”，确定吗？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '重置',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        this.gs.httpGet(this.url + 'apiresetPassword.action?userId=' + this.page_data[num].id, {}, json => {

        })
      }
    }).catch(swal.noop);
  }
  //新增公司
  addCompany(num) {
    var html =
      `<style>
       .EmployeeCha{font-size:16px;}
       .EmployeeCha label{width:37%;text-align:right;}
       .EmployeeCha>li{line-height:30px;text-align:left;margin-bottom:10px;}
       .EmployeeCha input{text-indent:5px;color:#333;}
      </style>
    <ul class="EmployeeCha">
      <li><label>公司名称：</label><input type="text" id="companyName"/></li>
      <li><label>公司地址：</label><input type="text" id="companyAddress"/></li>
      <li><label>联系电话：</label><input type="text" id="phone"/></li>
      <li><label style="float:left;">备注信息：</label><textarea id="notes"></textarea></li>
    </ul>`;
    swal({
      title: "新增公司",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      position: 'top',
      onOpen: () => {
      }
    }).then((result) => {
      if (result.value) {
        //需要companyID
        var Name = <HTMLInputElement>document.getElementById('companyName');
        var address = <HTMLInputElement>document.getElementById('companyAddress');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var notes = <HTMLInputElement>document.getElementById('notes');
        this.gs.httpGet(this.url + 'apicompanyAdd.action?companyId=' + this.companyId + '&company.name=' + Name.value + '&company.address=' + address.value + '&company.phone=' + phone.value + '&company.note=' + notes.value, {}, json => {
          if (json.code == 200) {
            this.CompanyEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //删除公司
  deleteCompany(num) {
    swal({
      title: "确定删除吗？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        this.gs.httpGet(this.url + 'apicompanyDel.action?companyId=' + this.companyId + '&delCompanyId=' + this.page_data[num].id, {}, json => {
          if (json.code == 200) {
            this.CompanyEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //编辑公司
  editCompany(num) {
    var html =
      `<style>
       .EmployeeCha{font-size:16px;}
       .EmployeeCha label{width:37%;text-align:right;}
       .EmployeeCha>li{line-height:30px;text-align:left;margin-bottom:10px;}
       .EmployeeCha input{text-indent:5px;color:#333;}
      </style>
    <ul class="EmployeeCha">
      <li><label>公司名称：</label><input type="text" id="companyName"/></li>
      <li><label>公司地址：</label><input type="text" id="companyAddress"/></li>
      <li><label>联系电话：</label><input type="text" id="phone"/></li>
      <li><label style="float:left;">备注信息：</label><textarea id="notes"></textarea></li>
    </ul>`;
    swal({
      title: "编辑公司",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      position: 'top',
      onOpen: () => {
        var Name = <HTMLInputElement>document.getElementById('companyName');
        var address = <HTMLInputElement>document.getElementById('companyAddress');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var notes = <HTMLInputElement>document.getElementById('notes');
        Name.value = this.page_data[num].c_name;
        address.value = this.page_data[num].c_address;
        phone.value = this.page_data[num].phone_number;
        notes.value = this.page_data[num].remarks;
      }
    }).then((result) => {
      if (result.value) {
        //需要companyID
        var Name = <HTMLInputElement>document.getElementById('companyName');
        var address = <HTMLInputElement>document.getElementById('companyAddress');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var notes = <HTMLInputElement>document.getElementById('notes');
        this.gs.httpGet(this.url + 'apicompanyEdit.action?company.id=' + this.page_data[num].id + '&company.name=' + Name.value + '&company.address=' + address.value + '&company.phone=' + phone.value + '&company.note=' + notes.value, {}, json => {
          if (json.code == 200) {
            this.CompanyEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //配置拥有机型
  setMachine(num) {
    this.bsModalRef = this.modalService.show(SetMachineComponent);
  }
  //公司-配置管理员
  setAdmin(num) {
    var html = `<style>
       .EmployeeCha{font-size:16px;}
       .EmployeeCha label{width:37%;text-align:right;}
       .EmployeeCha>li{line-height:30px;text-align:left;margin-bottom:10px;}
       .EmployeeCha input{text-indent:5px;color:#333;}
      </style>
    <ul class="EmployeeCha">
      <li><label>用户账号：</label><input type="text" id="userName" placeholder="用户账号"/></li>
      <li><label>用户姓名：</label><input type="text" id="name" placeholder="用户姓名"/></li>
      <li><label>联系电话：</label><input type="text" id="phone" placeholder="联系电话" /></li>
      <li><label>备注信息：</label><input type="text" id="notes" placeholder="备注信息" /></li>
      <li class="hidden" ><input type="text" id="userid" /> </li>
    </ul>`;
    swal({
      title: "管理员账号",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      position: 'top',
      onOpen: () => {
        //获取账号Global.domain+'/api/apifindAdmin.action?companyId=当前工厂的id
        var username = <HTMLInputElement>document.getElementById('userName');
        var Name = <HTMLInputElement>document.getElementById('name');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var notes = <HTMLInputElement>document.getElementById('notes');
        var id = <HTMLInputElement>document.getElementById('userid');
        this.gs.httpGet(this.url + 'apifindAdmin.action?companyId=' + this.page_data[num].id, {}, json => {
          if (json.code == 200) {
            username.value = json.obj.username;
            Name.value = json.obj.name;
            phone.value = json.obj.phone;
            notes.value = json.obj.note;
            id.value = json.obj.id;
          }
        })
      }
    }).then((result) => {
      if (result.value) {
        var username = <HTMLInputElement>document.getElementById('userName');
        var Name = <HTMLInputElement>document.getElementById('name');
        var phone = <HTMLInputElement>document.getElementById('phone');
        var notes = <HTMLInputElement>document.getElementById('notes');
        var id = <HTMLInputElement>document.getElementById('userid');
        this.gs.httpGet(this.url + 'apieditAdmin.action?user.username=' + username.value + '&user.name=' + Name.value + '&user.note=' + notes.value + '&user.phone=' + phone.value + '&user.companyId=' + this.page_data[num].id + '&user.id=' + id.value, {}, json => {
          if (json.code == 200) {
            this.MachineEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }

  //新增注塑机
  addMachine() {  //add by yangjie 20180427 修改下拉框
    //this.bsModalRef = this.modalService.show(MachineFormComponent); 
    let _url_model = this.url + "apifindModelsByCompany.action?companyId=" + this.companyId;
    let _url_company = this.url + "apicompanys.action?companyId=" + this.companyId;
    let _url_area = this.url + "apiareas.action?companyId=" + this.companyId;
    let _data_model = null;
    let _data_company = null;
    let _data_area = null;
    this.gs.httpGet(_url_model, {}, json => {
      _data_model = json.obj;
      this.addMachineBack(_data_model, _data_area, _data_company);
    });
    this.gs.httpGet(_url_area, {}, json => {
      _data_area = json.obj;
      this.addMachineBack(_data_model, _data_area, _data_company);
    });
    this.gs.httpGet(_url_company, {}, json => {
      _data_company = json.obj;
      this.addMachineBack(_data_model, _data_area, _data_company);
    });
  }

  addMachineBack(data_model, data_area, data_company) {
    if (data_model && data_area && data_company) {
      let _option_model = '';
      let _option_area = '';
      let _option_company = '';
      for (const obj of data_model) {
        _option_model += `<option value="${obj.id}">${obj.name}</option>`;
      }
      for (const obj of data_area) {
        if (obj.companyId == this.companyId) {
          _option_area += `<option value="${obj.id}">${obj.name}</option>`;
        }
      }
      for (const obj of data_company) {
        _option_company += `<option value="${obj.id}">${obj.name}</option>`;
      }
      var html =
        `<style>
       .EmployeeCha{font-size:16px;}
       .EmployeeCha label{width:37%;text-align:right;}
       .EmployeeCha>li{line-height:30px;text-align:left;margin-bottom:10px;overflow:hidden;}
       .EmployeeCha input{text-indent:5px;color:#333;}
       .EmployeeCha select{font-size:14px;height:24px;}
       .input-group{width:200px;float:left;}
      </style>
    <ul class="EmployeeCha">
      <li><label>注塑机编号：</label><input type="text" id="Mid"  placeholder="注塑机编号"/></li>
      <li><label>注塑机名称：</label><input type="text" id="MName" placeholder="注塑机名称"/></li>
      <li><label>注塑机类型：</label><input type="text" id="MType" placeholder="注塑机类型："/></li>
      <li><label>采集器编号：</label><input type="text" id="moniter" placeholder="采集器编号："/><span id="moniterErr" class="hidden text-danger">采集器编号重复</span></li>
      <li><label>出厂调试人员：</label><input type="text" id="out_name" placeholder="出厂调试人员"/></li>
      <li><label>出厂日期：</label><input type="date" id="out_date" placeholder="出厂日期"/></li>
      <li><label>代理公司：</label>
        <select id="proxy_com">
          <option>无</option>
          ${_option_company}
        </select>
      </li>
      <li><label>所属片区：</label>
        <select id="area">
          ${_option_area} 
        </select>
      </li>
      <li><label style="float:left;">GPS信息：</label>
        <div class="input-group">
          <input type="text" placeholder="GPS信息" id="GPS">
          <span class="input-group-btn">
          <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" class="btn btn-default" target='_blank'>拾取</a>
          </span>
        </div>
      </li>
      <li><label>类别：</label>
      <select id="status">
      ${_option_model}
      </select>
      </li>
      <li><label>备注信息：</label><input type="text" id="remarks" placeholder="备注信息"/></li>
    </ul>`;
      /*这里的select应该从数据获取，而不是这里写死*/
      swal({
        title: "新增机器",
        width: '600px',
        html: html,
        onOpen: () => {
          let moniter = document.getElementById('moniter');
          moniter.addEventListener('blur', (e: any) => {
            let value = e.target.value;
            this.gs.httpGet(Global.domain + 'api/apicheckRepeatMonitor.action', { mid: value }, json => {
              let moniterErr = document.getElementById('moniterErr');
              if (json.code == 201) {
                if (moniterErr.className.includes('hidden')) moniterErr.className = moniterErr.className.replace('hidden', '');
              } else {
                moniterErr.className += " hidden";
              }
            });
          });
        },
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        position: 'top',
        preConfirm: () => {
          return new Promise((resolve, reject) => {
            let moniterErr = <HTMLInputElement>document.getElementById('moniterErr');
            let moniter = <HTMLInputElement>document.getElementById('moniter');
            this.gs.httpGet(Global.domain + 'api/apicheckRepeatMonitor.action', { mid: moniter.value }, json => {
              if (json.code == 201) { //采集器编号重复
                if (moniterErr.className.includes('hidden')) moniterErr.className = moniterErr.className.replace('hidden', '');
                reject(false);
              } else {
                resolve(true);
              };
            });
          });
        }
      }).then((result) => {
        var userid = localStorage.getItem('id');
        var Mid = <HTMLInputElement>document.getElementById('Mid');
        var MName = <HTMLInputElement>document.getElementById('MName');
        var Mtype = <HTMLInputElement>document.getElementById('Mtype');
        var status = <HTMLInputElement>document.getElementById('status');
        var moniter = <HTMLInputElement>document.getElementById('moniter');
        var out_name = <HTMLInputElement>document.getElementById('out_name');
        var out_date = <HTMLInputElement>document.getElementById('out_date');
        var proxy_com = <HTMLInputElement>document.getElementById('proxy_com');
        var area = <HTMLInputElement>document.getElementById('area');
        var GPS = <HTMLInputElement>document.getElementById('GPS');
        var remarks = <HTMLInputElement>document.getElementById('remarks');
        if (result.value) {
          this.gs.httpGet(this.url + 'apideviceAdd.action?device.sn=' + Mid.value + '&device.name=' + MName.value + '&device.modelid=' + status.value + '&device.monitorid=' + moniter.value + '&device.cpersonnel=' + out_name.value + '&device.ddate=' + out_date.value + '&device.proxyid=' + proxy_com.value + '&device.areaid=' + area.value + '&device.gps=' + GPS.value + '&device.note=' + remarks.value + '&device.companyId=' + this.companyId + '&device.luser=' + userid + '&device.deviceType=' + Mtype.value, {}, json => {
            if (json.code == 200) {
              this.MachineEvent.emit("ok");
            }
          });
        }
      });
    }
  }

  //删除注塑机
  delMachine(num) {
    swal({
      title: "确定删除么？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        let _url = this.url + 'apideviceDel.action?companyId=' + this.companyId + '&deviceId=' + this.page_data[num].id;
        this.gs.httpGet(_url, {}, json => {
          if (json.code == 200) {
            this.MachineEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //编辑   //add by yangjie 20180427
  editMachine(num) {
    let _url_model = this.url + "apifindModelsByCompany.action?companyId=" + this.companyId;
    let _url_company = this.url + "apicompanys.action?companyId=" + this.companyId;
    let _url_area = this.url + "apiareas.action?companyId=" + this.companyId;
    let _data_model = null;
    let _data_company = null;
    let _data_area = null;
    this.gs.httpGet(_url_model, {}, json => {
      _data_model = json.obj;
      this.editMachineBcck(num, _data_model, _data_area, _data_company);
    });
    this.gs.httpGet(_url_area, {}, json => {
      _data_area = json.obj;
      this.editMachineBcck(num, _data_model, _data_area, _data_company);
    });
    this.gs.httpGet(_url_company, {}, json => {
      _data_company = json.obj;
      this.editMachineBcck(num, _data_model, _data_area, _data_company);
    });
  }

  editMachineBcck(num, data_model, data_area, data_company) { //add by yangjie 20180427 
    if (data_model && data_area && data_company) {
      let _machine = this.page_data[num];
      console.log(_machine);
      let _option_model = '';
      let _option_area = '';
      let _option_company = '';
      for (const obj of data_model) {

        _option_model += `<option value="${obj.id}" ${obj.name == _machine.m_type ? "selected='selected'" : ""} >${obj.name}</option>`;
      }
      for (const obj of data_area) {
        if (obj.companyId == this.companyId) {
          _option_area += `<option value="${obj.id}" ${obj.name == _machine.area ? "selected='selected'" : ""} >${obj.name}</option>`;
        }
      }
      for (const obj of data_company) {
        _option_company += `<option value="${obj.id}" ${obj.name == _machine.d_company ? "selected='selected'" : ""} >${obj.name}</option>`;
      }
      var html =
        `<style>
       .EmployeeCha{font-size:16px;}
       .EmployeeCha label{width:37%;text-align:right;}
       .EmployeeCha>li{line-height:30px;text-align:left;margin-bottom:10px;overflow:hidden;}
       .EmployeeCha input{text-indent:5px;color:#333;}
       .EmployeeCha select{font-size:14px;height:24px;}
       .input-group{width:200px;float:left;}
      </style>
    <ul class="EmployeeCha">
      <li><label>注塑机编号：</label><input type="text" id="Mid"  placeholder="注塑机编号" value='${_machine.m_id}' /></li>
      <li><label>注塑机名称：</label><input type="text" id="MName" placeholder="注塑机名称" value='${_machine.m_name}' /></li>
      <li><label>注塑机类型：</label><input type="text" id="MName" placeholder="注塑机类型" value='${_machine.m_name}' /></li>
      <li><label>采集器编号：</label><input type="text" id="moniter" placeholder="采集器编号：" value='${_machine.c_id}' /><span id="moniterErr" class="hidden text-danger">采集器编号重复</span></li>
      <li><label>出厂调试人员：</label><input type="text" id="out_name" placeholder="出厂调试人员" value='${_machine.o_name}' /></li>
      <li><label>出厂日期：</label><input type="date" id="out_date" placeholder="出厂日期" value='${_machine.o_date}' /></li>
      <li><label>代理公司：</label>
        <select id="proxy_com">
          <option value='0'>无</option>
          ${_option_company}
        </select>
      </li>
      <li><label>所属片区：</label>
        <select id="area">
        <option value='0'>无</option>
          ${_option_area} 
        </select>
      </li>
      <li><label style="float:left;">GPS信息：</label>
        <div class="input-group">
          <input type="text"  placeholder="GPS信息" id="GPS" value="${_machine.x + ',' + _machine.y}" >
          <span class="input-group-btn">
            <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" class="btn btn-default" target='_blank'>拾取</a>
          </span>
        </div>
      </li>
      <li><label>类别：</label>
      <select id="status">
        ${_option_model}
      </select>
      </li>
      <li><label>备注信息：</label><input type="text" id="remarks" placeholder="备注信息" value='${_machine.remarks}' /></li>
    </ul>`;
      /*这里的select应该从数据获取，而不是这里写死*/
      swal({
        title: "编辑机器",
        width: '600px',
        html: html,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        position: 'top',
        onOpen: () => {
          let moniter = document.getElementById('moniter');
          moniter.addEventListener('blur', (e: any) => {
            let value = e.target.value;
            this.gs.httpGet(Global.domain + 'api/apicheckRepeatMonitor.action', { mid: value }, json => {
              let moniterErr = document.getElementById('moniterErr');
              if (json.code == 201 && value != _machine.c_id) {
                if (moniterErr.className.includes('hidden')) moniterErr.className = moniterErr.className.replace('hidden', '');
              } else {
                moniterErr.className += " hidden";
              }
            });
          });
        },
        preConfirm: () => {
          return new Promise((resolve, reject) => {
            let moniterErr = <HTMLInputElement>document.getElementById('moniterErr');
            let moniter = <HTMLInputElement>document.getElementById('moniter');
            this.gs.httpGet(Global.domain + 'api/apicheckRepeatMonitor.action', { mid: moniter.value }, json => {
              if (json.code == 201 && moniter.value != _machine.c_id) { //采集器编号重复
                if (moniterErr.className.includes('hidden')) moniterErr.className = moniterErr.className.replace('hidden', '');
                reject(false);
              } else {
                resolve(true);
              };
            })
          });
        }
      }).then(result => {
        if (result.value) {
          //   let _machine_id = _machine.id;
          let userid = localStorage.getItem('id');
          let Mid = <HTMLInputElement>document.getElementById('Mid');
          let MName = <HTMLInputElement>document.getElementById('MName');
          let Mtype = <HTMLInputElement>document.getElementById('status');
          let moniter = <HTMLInputElement>document.getElementById('moniter');
          let out_name = <HTMLInputElement>document.getElementById('out_name');
          let out_date = <HTMLInputElement>document.getElementById('out_date');
          let proxy_com = <HTMLInputElement>document.getElementById('proxy_com');
          let area = <HTMLInputElement>document.getElementById('area');
          let GPS = <HTMLInputElement>document.getElementById('GPS');
          let remarks = <HTMLInputElement>document.getElementById('remarks');
          let _url = `${this.url}apideviceEdit.action?device.sn=${Mid.value}&device.name=${MName.value}`
            + `&device.modelid=${Mtype.value}&device.monitorid=${moniter.value}`
            + `&device.cpersonnel=${out_name.value}&device.ddate=${out_date.value}`
            + `&device.proxyid=${proxy_com.value}&device.areaid=${area.value}`
            + `&device.note=${remarks.value}&device.gps=${GPS.value}`
            + `&device.companyId=${this.companyId}&device.luser=${userid}`
            + `&device.id=${_machine.id}&type=1`;
          this.gs.httpGet(_url, {}, json => {
            if (json.code == 200) {
              this.MachineEvent.emit("ok");
            }
          })
          // this.gs.httpGet(_url, {}, json => {
          //   if (json.code == 200) {
          //     this.MachineEvent.emit("ok");
          //   }
          // })
        }
      }).catch((err) => {
        swal('提交提示', '采集器编号重复!', 'error');
      });
    }
  }
  //设备配机 add by yangjie 20180503
  setFitting(num) {
    let _machine = this.page_data[num];
    //console.log(123,_machine);
    const initialState = { //modal 传参
      machine: _machine
    };
    this.bsModalRef = this.modalService.show(FittingComponent, { initialState });
    //this.bsModalRef.content.closeBtnName = 'Close';
  }
  //指定工厂
  setCompany(num) {
    let _machine = this.page_data[num];
    this.gs.httpGet(Global.domain + 'api/apishowClients.action?companyId=' + this.companyId, {}, json => {
      let _json = json;
      if (_json.code == 200) {

        let _factory = "";
        for (let obj of json.obj) {
          _factory += `<option value="${obj.clientId}" ${_machine.s_company == obj.clientName ? "selected='selected'" : ""}>${obj.clientName}</option>`;
        }
        let _html = `<style>
          .saleFactory {font-size:16px;}
          .saleFactory label{width:37%;text-align:right;}
          .saleFactory>li{line-height:30px;text-align:left;margin-bottom:10px;}
       </style>
       <ul class="saleFactory">
         <li><label>塑料厂: </label><select id="proxy_com">
         <option>无</option>
         ${_factory}
       </select>
       </ul>`;
        swal({
          title: "指定工厂",
          width: '600px',
          html: _html,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          position: 'center'
        }).then(result => {
          if (result.value) {
            let proxy_com = <HTMLInputElement>document.getElementById("proxy_com");
            let luserId = localStorage.getItem('id');
            this.gs.httpGet(this.url + 'apideviceEdit.action', {
              'device.id': _machine.id,
              'device.companyId': this.companyId,
              'device.factoryid': proxy_com.value,
              'device.luser': luserId,
              type: 2,
            }, json => {
              this.MachineEvent.emit('ok');
            });
          }
        })
      }
    });
  }
  //新增片区
  addArea() {
    var html = `
    <style>
       .EmployeeAdd{font-size:16px;}
       .EmployeeAdd label{width:37%;text-align:right;}
       .EmployeeAdd>li{line-height:30px;text-align:left;margin-bottom:10px;}
    </style>
    <ul class="EmployeeAdd">
      <li><label>片区名称: </label><input type="text" id="areaName" placeholder="片区名称"/></li>
      <li><label style="float:left;">备注信息：</label>
        <textarea name="" id="notes"></textarea>
      </li>
    </ul>
    `;
    swal({
      title: "添加片区",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      position: 'top',
    }).then((result) => {
      if (result.value) {
        var areaName = <HTMLInputElement>document.getElementById('areaName');
        var notes = <HTMLInputElement>document.getElementById('notes');
        this.gs.httpGet(this.url + 'apiareaAdd.action?area.companyId=' + this.companyId + '&area.name=' + areaName.value + '&area.note=' + notes.value, {}, json => {

          if (json.code == 200) {
            this.AreaEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //修改片区
  editArea(num) {
    var html = `
    <style>
       .EmployeeAdd{font-size:16px;}
       .EmployeeAdd label{width:37%;text-align:right;}
       .EmployeeAdd>li{line-height:30px;text-align:left;margin-bottom:10px;}
    </style>
    <ul class="EmployeeAdd">
      <li><label>片区名称: </label><input type="text" id="areaName" placeholder="片区名称"/></li>
      <li><label style="float:left;">备注信息：</label>
        <textarea name="" id="notes"></textarea>
      </li>
    </ul>
    `;
    swal({
      title: "编辑片区",
      width: '600px',
      html: html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      position: 'top',
      onOpen: () => {
        var areaName = <HTMLInputElement>document.getElementById('areaName');
        var notes = <HTMLInputElement>document.getElementById('notes');
        areaName.value = this.page_data[num].area;
        notes.value = this.page_data[num].remarks;
      }
    }).then((result) => {
      if (result.value) {
        var areaName = <HTMLInputElement>document.getElementById('areaName');
        var notes = <HTMLInputElement>document.getElementById('notes');

        this.gs.httpGet(this.url + 'apiareaEdit.action?area.id=' + this.page_data[num].id + '&area.companyId=' + this.companyId + '&area.name=' + areaName.value + '&area.note=' + notes.value, {}, json => {

          if (json.code == 200) {
            this.AreaEvent.emit("ok");
          }
        })
      }
    }).catch(swal.noop);
  }
  //删除片区
  delArea(num) {
    swal({
      title: "确定删除么？",
      type: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.value) {
        this.gs.httpGet(Global.domain + 'api/apiareaDel.action?areaId=' + this.page_data[num].id, {}, json => {

          this.AreaEvent.emit("ok");
        })
      }
    }).catch(swal.noop);
  }

  /**
   * 显示实时数据详细信息
   * @param item 表格行数据
   */
  showAllData(item) {
    console.log(item);
    //let _arr_key = Object.keys(item.name);
    let _trs = '';
    let _tds = '';
    Global.AllEaddress.forEach((arr, i) => {
      let _td = `<td class="text-right">${arr[2]}:</td><td>${item[arr[0]]}</td>`;
      if (i > 0 && i % 4 == 0) {
        _trs += `<tr>${_tds}</tr>`;
        _tds = '';
      }
      _tds += _td;
      console.log(_td);
    });
    _trs += (_tds.length > 0 ? `<tr>${_tds}</tr>` : '');
    console.log(_trs);
    let _html = `
      <div class="modal-header">
        <button type="button" class="close" id="showAllDataClose">×</button>
        <h4 class="blue bigger text-left">成品详情</h4>
      </div>
      <div class="modal-body no-padding">
          <table class="table table-striped table-condensed table-hover">
              <tbody>
               ${_trs}
              </tbody>
          </table>
      </div>`;
    swal({
      width: '800px',
      html: _html,
      onOpen: () => {
        document.getElementById('showAllDataClose').addEventListener('click', () => {
          swal.close();
        });
      },
      position: 'top',
      showConfirmButton: false,
      showCancelButton: false,
    });
  }


}
