import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Category } from '../../../model/Category';
import { Product } from '../../../model/Product';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      categoryId: ['', Validators.required],
      image: [''],
    });

    this.editProductForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, Validators.required],
      categoryId: ['', Validators.required],
      image: [''],
    });
  }
  categoryIds: number[] = [];
  currentProductImage: string | null = null;
  addProductForm!: FormGroup;
  selectedFile!: File | null;
  offset = 0;
  filteredProduct: Product[] = [];
  product: Product[] = [
    { id: 1, name: '', price: 1, image: '', categoryId: 1 },
  ];
  categories = [{ id: 1, name: 'Category 1' }];
  editMode = false;
  currentProductId: number | null = null;
  editProductForm: FormGroup;
  columns = [
    { prop: 'id', name: 'ID sản phẩm' },
    { prop: 'name', name: 'Tên loại sản phẩm' },
    { prop: 'price', name: 'Gía sản phẩm' },
    { prop: 'image', name: 'ảnh sản phẩm' },
    { prop: 'categoryId', name: 'loại sản phẩm' },

  ];
  Allproduct: Product[] = [];
  totalItems: Product[] = [];

  filteredCategories: Category[] = [];
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
      this.loadProducts();
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
  

  loadProducts() {
    this.apiService.get(`${ConstService.getAllProduct}`).subscribe(
      (data: Product[]) => {
        this.Allproduct = data.filter((product: { categoryId: number }) => 
          this.categoryIds.includes(product.categoryId)
        );
        this.Allproduct.sort((a, b) => {
          const dateA = a.modifiedTime ? new Date(a.modifiedTime).getTime() : 0;
          const dateB = b.modifiedTime ? new Date(b.modifiedTime).getTime() : 0;
          return dateB - dateA;
        });
        this.totalItems = this.Allproduct;
        this.filteredProduct = this.Allproduct.slice(this.offset, this.offset + 5);
      },      (error) => {
        console.error('Error fetching Product:', error);
      }
    );
  }
  
  onPage(event: any) {
    this.offset = event.offset;
  }

  updateProduct() {
    if (this.editProductForm.valid && this.currentProductId) {
      const formValue = this.editProductForm.value;
      const formData = new FormData();

      formData.append('id', formValue.id.toString());
      formData.append('name', formValue.name);
      formData.append('price', formValue.price.toString());
      formData.append('categoryId', formValue.categoryId.toString());

      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      } else {
        formData.append('noNewImage', 'true');
      }
      this.apiService
        .putFormData(
          `${ConstService.updateProduct}/${this.currentProductId}`,
          formData
        )
        .subscribe(
          () => {
            this.notificationService.success('Chỉnh sửa sản phẩm thành công.');
            this.loadProducts();
            this.editProductForm.reset();
            this.selectedFile = null;
            const modalCloseButton = document.querySelector(
              '#exampleModaledit .btn-close'
            ) as HTMLElement;
            modalCloseButton?.click();
          },
          (error) => {
            console.error('Error updating product:', error);
            this.notificationService.error(
              'Có lỗi xảy ra khi chỉnh sửa sản phẩm.'
            );
          }
        );
    }
  }
  openEditModal(product: Product) {
    this.currentProductId = product.id;
    this.editProductForm.patchValue({
      id: product.id,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      imageFile: product.image,
    });
    this.currentProductImage = product.image;
  }

  addProduct() {
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value;
      productData.categoryId = +productData.categoryId;

      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price.toString());
      formData.append('categoryId', productData.categoryId.toString());
      formData.append('image', productData.image);

      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      this.apiService.postFormData(ConstService.addProduct, formData).subscribe(
        () => {
          this.notificationService.success('Thêm sản phẩm thành công.');
          this.loadProducts();
          this.addProductForm.reset();
          this.selectedFile = null;
          const modalCloseButton = document.querySelector(
            '#exampleModaladd .btn-close'
          ) as HTMLElement;
          modalCloseButton?.click();
        },
        () => {
          this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
        }
      );
    } else {
      this.notificationService.warning('Vui lòng điền thông tin thêm sản phẩm.');
    }
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${ConstService.serverHost()}/${imageUrl}`;
  }

  deleteProduct(ProductId: number) {
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
          .delete(`${ConstService.deleteProduct}/${ProductId}`)
          .subscribe(
            (response) => {
              this.notificationService.success('Xóa sản phẩm thành công.');
              this.loadProducts();
            },
            (error) => {
              this.notificationService.error('Không thể xóa sản phẩm.');
            }
          );
      }
    });
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
    // window.location.reload();
  }
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.addProductForm.patchValue({ image: file.name });
      this.editProductForm.patchValue({ image: file.name });
    } else {
      this.selectedFile = null;
    }
  } 
}
