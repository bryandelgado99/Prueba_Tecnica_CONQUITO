// form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonService } from '../../services/persons.service';
import { Person } from '../../models/persons.model';
import {MatError, MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatSelect} from '@angular/material/select';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOption} from '@angular/material/core';
import {NgForOf, NgIf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {FilePreviewPipe} from '../../pipes/file-preview.pipe';

@Component({
  selector: 'app-person-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatDialogContent,
    MatLabel,
    MatError,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    NgIf,
    NgForOf,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    FilePreviewPipe,
    MatFabButton
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
})
export class PersonFormComponent implements OnInit {
  personForm!: FormGroup;
  professions = ['Ingeniero', 'Médico', 'Abogado', 'Profesor', 'Desarrollador de Software', 'Entrenador/a Deportiva', ' Diseñador/a Gráfico/a'];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { person: Person }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.person;

    this.personForm = this.fb.group({
      first_name: [{ value: this.data?.person?.first_name || '', disabled: false }, Validators.required],
      last_name: [{ value: this.data?.person?.last_name || '', disabled: false }, Validators.required],
      birth_date: [{ value: this.data?.person?.birth_date || '', disabled: false }, Validators.required],
      age: [{ value: this.data?.person?.birth_date ? this.calculateAge(this.data.person.birth_date) : null, disabled: true }],
      profession: [this.data?.person?.profession || '', Validators.required],
      address: [this.data?.person?.address || '', Validators.required],
      phone: [this.data?.person?.phone || '', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      photo: [null]
    });
  }

  calculateAge(dateString: string): number {
    if (!dateString) return 0;
    const birthDate = new Date(dateString);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  onBirthDateChange(event: any): void {
    const birthDate = event.value;
    const age = this.calculateAge(birthDate);
    this.personForm.get('age')?.setValue(age);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.personForm.patchValue({ photo: file });
      this.personForm.get('photo')?.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.personForm.controls).forEach(key => {
      const control = this.personForm.get(key);
      if (control?.value !== null) {
        formData.append(key, control?.value);
      }
    });

    if (this.isEditMode && this.data?.person?.id) {
      this.personService.updatePerson(this.data.person.id, formData as any).subscribe({
        next: () => {
          this.snackBar.open('Persona actualizada correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: err => this.snackBar.open(err.message, 'Cerrar', { duration: 5000 })
      });
    } else {
      this.personService.createPerson(formData as any).subscribe({
        next: () => {
          this.snackBar.open('Persona creada correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: err => this.snackBar.open(err.message, 'Cerrar', { duration: 5000 })
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
