import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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
    const url = `${this.endpoint}/${bareUrl}`;
    console.log('Sending PUT request to:', url);
    
    // Log ra nội dung của FormData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.put<any>(url, formData).pipe(
      tap(response => console.log('Server response:', response)),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side or network error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
}