import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private http: HttpClient) { }
  public static serverHost(): string {
    // return isDevMode() ? 'http://192.168.1.20': '';
        return isDevMode() ? 'http://192.168.31.207:7074': '';
  }

  public static readonly FREQUENCY = {};

  /* Category */
  public static readonly getAllCategory = 'api/Category';

  public static readonly getCategoryById = (id: number) =>
    `api/Category/${id}`;
  
  public static readonly addCategory = 'api/Category';
  
  public static readonly updateCategory = (id: number) =>
    `api/Category/${id}`;
  
  public static readonly deleteCategory = (id: number) =>
    `api/Category/${id}`;

  /* Product */
  public static readonly getAllProduct = 'api/Product';

  public static readonly getProductById = (id: number) =>
    `api/Product/${id}`;
  
  public static readonly addProduct = 'api/Product';
  
  public static readonly updateProduct = (id: number) =>
    `api/Product/${id}`;
  
  public static readonly deleteProduct = (id: number) =>
    `api/Product/${id}`;


  /* auth */
  public static readonly getAuth= 'api/auth';
 
}