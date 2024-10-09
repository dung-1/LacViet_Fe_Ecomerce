import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Product } from '../../../model/Product';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit {
  constructor(
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
  currentProductImage: string | null = null;
  addProductForm!: FormGroup;
  selectedFile!: File | null;
  Product = [{ id: 1, name: 'Category 1' }];
  offset = 0;
  filteredProduct: Product[] = [];
  product: Product[] = [
    { id: 1, name: '', price: 1, image: '', categoryId: 1 },
  ];
  editMode = false;
  currentProductId: number | null = null;
  editProductForm: FormGroup;
  columns = [
    { prop: 'id', name: 'ID sản phẩm' },
    { prop: 'name', name: 'Tên loại sản phẩm' },
  ];
  ngOnInit(): void {
    this.loadProducts();
    this.loadProduct();
  }

  loadProduct() {
    this.apiService.get(ConstService.getAllCategory).subscribe(
      (response) => {
        this.Product = response;
      },
      (error) => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách sản phẩm .'
        );
      }
    );
  }

  loadProducts() {
    this.apiService.get(ConstService.getAllProduct).subscribe(
      (response) => {
        this.filteredProduct = response;
      },
      (error) => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách sản phẩm .'
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
      const formData = new FormData();
      
      formData.append('id', formValue.id.toString());
      formData.append('name', formValue.name);
      formData.append('price', formValue.price.toString());
      formData.append('categoryId', formValue.categoryId.toString());

      // Nếu người dùng chọn ảnh mới, thì cập nhật giá trị của formValue.image
      if (this.selectedFile) {
        formValue.image = this.selectedFile.name;
      } else if (this.currentProductImage) {
        formValue.image = this.currentProductImage;
      }
  
      formData.append('image', formValue.image);
  
      // Nếu người dùng chọn ảnh mới, thì gửi ảnh mới lên server
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }else if (this.currentProductImage) {
        formData.append('imageFile', this.currentProductImage);

      }
  
      this.apiService.putFormData(`${ConstService.updateProduct}/${this.currentProductId}`, formData).subscribe(
        () => {
          this.notificationService.success('Chỉnh sửa sản phẩm thành công.');
          this.loadProducts();
          this.editProductForm.reset();
          this.selectedFile = null; 
          const modalCloseButton = document.querySelector('#exampleModaledit .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        () => {
          this.notificationService.error('Có lỗi xảy ra khi chỉnh sửa sản phẩm.');
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
          const modalCloseButton = document.querySelector('#exampleModaladd .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        () => {
          this.notificationService.error('Có lỗi xảy ra khi thêm sản phẩm.');
        }
      );
    }
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${ConstService.serverHost()}/${imageUrl}`;
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

  getCategoryName(categoryId: number): string {
    const category = this.Product.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.addProductForm.patchValue({ image: file.name });
      this.editProductForm.patchValue({ image: file.name }); 
    }
  }
}
