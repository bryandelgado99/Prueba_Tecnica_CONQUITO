import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filePreview',
  standalone: true // si usas Angular standalone
})
export class FilePreviewPipe implements PipeTransform {

  transform(file: File | string | null): string | null {
    if (!file) return null;

    // Si ya viene una URL (ejemplo al editar persona)
    if (typeof file === 'string') {
      return file;
    }

    // Si es un objeto File, creamos URL temporal
    return URL.createObjectURL(file);
  }
}
