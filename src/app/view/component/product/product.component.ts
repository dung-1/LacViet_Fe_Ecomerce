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
import { Product } from '../../../model/Product';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/confirm-dialog/confirm-dialog.component';
import {
  ProductFormDialogComponent,
  ProductFormDialogData,
} from '../../shared/product-form-dialog/product-form-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'name',
    'price',
    'image',
    'categoryId',
    'actions',
  ];
  dataSource = new MatTableDataSource<Product>([]);
  categories: { id: number; name: string }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dataSource.filterPredicate = (data, filter) => {
        const term = filter.trim().toLowerCase();
        return data.name.toLowerCase().includes(term);
      };
      this.loadCategories();
      this.loadProducts();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCategories(): void {
    this.apiService.get(`${ConstService.getAllCategory}`).subscribe({
      next: (data: { id: number; name: string }[]) => {
        this.categories = data;
      },
      error: () => {
        this.notificationService.error('Có lỗi khi tải danh mục.');
      },
    });
  }

  loadProducts(): void {
    this.apiService.get(`${ConstService.getAllProduct}`).subscribe({
      next: (data: Product[]) => {
        this.dataSource.data = data.sort((a, b) => {
          const dateA = a.modifiedTime
            ? new Date(a.modifiedTime).getTime()
            : 0;
          const dateB = b.modifiedTime
            ? new Date(b.modifiedTime).getTime()
            : 0;
          return dateB - dateA;
        });
      },
      error: () => {
        this.notificationService.error('Có lỗi khi tải sản phẩm.');
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

  openAddDialog(): void {
    const dialogData: ProductFormDialogData = {
      mode: 'add',
      categories: this.categories,
    };
    this.dialog
      .open(ProductFormDialogComponent, { width: '520px', data: dialogData })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveNewProduct(result.formValue, result.file);
        }
      });
  }

  openEditDialog(product: Product): void {
    const dialogData: ProductFormDialogData = {
      mode: 'edit',
      product,
      categories: this.categories,
    };
    this.dialog
      .open(ProductFormDialogComponent, { width: '520px', data: dialogData })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveEditProduct(product.id, result.formValue, result.file);
        }
      });
  }

  private saveNewProduct(
    formValue: { name: string; price: number; categoryId: number },
    file: File | null
  ): void {
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('price', formValue.price.toString());
    formData.append('categoryId', (+formValue.categoryId).toString());
    if (file) {
      formData.append('imageFile', file);
    }

    this.apiService.postFormData(ConstService.addProduct, formData).subscribe({
      next: () => {
        this.notificationService.success('Thêm sản phẩm thành công.');
        this.loadProducts();
      },
      error: () => {
        this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
      },
    });
  }

  private saveEditProduct(
    productId: number,
    formValue: {
      id: number;
      name: string;
      price: number;
      categoryId: number;
    },
    file: File | null
  ): void {
    const formData = new FormData();
    formData.append('id', formValue.id.toString());
    formData.append('name', formValue.name);
    formData.append('price', formValue.price.toString());
    formData.append('categoryId', formValue.categoryId.toString());

    if (file) {
      formData.append('imageFile', file);
    } else {
      formData.append('noNewImage', 'true');
    }

    this.apiService
      .putFormData(ConstService.updateProduct(productId), formData)
      .subscribe({
        next: () => {
          this.notificationService.success('Chỉnh sửa sản phẩm thành công.');
          this.loadProducts();
        },
        error: () => {
          this.notificationService.error(
            'Có lỗi xảy ra khi chỉnh sửa sản phẩm.'
          );
        },
      });
  }

  deleteProduct(productId: number): void {
    const dialogData: ConfirmDialogData = {
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
    };
    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data: dialogData })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.apiService
            .delete(ConstService.deleteProduct(productId))
            .subscribe({
              next: () => {
                this.notificationService.success('Xóa sản phẩm thành công.');
                this.loadProducts();
              },
              error: () => {
                this.notificationService.error('Không thể xóa sản phẩm.');
              },
            });
        }
      });
  }
}
