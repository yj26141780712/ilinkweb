import { ClientService } from './../../tools/services/client.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ThrowStmt } from '@angular/compiler';
import { MachineService } from '../../tools/services/machine.service';

@Component({
  selector: 'app-set-factory',
  templateUrl: './set-factory.component.html',
  styleUrls: ['./set-factory.component.scss']
})
export class SetFactoryComponent implements OnInit {

  companyId: string;
  title: string = '指定工厂'
  factoryForm: FormGroup;
  factorys = [];
  item: any;
  constructor(private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private cs: ClientService,
    private ms: MachineService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.createForm();
    this.item = this.modalService.config.initialState['item'];
    console.log(this.item);
    this.bindSelect();
  }

  createForm() {
    this.factoryForm = this.fb.group({
      'factory': ['', Validators.required]
    })
  }

  bindSelect() {
    this.factorys = [];
    this.cs.getClientList(this.companyId).subscribe(json => {
      if (json.code = 200) {
        json.obj.forEach(obj => {
          this.factorys.push({
            id: obj.clientId,
            name: obj.clientName
          });
          if (this.item.plasticCompany == obj.clientName) this.factoryForm.controls['factory'].setValue(obj.clientId);
        });
      }
    });
  }

  close() {
    this.bsModalRef.hide();
  }

  submit(formValue) {
    this.ms.setFactory(this.item.id, this.companyId, formValue.factory, this.item.moniterId).subscribe(json => {
      if (json.code == 200) {
        this.ms.machineSubject.next();
        this.close();
      }
    });
  }
}
