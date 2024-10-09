import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Category } from '../../../model/Category';
import { ApiService } from '../../../service/Api/api.service';
import { NotificationService } from '../../../service/Notification/notification.service';
import { ConstService } from '../../../service/const.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  constructor(private apiService: ApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {

    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.editCategoryForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });
  }
  offset = 0;
  filteredCategories: Category[] = [];
  contact: Category[] = [
    { id: 1, name: '' },
  ];
  currentCategoryId: number | null = null;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  columns = [
    { prop: 'id', name: 'ID sản phẩm' },
    { prop: 'name', name: 'Tên loại sản phẩm' },
  ];
  ngOnInit(): void {
    this.loadcontacts();
  }

  loadcontacts() {
    this.apiService.get(ConstService.getAllCategory).subscribe(
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
  }

  onPage(event: any) {
    this.offset = event.offset;
  }

  updateCategory() {
    if (this.editCategoryForm.valid && this.currentCategoryId) {
      const formValue = this.editCategoryForm.value;
      const categoryData: Partial<Category> = {
        name: formValue.name,
        id: formValue.id,
      };

      this.apiService.put(`${ConstService.updateCategory}/${this.currentCategoryId}`, categoryData).subscribe(
        (response: Category) => {
          this.notificationService.success('Chỉnh sửa thể loại thành công.');
          this.loadcontacts();
          this.editCategoryForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaledit .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi chỉnh sửa thể loại.');
        }
      );
    }
  }

  openEditModal(category: Category) {
    this.currentCategoryId = category.id;
    this.editCategoryForm.patchValue({
      id: category.id,
      name: category.name,

    });
  }

  addCategory() {
    if (this.addCategoryForm && this.addCategoryForm.valid) {
      const formValue = this.addCategoryForm.value;
      const categoryData: Partial<Category> = {
        name: formValue.name,

      };

      this.apiService.post(ConstService.addCategory, categoryData).subscribe(
        (response: Category) => {
          this.notificationService.success('Thêm thể loại thành công.');
          this.loadcontacts();
          this.addCategoryForm.reset();
          const modalCloseButton = document.querySelector('#exampleModaladd .btn-close') as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm thể loại.');
        }
      );
    }
  }

  deleteCategory(categoryId: number) {
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
        this.apiService.delete(`${ConstService.deleteCategory}/${categoryId}`).subscribe(
          (response) => {
            this.notificationService.success('Xóa thể loại thành công.');
            this.loadcontacts();
          },
          (error) => {
            this.notificationService.error('Không thể xóa thể loại này.');

          }
        );
      }
    });
  }
}
