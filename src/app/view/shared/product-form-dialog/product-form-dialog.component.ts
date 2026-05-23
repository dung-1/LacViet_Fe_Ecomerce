import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../model/Product';
import { ConstService } from '../../../service/const.service';

export interface ProductFormDialogData {
  mode: 'add' | 'edit';
  product?: Product;
  categories: { id: number; name: string }[];
}

@Component({
  selector: 'app-product-form-dialog',
  templateUrl: './product-form-dialog.component.html',
})
export class ProductFormDialogComponent implements OnInit {
  form!: FormGroup;
  title = '';
  selectedFile: File | null = null;
  currentImageUrl = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductFormDialogData
  ) {}

  ngOnInit(): void {
    this.title =
      this.data.mode === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm';

    if (this.data.mode === 'add') {
      this.form = this.fb.group({
        name: ['', Validators.required],
        price: [0, Validators.required],
        categoryId: ['', Validators.required],
        image: [''],
      });
    } else {
      const product = this.data.product!;
      this.form = this.fb.group({
        id: [product.id, Validators.required],
        name: [product.name, Validators.required],
        price: [product.price, Validators.required],
        categoryId: [product.categoryId, Validators.required],
        image: [product.image],
      });
      this.currentImageUrl = product.image
        ? `${ConstService.serverHost()}/${product.image}`
        : '';
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.form.patchValue({ image: file.name });
    } else {
      this.selectedFile = null;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        formValue: this.form.value,
        file: this.selectedFile,
      });
    }
  }
}
