import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-educations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './educations.component.html'
})
export class EducationsComponent implements OnInit {
  @Input() educations: any[] = [];
  @Output() delete = new EventEmitter<any>(); // Añadido para eliminar

  // Control del Modal interno
  isModalOpen = false;
  modalTitle = '';
  selectedId: number | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['']
    });
  }

  openAdd() {
    this.selectedId = null;
    this.form.reset();
    this.modalTitle = 'Añadir Formación Académica';
    this.isModalOpen = true;
  }

  openEdit(edu: any) {
    this.selectedId = edu.id;
    this.modalTitle = 'Editar Formación Académica';

    // Formatear fechas para los inputs tipo date (YYYY-MM-DD)
    const data = { ...edu };
    if (edu.start_date) {
      data.start_date = new Date(edu.start_date).toISOString().split('T')[0];
    }
    if (edu.end_date) {
      data.end_date = new Date(edu.end_date).toISOString().split('T')[0];
    }

    this.form.patchValue(data);
    this.isModalOpen = true;
  }

  save() {
    if (this.form.invalid) return;

    const request = this.selectedId
      ? this.profileService.updateEducation(this.selectedId, this.form.value)
      : this.profileService.addEducation(this.form.value);

    request.subscribe({
      next: () => {
        this.isModalOpen = false;
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al guardar educación:', err);
        alert('Error al guardar los cambios en el servidor');
      }
    });
  }
  onDelete(edu: any) {
    if (confirm('¿Estás seguro de que quieres eliminar esta formación?')) {
      this.delete.emit(edu);
    }
  }
}