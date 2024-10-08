import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { id } from '@swimlane/ngx-datatable';
import { Product } from '../../../model/Product';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  constructor(private apiService: ApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder

  ) {

    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      // imageFile:['', Validators.required],
      categoryId: ['', Validators.required],
    });
    this.editProductForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, Validators.required],
      // imageFile:['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  categories = [{ id: 1, name: 'Category 1' }];
  selectedFile: File | null = null;

  offset = 0;
  filteredCategories: Product[] = [];
  Product: Product[] = [
    { Id: 1, name: '',price:1,image:'',categoryId:1 },
  ];
  baseUrl: string = 'https://localhost:7074';

  currentProductId: number | null = null;

  addProductForm: FormGroup;
  editProductForm: FormGroup;
  columns = [
    { prop: 'id', name: 'ID sản phẩm' },
    { prop: 'name', name: 'Tên loại sản phẩm' },
  ];
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.get(ConstService.getAllCategory).subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách thể loại cha.'
        );
      }
    );
  }
  loadProducts() {
    this.apiService.get(ConstService.getAllProduct).subscribe(
      (response) => {
        this.filteredCategories = response;
      },
      (error) => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách thể loại cha.'
        );
      }
    );
  }
  rowClassFunction = (row: any, index: number) => {
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  };
  onPage(event: any) {
    this.offset = event.offset;
  }

  updateProduct() {
    if (this.editProductForm.valid && this.currentProductId) {
      const formValue = this.editProductForm.value;
      const ProductData: Partial<Product> = {
        name: formValue.name,
        Id:formValue.id,
      };

      this.apiService.put(`${ConstService.updateProduct}/${this.currentProductId}`, ProductData).subscribe(
        (response: Product) => {
          this.notificationService.success('Chỉnh sửa thể loại thành công.');
          this.loadProducts();
          this.editProductForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaledit .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi chỉnh sửa thể loại.');
        }
      );
    }
  }

  openEditModal(Product: Product) {
      this.currentProductId = Product.Id;
      this.editProductForm.patchValue({
        id: Product.Id,
        name: Product.name,
        price:Product.price,
        categoryId:Product.categoryId

      });
  }

  addProduct() {
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value;
      productData.categoryId = +productData.categoryId;

      const formData = new FormData();
      formData.append(
        'product',
        new Blob([JSON.stringify(productData)], { type: 'application/json' })
      );

      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      this.apiService.postFormData(ConstService.addProduct, formData).subscribe(
        (response) => {
          this.notificationService.success('Thêm sản phẩm thành công.');
          this.loadProducts();
          this.addProductForm.reset();
          const modalCloseButton = document.querySelector(
            '#exampleModaladd .btn-close'
          ) as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
        }
      );
    } else {
      Object.keys(this.addProductForm.controls).forEach((key) => {
        const control = this.addProductForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
  
  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${this.baseUrl}/${imageUrl}`;
  }
  deleteProduct(ProductId: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: "Bạn sẽ không thể khôi phục lại dữ liệu này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, xóa nó!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(`${ConstService.deleteProduct}/${ProductId}`).subscribe(
          (response) => {
            this.notificationService.success('Xóa thể loại thành công.');
            this.loadProducts();
          },
          (error) => {
            this.notificationService.error('Có lỗi xảy ra khi xóa thể loại.');
          }
        );
      }
    });
  }
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
