import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment as env_dev } from '../../environments/environment';
import { environment as env } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private http: HttpClient) {}
  public static serverHost(): string {
    return isDevMode() ? 'https://localhost:7074' : '';
  }

  public static readonly FREQUENCY = {};

  /* Category */
  public static readonly getAllCategory = 'api/Category';
  public static addCategory = 'api/Category';
  public static updateCategory = 'api/Category';
  public static deleteCategory = 'api/Category';

  /* Product */
  public static readonly getAllProduct = 'api/Product';
  public static readonly addProduct = 'api/Product';
  public static readonly updateProduct = 'api/Product';
  public static readonly deleteProduct = 'api/Product';


}