import { GlobalService } from './../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { selectAddress } from "./selectAddress";
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import * as $ from 'jquery';
import * as AlertModule from 'bootstrap';
import { Global } from '../tools/services/global';

@Component({
  selector: 'app-remotely',
  templateUrl: './remotely.component.html',
  styleUrls: ['./remotely.component.scss']
})
export class RemotelyComponent implements OnInit {
  navigations: Array<string> = ['主页', '远程控制', '通信诊断'];
  current_mid: any;
  msg: any = "";
  isSelect: boolean = false;//打开弹框
  constructor(private gs: GlobalService) { }

  ngOnInit() {
    $('.selectAddress').height($('body').height()).width($('body').width());
  }
  openModal() {
    $('.selectAddress').show();
    this.isSelect = true;
  }
  hide() {
    $('.selectAddress').hide();
  }
  getMonitorEvent(mid) {
    this.current_mid = mid;
  }
  getAddress(code) {//选择地址
    if (code != null) {
      $("#input_Address").val(code);
    }
    $(".selectAddress").hide();
    this.isSelect = false;
  }
  submitCommunite(length, address) {
    this.gs.httpGet(Global.domain + 'api/remotetestSend.action?mid=' + this.current_mid + '&addr=' + address.value + '&len=' + length.value + '', {}, json => {
      //this.msg=json.msg;
      this.msg += "$>addr=" + address.value + "  len=" + length.value + "\n#>" + json.msg + "\n";
    })
  }
}
