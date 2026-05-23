import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../../model/Category';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';
import {
  CategoryFormDialogComponent,
  CategoryFormDialogData,
} from '../../shared/category-form-dialog/category-form-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const term = filter.trim().toLowerCase();
      return data.name.toLowerCase().includes(term);
    };
    this.loadCategory();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadCategory();
  }

  loadCategory(): void {
    this.apiService.get(ConstService.getAllCategory).subscribe({
      next: (data: Category[]) => {
        this.dataSource.data = data.sort((a, b) => {
          const dateA = a.modifiedTime ? new Date(a.modifiedTime).getTime() : 0;
          const dateB = b.modifiedTime ? new Date(b.modifiedTime).getTime() : 0;
          return dateB - dateA;
        });
      },
      error: () => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách thể loại.'
        );
      },
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openAddDialog(): void {
    const dialogData: CategoryFormDialogData = { mode: 'add' };
    this.dialog
      .open(CategoryFormDialogComponent, { width: '480px', data: dialogData })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveNewCategory(result);
        }
      });
  }

  openEditDialog(category: Category): void {
    const dialogData: CategoryFormDialogData = {
      mode: 'edit',
      category,
    };
    this.dialog
      .open(CategoryFormDialogComponent, { width: '480px', data: dialogData })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveEditCategory(category.id, result);
        }
      });
  }

  private saveNewCategory(formValue: { name: string }): void {
    const categoryData: Partial<Category> = {
      name: formValue.name,
    };
    this.apiService.post(ConstService.addCategory, categoryData).subscribe({
      next: () => {
        this.notificationService.success('Thêm thể loại thành công.');
        this.loadCategory();
      },
      error: () => {
        this.notificationService.error('Có lỗi xảy ra khi thêm thể loại.');
      },
    });
  }

  private saveEditCategory(
    categoryId: number,
    formValue: { id: number; name: string }
  ): void {
    const categoryData: Partial<Category> = {
      id: formValue.id,
      name: formValue.name,
    };
  
    this.apiService
      .put(
        ConstService.updateCategory(categoryId),
        categoryData
      )
      .subscribe({
        next: () => {
          this.notificationService.success('Chỉnh sửa thể loại thành công.');
          this.loadCategory();
        },
        error: () => {
          this.notificationService.error(
            'Có lỗi xảy ra khi chỉnh sửa thể loại.'
          );
        },
      });
  }
  deleteCategory(categoryId: number): void {
    const dialogData: ConfirmDialogData = {
      title: 'Xác nhận xóa',
      message:
        'Bạn có chắc chắn muốn xóa thể loại này? Hành động không thể hoàn tác.',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
    };
  
    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data: dialogData })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.apiService
            .delete(ConstService.deleteCategory(categoryId))
            .subscribe({
              next: () => {
                this.notificationService.success('Xóa thể loại thành công.');
                this.loadCategory();
              },
              error: () => {
                this.notificationService.error('Không thể xóa thể loại này.');
              },
            });
        }
      });
  }
 
}
