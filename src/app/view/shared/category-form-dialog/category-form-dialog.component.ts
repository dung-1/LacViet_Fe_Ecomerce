import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../model/Category';

export interface CategoryFormDialogData {
  mode: 'add' | 'edit';
  category?: Category;
}

@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
})
export class CategoryFormDialogComponent implements OnInit {
  form!: FormGroup;
  title = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormDialogData
  ) {}

  ngOnInit(): void {
    this.title =
      this.data.mode === 'add' ? 'Thêm thể loại' : 'Chỉnh sửa thể loại';

    if (this.data.mode === 'add') {
      this.form = this.fb.group({
        name: ['', Validators.required],
      });
    } else {
      this.form = this.fb.group({
        id: [this.data.category?.id, Validators.required],
        name: [this.data.category?.name || '', Validators.required],
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
