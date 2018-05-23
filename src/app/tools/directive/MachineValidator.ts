import { MachineService } from './../services/machine.service';
import { AbstractControl, ValidatorFn, AsyncValidatorFn } from "@angular/forms";
import { Injectable } from '@angular/core';

@Injectable()
export class MachineValidator {
    constructor(private ms: MachineService) { }
    checkRepeatMonitor(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<{ [key: string]: any }> => {
            return new Promise((resolve, reject) => {
                let value = control.value;
                console.log(value);
                this.ms.checkRepeatMonitor(value).subscribe(json => {
                    if (json.code == 201) {
                        resolve({ Repeat: { value: value }})
                    } else {
                        resolve(null);
                    }
                })
            })
        }
    }
}