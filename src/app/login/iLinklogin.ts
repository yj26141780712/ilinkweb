import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as $ from 'jquery';  //定义jquery
import swal from 'sweetalert2';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Global, GlobalService } from '../tools/services/global';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'iLinklogin',
  templateUrl: './iLinklogin.html', 
  styleUrls: ['./iLinklogin.scss'] 
})
export class iLinklogin implements OnInit {
  show_login: boolean = true;
  loginInfo = {
    username: '',
    password: '',
    isRemember: false
  };
  config = {
    ignoreBackdropClick: true,
    class: "modal-sm"
  };
  bsModalRef: BsModalRef;
  constructor(private router: Router, private gs: GlobalService, private modalService: BsModalService, private http: Http) {

  }
  ngOnInit() {
    this.loginInfo.username = localStorage.getItem('username');
    this.loginInfo.password = localStorage.getItem('password');
    this.loginInfo.isRemember = localStorage.getItem('isRemember') && localStorage.getItem('isRemember') == "true";
    $('body').height($(window).height());
    $('.login_view').hide();
    //自动登陆
  }

  gotoMap() {
    this.http.get(Global.domain + 'api/apilogin?username=' + this.loginInfo.username + '&password=' + this.loginInfo.password).subscribe(res => {
      let json = res.json();
      if (json.code == 200) { 
        console.log(json);
        localStorage.setItem('username', this.loginInfo.username);
        localStorage.setItem('isRemember', this.loginInfo.isRemember + '');
        localStorage.setItem('companyId', json.obj.companyid || ''); // add by yangjie 20180426 || ''
        localStorage.setItem('id', json.obj.id);
        localStorage.setItem('companyName', json.obj.companyName);
        localStorage.setItem('roleName', json.obj.roleName);
        localStorage.setItem('ltoken', json.obj.ltoken); //长token;
        localStorage.setItem('stoken', json.obj.stoken);
        if (this.loginInfo.isRemember) {
          localStorage.setItem('password', this.loginInfo.password); // 缺少安全处理
        } else {
          localStorage.removeItem('password');
        }
        // if (this.loginInfo.isAuto) {
        //   localStorage.setItem('lastTime', new Date().getTime() + '');
        // } else {
        //   localStorage.removeItem('lastTime')
        // }
        this.router.navigate(['/home']);//跳转
      } else {
        swal("出错了", "用户名密码错误！", 'warning');
        return false;
      }
    });
  }


  register() {
    this.bsModalRef = this.modalService.show(RegisterComponent, this.config);
  }

}

