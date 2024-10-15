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
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: [undefined, Validators.required]

    });
    this.editCategoryForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      parentCategoryId: [undefined, Validators.required]
    });
  }
  offset = 0;
  filteredCategories: Category[] = [];
  Category: Category[] = [{ id: 1, name: 'Category 1', parentCategoryId: 1 }];
  currentCategoryId: number | null = null;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  parentCategories: Category[] = [{ id: 1, name: 'Category 1', parentCategoryId: 1 }];

  columns = [
    { prop: 'id', name: 'ID sản phẩm' },
    { prop: 'name', name: 'Tên loại sản phẩm' },
  ];
  ngOnInit(): void {
    this.filteredCategories = this.Category;
    this.loadCategory();
    this.loadParentCategories();
  }

  loadCategory() {
    this.apiService.get(ConstService.getAllCategory).subscribe(
      (data: Category[]) => {
              this.Category = data.sort((a, b) => {
                const dateA = a.modifiedTime ? new Date(a.modifiedTime).getTime() : 0;
                const dateB = b.modifiedTime ? new Date(b.modifiedTime).getTime() : 0;
                return dateB - dateA;
              });
        this.updateFilter();
      },
      (error) => {
        this.notificationService.error(
          'Có lỗi xảy ra khi tải danh sách thể loại cha.'
        );
      }
    );
  }
  
  isParentCategory(categoryName: string): boolean {
    return categoryName === 'Sản phẩm' || categoryName === 'Tin tức';
  }

  getCategoryName(ParentCategoryId: number | undefined): string {
    if (ParentCategoryId === undefined) {
      return '';
    }
    const parentCategory = this.Category.find(cat => cat.id === ParentCategoryId);
    return parentCategory ? parentCategory.name : '';
  }

  updateFilter(event?: any) {
    const val = event ? event.target.value.toLowerCase() : '';
    this.filteredCategories = this.Category.filter(category => {
      return category.name.toLowerCase().includes(val);
    });
  }
  onPage(event: any) {
    this.offset = event.offset;
  }

  loadParentCategories() {
    this.apiService.get(ConstService.getAllCategory).subscribe(
      (response: Category[]) => {
        this.parentCategories = response.filter(category =>
          category.name === 'Sản phẩm' || category.name === 'Tin tức'
        );
      },
      (error) => {
        this.notificationService.error('Có lỗi xảy ra khi tải danh sách thể loại cha.');
      }
    );
  }

  updateCategory() {
    if (this.editCategoryForm.valid && this.currentCategoryId) {
      const formValue = this.editCategoryForm.value;
      const categoryData: Partial<Category> = {
        name: formValue.name,
        id: formValue.id,
        parentCategoryId: formValue.parentCategoryId,
      };
      this.apiService
        .put(
          `${ConstService.updateCategory}/${this.currentCategoryId}`,
          categoryData
        )
        .subscribe(
          (response: Category) => {
            this.notificationService.success('Chỉnh sửa thể loại thành công.');
            this.loadCategory();
            this.editCategoryForm.reset();
            const modalCloseButton = document.querySelector(
              '#exampleModaledit .btn-close'
            ) as HTMLElement;
            modalCloseButton?.click();
          },
          (error) => {
            this.notificationService.error(
              'Có lỗi xảy ra khi chỉnh sửa thể loại.'
            );
          }
        );
    }
  }

  openEditModal(category: Category) {
    if (!this.isParentCategory(category.name)) {
      this.currentCategoryId = category.id;
      this.editCategoryForm.patchValue({
        id: category.id,
        name: category.name,
        parentCategoryId: category.parentCategoryId
      });
    }
  }

  addCategory() {
    if (this.addCategoryForm && this.addCategoryForm.valid) {
      const formValue = this.addCategoryForm.value;
      const categoryData: Partial<Category> = {
        name: formValue.name,
        parentCategoryId: formValue.categoryId,
      };

      this.apiService.post(ConstService.addCategory, categoryData).subscribe(
        (response: Category) => {
          this.notificationService.success('Thêm thể loại thành công.');
          this.loadCategory();
          this.addCategoryForm.reset();
          const modalCloseButton = document.querySelector(
            '#exampleModaladd .btn-close'
          ) as HTMLElement;
          modalCloseButton?.click();
        },
        (error) => {
          this.notificationService.error('Có lỗi xảy ra khi thêm thể loại.');
        }
      );
    } else {
      this.notificationService.warning(
        'Vui lòng điền thông tin thêm thể loại.'
      );
    }
  }

  deleteCategory(categoryId: number) {
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
          .delete(`${ConstService.deleteCategory}/${categoryId}`)
          .subscribe(
            (response) => {
              this.notificationService.success('Xóa thể loại thành công.');
              this.loadCategory();
            },
            (error) => {
              this.notificationService.error('Không thể xóa thể loại này.');
            }
          );
      }
    });
  }
}
