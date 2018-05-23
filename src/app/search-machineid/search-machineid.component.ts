import { GlobalService } from './../tools/services/global';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';//sweetalert2
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Global } from '../tools/services/global';

@Component({
  selector: 'app-search-machineid',
  templateUrl: './search-machineid.component.html',
  styleUrls: ['./search-machineid.component.scss']
})

export class SearchMachineidComponent implements OnInit {
  data: any;
  companyId: any;
  MachineDatas: any;//所有的数据 
  page_data: any;//当页数据
  current_page: number = 1;//当前页数
  total_count: number;//总页数
  detail_Machine: any = { id: "", name: "", out_date: "", province: "", position: "", monitorid: "" };//单台的详细数据
  search_data: any;//搜索的数据
  @Output() monitoridEvent = new EventEmitter();
  @Input() Mapmid: any;

  constructor(private gs: GlobalService) {

  }

  ngOnInit() {
    this.getMachineID(() => {
      var array = [];
      for (var i = 0; i < this.data.length; i++) {
        var item = { id: "", name: "", monitorid: "", out_date: "", province: "", position: "", states: "" };
        item.id = this.data[i].sn;
        item.name = this.data[i].name;
        item.monitorid = this.data[i].monitorid;
        item.out_date = this.data[i].ddate != null ? this.data[i].ddate.substring(0, 10) : "暂无";
        item.province = this.data[i].city;
        item.position = this.data[i].road;
        item.states = this.data[i].workstate;
        array.push(item);
      }
      this.MachineDatas = [].concat(array);
      this.page_data = this.MachineDatas.slice(0, 10);
      //localstorage
      var current_monitorid = window.localStorage.getItem('current_monitorid');
      if (current_monitorid != undefined) {
        this.gs.httpGet(Global.domain + 'api/deviceInfo.action?mid=' + current_monitorid, {}, json => {
          if (json.obj.monitorid) { //add by yangjie 20180426 增加判断 正式和测试机mid不匹配缓存会影响
            var data = json.obj;
            this.detail_Machine.id = data.sn;
            this.detail_Machine.name = data.name;
            this.detail_Machine.out_date = data.ddate != null ? data.ddate.substring(0, 10) : "暂无";
            this.detail_Machine.province = data.city;
            this.detail_Machine.position = data.road;
            this.monitoridEvent.emit(data.monitorid);
          }
        })
      }
      if (this.Mapmid == undefined && current_monitorid == undefined) {
        //单台的详细数据
        this.detail_Machine.id = this.MachineDatas[0].id;
        this.detail_Machine.name = this.MachineDatas[0].name;
        this.detail_Machine.out_date = this.MachineDatas[0].out_date;
        this.detail_Machine.province = this.MachineDatas[0].province;
        this.detail_Machine.position = this.MachineDatas[0].position;
        this.monitoridEvent.emit(this.MachineDatas[0].monitorid);
      }
    });
  }
  //内容投射进组件
  ngAfterContentInit() {
    //地图点击跳转过来
    if (this.Mapmid != undefined) {
      window.localStorage.setItem('current_monitorid', this.Mapmid);
      this.gs.httpGet(Global.domain + 'api/deviceInfo.action?mid=' + this.Mapmid, {}, json => {
        var data = json.obj;
        this.detail_Machine.id = data.sn;
        this.detail_Machine.name = data.name;
        this.detail_Machine.out_date = data.ddate != null ? data.ddate.substring(0, 10) : "暂无";
        this.detail_Machine.province = data.city;
        this.detail_Machine.position = data.road;
        this.monitoridEvent.emit(data.monitorid);
      })
    }
  }
  selectMID() {
    var new_tr = "";
    for (var i = 0; i < this.page_data.length; i++) {
      new_tr += "<tr><td>" + this.page_data[i].id + "</td><td>" + this.page_data[i].name + "</td><td>" + this.page_data[i].states + "</td><td><button class=\"btn btn-primary\" style=\"border-radius:0px;line-height:1rem;\">选择</button></td></tr>";
    }
    var new_btn = "";
    for (var j = 0; j < this.total_count; j++) {
      new_btn += "<button class=\"btn btn-default\">" + (j + 1) + "</button>";
    }
    var html =
      `
      <style>
        table button{color:#fff;background-color:#307ecc;line-height:1rem;}
        .btn-group button{color:#307ecc;border-radius:0px;}
        .btn-group button:hover{background-color:#307ecc;color:#fff;}
      }
      </style>
      <div class="search_Mid" style="border-top:1px solid #ccc;font-size:1.3rem;text-align:left;" id="search_Mid">
      <div class="search_Mid_header" style="padding:1rem 0rem;overflow:hidden;">
        <p style="display:inline-block;width:300px;" id="search_Mid_Message">显示第`+
      ((this.current_page - 1) * 10 + 1) + `至第` + (this.current_page * 10)
      + `项的结果，共` +
      this.MachineDatas.length + `项</p>
        <span style="display:inline-block;float:right;text-align:right;width:200px;">搜索：<input type="text" style="width:100px;" placeholder="编号" id="searchMid"></span>
      </div>
      <div class="search_Mid_body" style="overflow:hidden;">
        <table class="table table-striped table-hover table-bordered">
          <thead style="background:linear-gradient(to bottom, #fcfcfc 20%, #eee 100%);color:#307ecc;">
            <tr>
              <td>编号</td>
              <td>名称</td>
              <td>最近状态</td>
              <td>&nbsp;</td>
            </tr>
          </thead>
          <tbody id="table_tbody">`+
      new_tr +
      `</tbody>
        </table>
        <div class="btn-group" style="float:right;" id="filp_btn">
          <button type="button" class="btn btn-default" id="prev_btn">上页</button>`+
      new_btn +
      `<button type="button" class="btn btn-default" id="next_btn">下页</button>
        </div>
      </div>
    </div>
      `;
    swal({
      title: "注塑机列表",
      width: '600px',
      html: html,
      showConfirmButton: false,
      position: 'top',
      onOpen: () => {
        this.setData(this.MachineDatas);
        this.searchId();
        //this.filp_page();
        //this.searchId();
      }
    }).catch(swal.noop);
  }
  //接口
  getMachineID(callback) {
    this.companyId = localStorage.getItem('companyId');
    this.gs.httpGet(Global.domain + 'api/apideviceList.action?companyId=' + this.companyId || '', {}, json => {
      //根据companyId筛选
      var array = [];
      for (var i = 0; i < json.obj.length; i++) {
        array.push(json.obj[i]);
      }
      this.data = [].concat(array);
      callback();
    })
  }
  //数据变化
  dynamicData(data, str) {
    switch (str) {
      case "上页":
        if (this.current_page > 1) {
          this.current_page--;
          this.page_data = data.slice((this.current_page - 1) * 10, (this.current_page) * 10);
        }
        break;
      case "下页":
        if (this.current_page < this.total_count) {
          this.current_page++;
          this.page_data = data.slice((this.current_page - 1) * 10, (this.current_page) * 10);
        }
        break;
      default:
        this.current_page = parseInt(str);
        this.page_data = data.slice((this.current_page - 1) * 10, (this.current_page) * 10);
        break;
    }
    var new_tr = "";
    for (var i = 0; i < this.page_data.length; i++) {
      new_tr += "<tr><td>" + this.page_data[i].id + "</td><td>" + this.page_data[i].name + "</td><td>" + this.page_data[i].states + "</td><td><button class=\"btn btn-primary\" style=\"border-radius:0px;line-height:1rem;\">选择</button></td></tr>";
    }
    document.getElementById('table_tbody').innerHTML = new_tr;
    var endCount = this.current_page * 10 > data.length ? data.length : this.current_page * 10;
    document.getElementById('search_Mid_Message').innerText = `显示第` +
      ((this.current_page - 1) * 10 + 1) + `至第` + endCount + `项的结果，共` +
      data.length + `项`;
    this.selectMachineid();
  }
  //按钮翻页
  filp_page(data) {
    var that = this;
    for (var i = 0; i < document.getElementById('filp_btn').children.length; i++) {
      document.getElementById('filp_btn').children[i].addEventListener('click', function () {
        var text = this.innerHTML;
        that.dynamicData(data, text);
      })
    }
  }
  //选择
  selectMachineid() {
    var that = this;
    for (var i = 0; i < document.getElementById('table_tbody').getElementsByTagName('button').length; i++) {
      document.getElementById('table_tbody').getElementsByTagName('button')[i].addEventListener('click', function () {
        var text = this.parentElement.parentElement.children[0].innerHTML;
        for (var i = 0; i < that.MachineDatas.length; i++) {
          if (that.MachineDatas[i].id == text) {
            that.detail_Machine.id = that.MachineDatas[i].id;
            that.detail_Machine.name = that.MachineDatas[i].name;
            that.detail_Machine.out_date = that.MachineDatas[i].out_date;
            that.detail_Machine.province = that.MachineDatas[i].province;
            that.detail_Machine.position = that.MachineDatas[i].position;
            that.monitoridEvent.emit(that.MachineDatas[i].monitorid);
            window.localStorage.setItem('current_monitorid', that.MachineDatas[i].monitorid);//在本地设置当前的机器编号
          }
        }
        swal.close();
      })
    }
  }
  //input键入
  searchId() {
    var that = this;
    document.getElementById('searchMid').addEventListener('keyup', function () {
      var text = (this as HTMLInputElement).value;//类型转换
      var array = [];
      if (text != "") {
        for (var i = 0; i < that.MachineDatas.length; i++) {
          if (that.MachineDatas[i].id.indexOf(text) > 0) {
            array.push(that.MachineDatas[i]);
          }
        }
        that.search_data = [].concat(array);
        that.search_data = array;
        that.setData(that.search_data);
      } else {
        that.setData(that.MachineDatas);
      }
    })
  }
  //搜索的数据处理
  setData(data) {
    this.current_page = 1;
    this.total_count = Math.ceil(data.length / 10);
    var slice_data = data.slice(0, 10);
    //按钮设置
    var new_btn = "";
    for (var j = 0; j < this.total_count; j++) {
      new_btn += "<button class=\"btn btn-default\">" + (j + 1) + "</button>";
    }
    document.getElementById('filp_btn').innerHTML = `<button type="button" class="btn btn-default" id="prev_btn">上页</button>` + new_btn + `<button type="button" class="btn btn-default" id="next_btn">下页</button>`;
    //信息设置
    var new_tr = "";
    for (var i = 0; i < slice_data.length; i++) {
      new_tr += "<tr><td>" + slice_data[i].id + "</td><td>" + slice_data[i].name + "</td><td>" + slice_data[i].states + "</td><td><button class=\"btn btn-primary\" style=\"border-radius:0px;line-height:1rem;\">选择</button></td></tr>";
    }
    document.getElementById('table_tbody').innerHTML = new_tr;
    //message
    document.getElementById('search_Mid_Message').innerHTML = `显示第` +
      ((this.current_page - 1) * 10 + 1) + `至第` + (this.current_page * 10)
      + `项的结果，共` +
      data.length + `项`;
    //设置翻页
    if (this.total_count != 1) {
      this.filp_page(data);
    }
    this.selectMachineid();
  }

}
