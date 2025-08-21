import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PersonService } from '../../services/persons.service';
import { Person } from '../../models/persons.model';
import {PersonFormComponent} from '@views/form/form.component';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatToolbarModule,
    MatTooltip
  ],
  templateUrl: "persons-list.component.html",
  styleUrl: "persons-list.component.scss"
})
export class PersonListComponent implements OnInit {
  private personService = inject(PersonService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  persons: Person[] = [];
  loading = false;
  error: string | null = null;

  displayedColumns = ['id', 'first_name', 'last_name', 'birth_date', 'phone', 'age', 'profession', 'actions'];

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading = true;
    this.error = null;

    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons;
        this.loading = false;

        if (persons.length > 0) {
          this.snackBar.open(`${persons.length} personas cargadas correctamente`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  onAddPerson(): void {
    const dialogRef = this.dialog.open(PersonFormComponent, { width: '800px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPersons(); // función que recarga la lista de personas
      }
    });
  }

  onEditPerson(person: Person): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      width: '800px',
      data: { person }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPersons();
      }
    });
  }


  onDeletePerson(person: Person): void {
    // TODO: Abrir diálogo de confirmación y eliminar
    this.snackBar.open(`Función "Eliminar ${person.first_name}" pendiente de implementar`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  trackByPersonId(index: number, person: Person): number {
    return <number>person.id;
  }
}
