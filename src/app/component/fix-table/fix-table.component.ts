import { element } from 'protractor';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnChanges } from '@angular/core';
import { Http } from '@angular/http';
import { POINT_CONVERSION_HYBRID } from 'constants';

@Component({
  selector: 'app-fix-table',
  templateUrl: './fix-table.component.html',
  styleUrls: ['./fix-table.component.scss']
})
export class FixTableComponent implements OnInit, OnChanges {

  //表宽度
  //固定列宽度 w_gird_fixed 
  //非固定列宽度 w_gird_nofixed
  //表高度
  //表头高度 h_gird_head
  //表身高度 h_gird_body
  //表格实际宽度
  //排序 fa-sort fa-sort-asc fa-sort-desc

  //可增加的功能
  //表格字体位置 颜色
  //表头高度 多级表头 动态记载列 
  //表格 增删该查
  //列宽变更功能

  //表格 默认配置
  config: any = {
    headTrHeight: 45,
    bodyTrHeight: 30,
    isShowCheck: false, //是否显示
    columns: [
    ],
    operation: [
    ]
  }

  h_gird_search = '45px'; //搜索框高度
  h_gird_view = 'calc(100% - 90px)'; //表格高度
  h_gird_page = '45px'; //分页高度
  h_gird_header = '25px'; //表头高度
  h_gird_body = 'calc(100% - 40px)'; //表身显示高度
  h_gird_header_tr = '40px'; //表头tr高度
  h_gird_body_tr = '40px'; //表身tr高度
  w_gird_fixed = ''; //固定列总宽度
  w_gird_table = ''; //非固定列总宽度
  w_checkbox = 50; // 勾选列宽度
  isfixed: boolean = false; //是否存在固定列
  isfunction: boolean = false;
  i_hover = 0;
  w_gird2_inner_header = '10000px';
  w_op = 30; // 工作操作区宽度

  @Input() gwidth: number;
  @Input() settings: any;
  @Input() source: Array<any> = [];
  @Output() sortEvent = new EventEmitter<any>();
  @Output() selectEvent = new EventEmitter<any>();

  @Output() rowOperation = new EventEmitter<any>();
  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();

  scrollTop: number;
  scrollLeft: number;


  //分页
  sourceShow: Array<any> = [];
  checkedIndex: Array<number> = [];
  totalItems: number;
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 20;
  beginNum: number = 1;
  endNum: number = 1;
  maxSize: number = 10;
  pageNums = [10, 20, 50, 100];
  pages = [];
  inputPage: string;
  isPageSelectShow = false;

