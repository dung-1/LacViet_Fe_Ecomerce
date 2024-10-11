import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Category } from '../../../model/Category';
import { Post } from '../../../model/Post';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {

  }
  categoryIds: number[] = [];
  currentPostImage: string | null = null;
  addPostForm!: FormGroup;
  selectedFile!: File | null;
  offset = 0;
  filteredPost: Post[] = [];
  Post: Post[] = [
    { id: 1, name: '', price: 1, image: '', categoryId: 1 },
  ];
  categories = [{ id: 1, name: 'Category 1' }];
  editMode = false;
  currentPostId: number | null = null;
  editPostForm: FormGroup;

  AllPost: Post[] = [];
  totalItems: Post[] = [];

  filteredCategories: Category[] = [];

  onPage(event: any) {
    this.offset = event.offset;
  }
  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${ConstService.serverHost()}/${imageUrl}`;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.addPostForm.patchValue({ image: file.name });
      this.editPostForm.patchValue({ image: file.name });
    } else {
      this.selectedFile = null;
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
      this.loadPosts();
    }
  } 
  loadCategories(): void {
    this.apiService.get(`${ConstService.getAllCategory}`).subscribe(
      (data) => {
        const parentCategory = data.find((category: { name: string; }) => category.name === 'Sản phẩm');
        if (parentCategory) {
          this.categories = data.filter((category: { parentCategoryId: number; }) => category.parentCategoryId === parentCategory.id);
          this.categoryIds = this.categories.map((category: { id: number }) => category.id);
        } else {
          this.categories = [];
          this.categoryIds = [];
        }
        console.log(this.categories);
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }
  

  loadPosts() {
    this.apiService.get(`${ConstService.getAllPost}`).subscribe(
      (data: Post[]) => {
        this.AllPost = data.filter((Post: { categoryId: number }) => 
          this.categoryIds.includes(Post.categoryId)
        );
        this.AllPost.sort((a, b) => {
          const dateA = a.modifiedTime ? new Date(a.modifiedTime).getTime() : 0;
          const dateB = b.modifiedTime ? new Date(b.modifiedTime).getTime() : 0;
          return dateB - dateA;
        });
        this.totalItems = this.AllPost;
        this.filteredPost = this.AllPost.slice(this.offset, this.offset + 5);
      },      (error) => {
        console.error('Error fetching Post:', error);
      }
    );
  }

  deletePost(PostId: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Bạn sẽ không thể khôi phục lại dữ liệu này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, xóa nó!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
          .delete(`${ConstService.deletePost}/${PostId}`)
          .subscribe(
            (response) => {
              this.notificationService.success('Xóa sản phẩm thành công.');
              this.loadPosts();
            },
            (error) => {
              this.notificationService.error('Không thể xóa sản phẩm.');
            }
          );
      }
    });
  }



}
