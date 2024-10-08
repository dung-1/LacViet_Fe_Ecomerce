import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConstService } from '../const.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
  ) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  endpoint: string = ConstService.serverHost();

  get(bareURl: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${bareURl}`, {
      headers: this.headers,
    });
  }

  post(bareURl: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/${bareURl}`, body, {
      headers: this.headers,
    });
  }
  put(bareURl: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${bareURl}`, body, {
      headers: this.headers,
    });
  }

  delete(bareURl: string): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${bareURl}`, {
      headers: this.headers,
    });
  }

  postFormData(bareUrl: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/${bareUrl}`, formData);
  }
  putFormData(bareUrl: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${bareUrl}`, formData);
  }
}