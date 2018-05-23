import { BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { KeysPipe } from '../../tools/pipe/keys.pipe';


@Component({
  selector: 'app-set-machine',
  templateUrl: './set-machine.component.html',
  styleUrls: ['./set-machine.component.scss']
})
export class SetMachineComponent implements OnInit {

  settings = {
    column: {
      id: {
        title: '',
        type: 'checkbox'
      },
      model: {
        title: '机型'
      },
      remark: {
        title: '备注'
      }
    }
  }

  data = [
    { id: '1', model: '128机型', remark: '', selected: false },
    { id: '2', model: '全电', remark: '', selected: true },
  ]

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  selectAll(select) {
    for (let obj of this.data) {
      obj.selected = select;
    }
  }
 
  isAllCheck(){
    for(let obj of this.data){
       if(!obj.selected){
         return false;
       }
    }
    return true;
  }

  selectOne(select, item) {
    item.selected = select;
  }

  isCheck(item){
    return item.selected;
  }

  comfirm() {
    this.bsModalRef.hide();
  }

  close() {
    this.bsModalRef.hide();
  }

}
