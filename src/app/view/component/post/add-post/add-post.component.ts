import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../../../service/Api/api.service';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { ConstService } from '../../../../service/const.service';
import { isPlatformBrowser } from '@angular/common';
import { FileInfo, UploaderComponent } from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPostComponent implements OnInit {
  public post: any = {
    title: '',
    content: '',
    categoryId: '',
    fromDate: null,
    toDate: null,
    excerptImage: null,
  };

  selectedFile: FileInfo | null = null;

  categories: { id: number; name: string }[] = [];
  categoryIds: number[] = [];
  vegetableData: { [key: string]: Object }[] = [];
  groupWaterMark: string = 'Chọn thể loại';
  height: string = '200px';
  groupFields: Object = { text: 'name', value: 'id' };
  public uploaderObj: UploaderComponent;

  constructor(
    private http: HttpClient,
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  public path: Object = {
    saveUrl:
      'https://services.syncfusion.com/angular/production/api/FileUploader/Save',
    removeUrl:
      'https://services.syncfusion.com/angular/production/api/FileUploader/Remove',
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }


  onFileSelected(args: any): void {
    if (args.filesData && args.filesData.length > 0) {
      this.selectedFile = args.filesData[0].rawFile;
      this.post.excerptImage = args.filesData[0].name;
    }
  }
  
  uploadFile(): void {
    if (this.uploaderObj && this.selectedFile) {
      this.uploaderObj.upload([this.selectedFile]);
    }
  }


  addPost(): void {
    const formData: FormData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('categoryId', this.post.categoryId.toString());
    formData.append('fromDate', this.post.fromDate.toISOString());
    formData.append('toDate', this.post.toDate.toISOString());
    
    if (this.selectedFile && this.selectedFile instanceof File) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    this.apiService.postFormData(ConstService.addPost, formData).subscribe(
      () => {
        this.notificationService.success('Thêm bài viết thành công.');
        this.router.navigate(['/post']);
      },
      (error) => {
        console.error('Có lỗi xảy ra khi thêm bài viết:', error);
        this.notificationService.error('Có lỗi xảy ra khi thêm bài viết.');
      }
    );
  }  
  loadCategories(): void {
    this.apiService.get(`${ConstService.getAllCategory}`).subscribe(
      (data) => {
        const parentCategory = data.find(
          (category: { name: string }) => category.name === 'Tin tức'
        );
        if (parentCategory) {
          this.categories = data.filter(
            (category: { parentCategoryId: number }) =>
              category.parentCategoryId === parentCategory.id
          );
          this.categoryIds = this.categories.map(
            (category: { id: number }) => category.id
          );
          this.vegetableData = this.categories;
        } else {
          this.categories = [];
          this.categoryIds = [];
        }
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }
}
