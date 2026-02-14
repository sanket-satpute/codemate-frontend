import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmNewPassword = control.get('confirmNewPassword');

  if (!newPassword || !confirmNewPassword) {
    return null;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
};
