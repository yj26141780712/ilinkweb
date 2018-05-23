import { GlobalService } from './../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Http } from '@angular/http';
import { Global } from '../tools/services/global';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  isUserNameRepeat: boolean = false;

  info = {
    factory: "",
    username: "",
    password: "",
    passwordRe: ""
  }

  constructor(private http: Http, private gs: GlobalService, public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  close() {
    this.bsModalRef.hide();
  }

  reset() {
    for (let key in this.info) {
      this.info[key] = "";
    }
  }

  register() {
    let url = Global.domain + "api/apiaddFactory.action";
    this.gs.httpGet(url, this.info, json => {
      if (json.code == 200) {
        this.bsModalRef.hide();
      }
    });
  }

  checkUserName(value) {
    if (value) {
      this.isUserNameRepeat = false;
      let url = Global.domain + "except/isUserNameRepeat.action?userName=" + value;
      this.gs.httpPost(url, {}, json => {
        if (json.code == 202) {
          this.isUserNameRepeat = true;
        }
      });
    }

  }
}
