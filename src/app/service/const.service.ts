import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private http: HttpClient) { }
  public static serverHost(): string {
    // return isDevMode() ? 'http://192.168.1.20': '';
        return isDevMode() ? 'http://192.168.1.20:7074': '';
  }

  public static readonly FREQUENCY = {};

  /* Category */
  public static readonly getAllCategory = 'api/Category';
  public static addCategory = 'api/Category';
  public static updateCategory = 'api/Category/Update';
  public static deleteCategory = 'api/Category/Delete';

  /* Product */
  public static readonly getAllProduct = 'api/Product';
  public static readonly addProduct = 'api/Product';
  public static readonly updateProduct = 'api/Product/Update';
  public static readonly deleteProduct = 'api/Product/Delete';
  
  /* Post */
  public static readonly getAllPost = 'api/Post';
  public static readonly addPost = 'api/Post';
  public static readonly updatePost = 'api/Post/Update';
  public static readonly updatePostID = 'api/Post';

  public static readonly deletePost = 'api/Post/Delete';

}