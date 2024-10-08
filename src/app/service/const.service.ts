import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment as env_dev } from '../../environments/environment';
import { environment as env } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private http: HttpClient) {}
  public static serverHost(): string {
    return isDevMode() ? env_dev.REST_API_SERVER : env.REST_API_SERVER;
  }

  public static readonly FREQUENCY = {};

  /* Category */
  public static readonly listCategory = 'api/Category';
  /* Product */
  public static readonly listProduct = 'api/Product';

}