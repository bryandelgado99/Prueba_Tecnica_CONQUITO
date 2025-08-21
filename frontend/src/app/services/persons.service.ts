import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Person, PersonCreateRequest, PersonResponse } from '../models/persons.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly API_URL = 'http://localhost:3000/api'; // Cambia por tu puerto del backend

  constructor(private http: HttpClient) {}

  // Obtener todas las personas
  getAllPersons(): Observable<Person[]> {
    return this.http.get<PersonResponse>(`${this.API_URL}/all`).pipe(
      map(response => {
        // Si la respuesta es un array directo, lo devuelve
        if (Array.isArray(response)) {
          return response;
        }
        // Si viene envuelto en un objeto con data
        return Array.isArray(response.data) ? response.data : [response.data];
      }),
      catchError(this.handleError)
    );
  }

  // Obtener persona por ID
  getPersonById(id: number): Observable<Person> {
    return this.http.get<PersonResponse>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        // Si viene envuelto en un objeto con data
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          return response.data as Person;
        }
        // Si es la persona directamente
        return response as unknown as Person;
      }),
      catchError(this.handleError)
    );
  }

  // Crear nueva persona
  createPerson(person: PersonCreateRequest): Observable<Person> {
    return this.http.post<PersonResponse>(`${this.API_URL}/create`, person).pipe(
      map(response => {
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          return response.data as Person;
        }
        return response as unknown as Person;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar persona
  updatePerson(id: number, person: PersonCreateRequest): Observable<Person> {
    return this.http.put<PersonResponse>(`${this.API_URL}/${id}`, person).pipe(
      map(response => {
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          return response.data as Person;
        }
        return response as unknown as Person;
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar persona
  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.';
      } else if (error.status === 404) {
        errorMessage = 'Persona no encontrada.';
      } else if (error.status === 409) {
        errorMessage = error.error?.error || 'Ya existe una persona con estos datos.';
      } else if (error.status === 400) {
        errorMessage = error.error?.error || 'Datos inválidos.';
      } else if (error.status >= 500) {
        errorMessage = 'Error interno del servidor.';
      } else {
        errorMessage = error.error?.error || `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Error en PersonService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