  //搜索
  sourceSearch: Array<any> = [];
  searchInput: string = '';

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.tableInit();
    this.bindData(true, true);
    this.pageChange();
  }

  /*-------------------------------------表格-----------------------------------*/

  /**
   * 表格初始化
   */
  tableInit() {
    if (this.settings) Object.assign(this.config, this.settings); //配置用户设置
    let w_gird_fixed = 0;
    let w_gird_table = 0;
    //计算固定和非固定部分宽度
    for (let col of this.config.columns) {
      col.width = col.width || 100; //用户没有传入width时 默认100
      if (col.fixed) {
        w_gird_fixed += col.width;
        this.isfixed = true;
      } else {
        w_gird_table += col.width;
      }
    }

    if (this.config.operation.length > 0) {
      this.isfunction = true;
      this.w_op = 30;
      this.config.operation.forEach(() => {
        this.w_op += 20;
      })
    }
    let w_cf = this.w_checkbox + (this.isfunction ? this.w_op : 0) //选择列和功能区的宽度

    //当table设置宽度不足容器宽度时自动补全宽度
    if (this.gwidth && this.gwidth > w_gird_fixed + w_gird_table + w_cf) {
      let w_dif = this.gwidth - w_gird_fixed - w_gird_table - w_cf - 20; //20 去掉纵向滚动条宽度 避免产生宽度过长产生横向滚动条
      let every = w_dif / this.config.columns.length; //每个标题列应该增加的宽度
      this.config.columns.forEach(col => {
        col.width = col.width + every;
        if (col.fixed) {
          w_gird_fixed += every;
        } else {
          w_gird_table += every;
        }
      });
    }
    //计算高度
    this.h_gird_body_tr = `${this.config.bodyTrHeight}px`;
    this.h_gird_body = `calc(100% - ${this.config.headTrHeight}px)`;
    this.h_gird_header_tr = `${this.config.headTrHeight}px`;
    this.h_gird_header = `${this.config.headTrHeight}px`; // 多级表头时需要重新计算 
    //计算宽度
    this.w_gird_fixed = (w_gird_fixed + (this.isfixed ? w_cf : 0)) + 'px';
    this.w_gird_table = (w_gird_table + (this.isfixed ? 0 : w_cf)) + 'px';
    // let reg = new RegExp(/^[0-9]+%$/);
    // this.w_gird_table = reg.test(this.config.width) ? this.config.width : this.w_gird_table;
    // this.w_gird2_inner_header = reg.test(this.config.width) ? this.config.width : this.w_gird2_inner_header;

  }

  /**
 * 滚动条事件
 * @param event 事件对象
 */
  scroll(event) {
    this.scrollTop = event.target.scrollTop;
    this.scrollLeft = event.target.scrollLeft;
  }

  /**
   * 点击排序
   * @param column 列
   */
  sort(column) {
    if (column.sortType == "fa-sort-asc") {
      column.sortType = "fa-sort-desc";
    } else {
      column.sortType = "fa-sort-asc";
    }
    console.log(this.sortEvent);
    if (this.sortEvent.observers.length > 0) { //使用自定义排序 接口返回排序字段和排序方式（asc:true 升序）
      this.sortEvent.emit({ field: column.field, asc: column.sortType == "fa-sort-asc" });
      this.search(this.searchInput);
    } else {
      this.source.sort((a, b) => {
        if (a[column.field] <= b[column.field]) {
          return column.sortType == "fa-sort-asc" ? 1 : -1;
        }
        if (a[column.field] > b[column.field]) {
          return column.sortType == "fa-sort-asc" ? -1 : 1;
        }
      });
      this.search(this.searchInput);
    }
    this.bindData(true);
    this.pageChange();
  }

  /**
   * 行选择
   * @param checked  false 全反选 true 全选
   */
  selectAllRow(checked) {
    this.checkedIndex = [];
    if (checked) {
      this.sourceShow.forEach((p, i) => this.checkedIndex.push(i));
    }
    this.selectBack();
  }

  /**
   * 行选择事件
   * @param checked false 取消选中 true 选中
   * @param i this.sourceShow行索引
   */
  selectOneRow(event, i) {
    console.log(event);
    if (event.target.checked) {
      this.checkedIndex.push(i);
      this.checkedIndex.sort((a, b) => a > b ? 1 : -1);
    } else {
      this.checkedIndex = this.checkedIndex.filter(p => p != i).sort((a, b) => a > b ? 1 : -1);
    }
    console.log(this.checkedIndex);
    this.selectBack();
    event.stopPropagation();
  }

  /**
   * 行点击事件 选中或取消选中
   * @param i this.sourceShow显示行索引
   */
  selectTr(i) {
    console.log(i, this.checkedIndex)
    if (this.checkedIndex.indexOf(i) < 0) {
      this.checkedIndex.push(i);
      this.checkedIndex.sort((a, b) => a > b ? 1 : -1);
    } else {
      this.checkedIndex = this.checkedIndex.filter(p => p != i).sort((a, b) => a > b ? 1 : -1);
    }
    this.selectBack();
  }

  /**
   * 选中行回调事件
   */
  selectBack() {
    let arr = [];
    this.checkedIndex.forEach(i => arr.push(this.sourceShow[i]));
    this.selectEvent.emit(arr);
  }

  /**
   * 判断是都全选
   */
  isAllCheck() {
    if (this.checkedIndex.length > 0 && this.checkedIndex.length == this.sourceShow.length) return true;
    return false;
  }

  /**
   * 判断行是否选中
   * @param index this.sourceShow显示行索引
   */
  isCheck(index) {
    if (this.checkedIndex.length > 0) {
      if (this.checkedIndex.indexOf(index) > -1) return true;
    }
    return false;
  }

  /**
   * 数据绑定 
   * @param isInit true 初始化 false 数据重新绑定
   * @param isSearch 
   */
  bindData(isResetPage?, isInit?) {
    if (isResetPage) {
      this.currentPage = 1; //初始化
      this.inputPage = this.currentPage + '';
    }
    if (isInit) {
      if (this.source) {
        this.sourceSearch = this.source;
      } else {
        this.sourceSearch = []
      }
    }
    this.totalItems = this.sourceSearch.length;
    this.totalPages = parseInt((this.totalItems / this.itemsPerPage).toString()) + (this.totalItems % this.itemsPerPage > 0 ? 1 : 0);
    let start: number = (this.currentPage - 1) * this.itemsPerPage;
    let end: number = start + this.itemsPerPage;
    this.sourceShow = this.sourceSearch.slice(start, end);
    this.beginNum = start + 1;
    this.endNum = start + this.sourceShow.length;
    this.checkedIndex = [];
  }


  /**
   * 功能区点击事件
   * @param op 操作事件对象
   */
  opClick(event: Event, op, item) {
    event.stopPropagation();
    op.item = item;
    this.rowOperation.emit(op);
    return false;
  }

  mouseoverTr(i){
     this.i_hover = i; 
     console.log(this.i_hover);
  }

  mouseoutTr(i){
    this.i_hover = 0; 
    console.log(this.i_hover);
  }

  /*-------------------------------------分页-----------------------------------*/

  /**
   * 分页页码显示
   */
  pageChange() {
    // let numStart = 1;
    // let numEnd = 11;  //扩展 使用maxSize+1
    // if (isInit || this.currentPage <= 6) {  
    //   numEnd = this.totalPages >= numEnd - 1 ? numEnd : this.totalPages + 1;
    // } else if (this.currentPage > 6 && (this.totalPages - this.currentPage) > 3) {
    //   numStart = this.currentPage - 5;
    //   numEnd = this.currentPage + 5;
    // } else if ((this.totalPages - this.currentPage) <= 3) {
    //   numStart = this.totalPages - 9;
    //   numEnd = this.totalPages + 1;
    // }
    // if (isInit) {
    //   this.currentPage = 1
    //   this.inputPage = this.currentPage + '';
    // };
    let numStart = 1;
    let numEnd = this.maxSize + 1;  //扩展 使用maxSize+1   10
    let numleft = parseInt((this.maxSize / 2).toString()) + 1;
    let numRight = this.maxSize - numleft - 1;
    if (this.currentPage <= numleft) {
      numEnd = this.totalPages >= numEnd - 1 ? numEnd : this.totalPages + 1;
    } else if (this.currentPage > numleft && (this.totalPages - this.currentPage) > numRight) {
      numStart = this.currentPage - (numleft - 1);
      numEnd = this.currentPage + (this.maxSize - numleft + 1);
    } else if ((this.totalPages - this.currentPage) <= numRight) {
      numStart = this.totalPages - (this.maxSize - 1);
      numStart = numStart < 1 ? 1 : numStart;
      numEnd = this.totalPages + 1;
      console.log(numStart, numEnd);
    }
    this.pages = [];
    for (let i = numStart; i < numEnd; i++) {
      this.pages.push({ text: i + '', number: i, active: i == this.currentPage });
    }
  }
  /**
   * 选择要显示第几页 
   * @param num 要显示的页码数
   * @param event 选择当前页的事件对象 
   */
  selectPage(num: any, event?: Event) {
    this.currentPage = this.limitPageNum(num); //页数超出最大页显示最大页
    this.inputPage = this.currentPage.toString();
    this.bindData();
    this.pageChange();
    return false;
  }

  /**
   * 页面显示不会超过最大值
   * @param num 当前选择页数
   */
  limitPageNum(num) {
    num = Number(num);
    if (num <= 0) num = 1;
    if (num > this.totalPages) num = this.totalPages;
    return Number(num);
  }

  /**
   * 设置当前active页
   */
  activePage() {
    this.pages.forEach(p => p.active = p.number == this.currentPage);
  }
  /**
   * 页码输入事件
   * @param event 事件对象
   */
  keydown(event) {
    if (event.keyCode == 13) {
      this.selectPage(event.target.value);
    }
  }
  keypress(event) {
    return event.keyCode >= 48 && event.keyCode <= 57
  }
  /**
   * 判断上一页和首页是否有效
   */
  noPrevious() {
    return this.currentPage <= 1;
  }

  /**
   * 判断下一页和尾页是否有效
   */
  noNext() {
    return this.currentPage >= this.totalPages;
  }
  /**
   * 页数选择按钮点击事件
   * @param event 
   */
  clickPageNum(event) {
    this.isPageSelectShow = !this.isPageSelectShow;
    event.stopPropagation();
  }
  /**
   * 选择每页显示数量
   * @param num 每页数量
   */
  selectPageNum(event) {
    this.isPageSelectShow = !this.isPageSelectShow;
    this.itemsPerPage = Number(event.target.text);
    // this.totalPages = parseInt((this.totalItems / this.itemsPerPage).toString()) + (this.totalItems % this.itemsPerPage > 0 ? 1 : 0);
    this.bindData(true);
    this.pageChange();
    return false;
  }

  /** 
   * 监听document click事件
  */
  @HostListener('document:click', ['$event'])
  onclick(event) {
    this.isPageSelectShow = false;
  }

  /*-------------------------------------搜索-----------------------------------*/
  /**
   * 搜素输入框keydown事件
   * @param event 事件对象
   */
  searchEvent(event) {
    //console.log(event.type);
    if (event.type == "keydown" && event.keyCode == 13) {
      this.search(event.target.value);
    }
    if (event.type == "blur") {
      this.search(event.target.value);
    }
  }

  /**
   * 搜索功能函数
   * @param value 搜索输入框值 
   */
  search(value) {
    //this.sourceSearch = this.source.filter(item => item["m_id"].indexOf(value.trim()) > -1);
    if (value.length > 0) {
      let arr = [];
      this.source.forEach(item => {
        let bl = false;
        for (let col of this.config.columns) {
          let colVal = item[col.field] != undefined ? item[col.field].toString() : '';
          bl = colVal.includes(value.trim());
          if (bl) {
            arr.push(item);
            break;
          }
        }
      });
      this.sourceSearch = [];
      if (arr.length > 0) this.sourceSearch = arr;
      this.bindData(true);
      this.pageChange();
    }
  }
}
