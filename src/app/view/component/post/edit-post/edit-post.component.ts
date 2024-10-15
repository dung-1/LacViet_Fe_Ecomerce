import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileInfo, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { ApiService } from '../../../../service/Api/api.service';
import { NotificationService } from '../../../../service/Notification/notification.service';
import { ConstService } from '../../../../service/const.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditPostComponent implements OnInit {
  post: any = {};
  postId: number;

  @ViewChild('defaultupload')
  public uploaderObj: UploaderComponent;

  selectedFile: FileInfo | null = null;
  categories: { id: number; name: string }[] = [];
  vegetableData: { [key: string]: Object }[] = [];
  groupWaterMark: string = 'Chọn thể loại';
  height: string = '200px';
  groupFields: Object = { text: 'name', value: 'id' };
  public path: Object = {
    saveUrl:
      'https://services.syncfusion.com/angular/production/api/FileUploader/Save',
    removeUrl:
      'https://services.syncfusion.com/angular/production/api/FileUploader/Remove',
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
      this.loadPost();
    });
    this.loadCategories();
  }

  loadPost(): void {
    this.apiService
      .get(`${ConstService.updatePostID}/${this.postId}`)
      .subscribe(
        (data) => {
          this.post = data;
        },
        (error) => {
          console.error('Error loading post', error);
          this.notificationService.error(
            'Có lỗi xảy ra khi tải thông tin bài viết.'
          );
        }
      );
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

  updatePost(): void {
    const formData: FormData = new FormData();
    formData.append('id', this.post.id.toString());
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('categoryId', this.post.categoryId.toString());
    formData.append('fromDate', this.post.fromDate);
    formData.append('toDate', this.post.toDate);

    if (this.selectedFile && this.selectedFile instanceof File) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    this.apiService
      .putFormData(`${ConstService.updatePost}/${this.post.id}`, formData)
      .subscribe(
        () => {
          this.notificationService.success('Cập nhật bài viết thành công.');
          this.router.navigate(['/post']);
        },
        (error) => {
          console.error('Có lỗi xảy ra khi cập nhật bài viết:', error);
          this.notificationService.error(
            'Có lỗi xảy ra khi cập nhật bài viết.'
          );
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
          this.vegetableData = this.categories;
        } else {
          this.categories = [];
        }
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }
}
