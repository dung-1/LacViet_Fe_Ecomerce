import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Post } from '../../../model/Post';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'title',
    'fromDate',
    'toDate',
    'excerptImage',
    'categoryId',
    'actions',
  ];
  dataSource = new MatTableDataSource<Post>([]);
  categories: { id: number; name: string }[] = [];
  categoryIds: number[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dataSource.filterPredicate = (data, filter) => {
        const term = filter.trim().toLowerCase();
        return data.title.toLowerCase().includes(term);
      };
      this.loadCategories();
      this.loadPosts();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCategories(): void {
    this.apiService.get(`${ConstService.getAllCategory}`).subscribe({
      next: (data) => {
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
        } else {
          this.categories = [];
          this.categoryIds = [];
        }
      },
      error: () => {
        this.notificationService.error('Có lỗi khi tải danh mục tin tức.');
      },
    });
  }

  loadPosts(): void {
    this.apiService.get(`${ConstService.getAllPost}`).subscribe({
      next: (data: Post[]) => {
        const filtered = data
          .filter((post) => this.categoryIds.includes(post.categoryId))
          .sort((a, b) => {
            const dateA = a.modifiedTime
              ? new Date(a.modifiedTime).getTime()
              : 0;
            const dateB = b.modifiedTime
              ? new Date(b.modifiedTime).getTime()
              : 0;
            return dateB - dateA;
          });
        this.dataSource.data = filtered;
      },
      error: () => {
        this.notificationService.error('Có lỗi khi tải tin tức.');
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${ConstService.serverHost()}/${imageUrl}`;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  deletePost(postId: number): void {
    const dialogData: ConfirmDialogData = {
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa bài viết này?',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
    };
    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data: dialogData })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.apiService
            .delete(`${ConstService.deletePost}/${postId}`)
            .subscribe({
              next: () => {
                this.notificationService.success('Xóa tin tức thành công.');
                this.loadPosts();
              },
              error: () => {
                this.notificationService.error('Không thể xóa tin tức.');
              },
            });
        }
      });
  }

  editPost(postId: number): void {
    this.router.navigate(['/post/edit', postId]);
  }
}
