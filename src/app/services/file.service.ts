import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AppConfig } from 'src/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly API_URL = '/file/contrato/';

  private appConfig = new AppConfig();

  constructor(private http: HttpClient) { }

  upLoadFile(files: Set<File>, fileNames: string[]) {
    const formData = new FormData(); // Contem todos os arquivos a ser enviados.
    // files.forEach(file => formData.append('file', file, file.name));
    for (let i = 1; i <= files.size; i++) {
      formData.append('file', files[i], fileNames[i - 1]);
    }

    // Ou esse (Por tráz dos panos)
    // const request = new HttpRequest('POST', `${this.appConfig.getRestBaseUrl()}${this.API_URL}`, formData );
    // return this.http.request(request);

    // Ou esse (Forma resumida)
    return this.http.post( `${this.appConfig.getRestBaseUrl()}${this.API_URL}`, formData, {
      observe: 'events',
      reportProgress: true
    });
  }
}
