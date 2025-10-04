import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/**
 * Validation patterns used across the application
 */
export const ValidationPatterns = {
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
} as const;

/**
 * Custom validators for reactive forms
 */
export class CustomValidators {
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const value1 = formGroup.get(field1)?.value;
      const value2 = formGroup.get(field2)?.value;
      return value1 === value2 ? null : { fieldsDoNotMatch: true };
    };
  }
}

/**
 * Utilities for handling form validation and errors
 */
export class FormUtils {
  static getErrorMessage(errors: ValidationErrors): string | null {
    if (!errors) return null;

    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];

    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'minlength':
        return `Minimum of ${errorValue.requiredLength} characters.`;
      case 'min':
        return `Minimum value is ${errorValue.min}.`;
      case 'email':
        return 'The entered value is not a valid email address.';
      case 'fieldsDoNotMatch':
        return 'Fields do not match.';
      case 'pattern':
        return 'Please enter a valid format.';
      default:
        return `Validation error: ${errorKey}`;
    }
  }

  static isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);
    if (!field?.errors || !field.touched) return null;
    return this.getErrorMessage(field.errors);
  }

  static isArrayFieldInvalid(formArray: FormArray, index: number): boolean {
    const field = formArray.at(index);
    return !!(field?.errors && field.touched);
  }

  static getArrayFieldError(formArray: FormArray, index: number): string | null {
    const field = formArray.at(index);
    if (!field?.errors || !field.touched) return null;
    return this.getErrorMessage(field.errors);
  }
}
