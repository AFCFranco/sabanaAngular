import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class BirthdayValidator {
  static birthdayValidator(control: AbstractControl) {

    if (control == null || control.value == null) {
      return null;
    }
    const controlDate = moment(control.value, 'YYYY-MM-DD', true);
    if (!controlDate.isValid()) {
      return { 'formatBirthday': true };
    }
    return null;
  }
}
