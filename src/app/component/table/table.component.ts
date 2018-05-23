import { MachineService } from './../../tools/services/machine.service';
import { Component, OnInit, Input, Output, OnChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Global } from '../../tools/services/global';
import * as $ from 'jquery'; 
 
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html', 
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  bsModalRef: BsModalRef;
  @Input() settings: any;
  @Input() source: any;
  module_table_thead: Array<string>;//表头的遍历(中文)
  module_table_tbody = [];//表身的数据
  module_table_attr: Array<string>; //表身的属性数组
  module_table_search: any;
  operations: Array<any> = [];

  @Output() operationEvent = new EventEmitter<any>();
  @Output() addEvent = new EventEmitter();

  url: string = Global.domain + 'api/';
  companyId: any;
  total_data = [];//获取到的信息总数
  tbody_show_count: number = 10;//显示几条
  sort_show: boolean;//是否显示排序
  sort_flag: number = 2;//0升序，1降序，2双向箭头
  total_count: number = 0;//总信息数
  page_data = [];//当前页面数据
  current_page: number = 1;//当前页数
  beginNum: number;
  endNum: number;
  pages: number = 1;  //总页数
  isAdd: boolean = false;
  isfunction: boolean = false;
  constructor(private ms: MachineService) { }

  ngOnInit() {
    if (this.module_table_search != undefined) {
      document.getElementById('searchAttribute').setAttribute('placeholder', this.module_table_search.name);
    }
    this.companyId = localStorage.getItem('companyId');
    this.isAdd = this.addEvent.observers.length > 0;
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
    console.log(this.source);
    this.current_page = 1;
    if (this.settings) {
      this.module_table_thead = [];
      this.module_table_attr = [];
      this.settings.columns.forEach(obj => {
        this.module_table_thead.push(obj.title);
        this.module_table_attr.push(obj.field);
      });
      this.module_table_search = this.settings.search;
      this.operations = [];
      this.settings.operation.forEach(obj => {
        this.operations.push(obj);
      });
      this.isfunction = this.operations.length > 0;
    }
    if (this.source) {
      this.module_table_tbody = [];
      this.source.forEach(obj => {
        this.module_table_tbody.push(obj);
      });
    }
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
  //搜索
  searchAttr(attr) {
    let searchField = this.module_table_search.search;
    if (searchField) {
      if (attr.value == "") {
        this.module_table_tbody = [].concat(this.total_data);
      } else {
        var array = [];
        for (var i = 0; i < this.total_data.length; i++) {
          if (this.total_data[i][searchField] && this.total_data[i][searchField].indexOf(attr.value) > -1) {
            array.push(this.total_data[i]);
          }
        }
        this.module_table_tbody = [].concat(array);
      }
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

  /**
 * 功能区点击事件
 * @param event 事件对象
 * @param op 功能操作事件对象
 * @param item 操作项
 */
  opClick(event: Event, op, item) {
    console.log(item);
    op.callBack(item);
    event.stopPropagation();
  }

  /**
   * 新增事件
   */
  add() {
    //console.log(this.addEvent.observers.length);
    this.addEvent.emit();
  }
}
