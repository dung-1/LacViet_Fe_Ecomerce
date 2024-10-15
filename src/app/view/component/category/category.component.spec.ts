import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormBuilder ]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the edit category form', () => {
    expect(component.editCategoryForm).toBeTruthy();
  });

  it('should have id and name form controls', () => {
    expect(component.editCategoryForm.contains('id')).toBeTruthy();
    expect(component.editCategoryForm.contains('name')).toBeTruthy();
  });

  it('should call updateCategory method when edit button is clicked', () => {
    spyOn(component, 'updateCategory');
    const button = fixture.nativeElement.querySelector('.btn-primary');
    button.click();
    expect(component.updateCategory).toHaveBeenCalled();
  });

  it('should have correct modal title', () => {
    const modalTitle = fixture.nativeElement.querySelector('.modal-title');
    expect(modalTitle.textContent).toContain('Chỉnh sửa thể loại');
  });

  it('should have a close button in the modal header', () => {
    const closeButton = fixture.nativeElement.querySelector('.btn-close');
    expect(closeButton).toBeTruthy();
  });

  it('should have a form with name input field', () => {
    const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
    expect(nameInput).toBeTruthy();
  });

  it('should have a hidden id input in the form', () => {
    const idInput = fixture.nativeElement.querySelector('input[formControlName="id"]');
    expect(idInput).toBeTruthy();
    expect(idInput.type).toBe('hidden');
  });

  it('should have a close button in the modal footer', () => {
    const closeButton = fixture.nativeElement.querySelector('.modal-footer .btn-secondary');
    expect(closeButton).toBeTruthy();
    expect(closeButton.textContent).toContain('Đóng');
  });

  it('should have an edit button in the modal footer', () => {
    const editButton = fixture.nativeElement.querySelector('.modal-footer .btn-primary');
    expect(editButton).toBeTruthy();
    expect(editButton.textContent).toContain('Chỉnh sửa thể loại');
  });
});