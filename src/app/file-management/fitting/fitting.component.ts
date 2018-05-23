import { Component, OnInit } from '@angular/core';
import { Global } from '../../tools/services/global';

import * as $ from 'jquery';
import swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-fitting',
  templateUrl: './fitting.component.html',
  styleUrls: ['./fitting.component.scss']
})
export class FittingComponent implements OnInit {

  module_table_thead: Array<string> = ['配件型号', '生产时间', '启用时间', '停用时间', '说明'];
  module_table_tbody: Array<Object> = [];
  module_table_attr: Array<string> = ['id', 'pro_time', 's_time', 'e_time', 'ucomm'];

  machine: any;
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
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }
  /*分页部分 */
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
  //改变显示信息的条数
  changeCount() {
    this.current_page = 1;
    this.firstPage();
  }
  /* 增删改 */
  add() {
    let _html = `
    <style>
    .fittingAdd{font-size:16px;}
    .fittingAdd label{width:37%;text-align:right;}
    .fittingAdd select{font-size:14px;height:24px;}
    .fittingAdd>li{line-height:24px;text-align:left;}
     </style>
    <ul class="fittingAdd">
    <li><label>配件型号: </label><input type="text" id="clientid"/></li>
    <li><label>生产时间: </label><input type="date" id="clientid"/></li>
    <li><label>启用时间: </label><input type="date" id="clientid"/></li>
    <li><label>停用时间:</label><input type="date" id="name"/></li>
    <li><label style='float:left'>说明:</label><textarea name="" id="notes"></textarea>
    </li>
  </ul>`;
    swal({
      title: "添加",
      width: '600px',
      html: _html,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      position: 'top',
    }).then((result) => { }).catch(swal.noop);
  }

  edit() {

  }

  delete() {

  }
  /* */
  close() {
    this.bsModalRef.hide();
  }
}
