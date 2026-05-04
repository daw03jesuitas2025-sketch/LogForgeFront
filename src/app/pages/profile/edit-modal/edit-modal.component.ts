import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modal.component.html'
})
export class EditModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() data: any = null;
  @Input() type: 'experience' | 'education' | 'basic' | 'skills' | 'project' = 'experience';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data && this.type !== 'skills') {
      this.patchFormValues();
    }
  }

  private initForm() {
    if (this.type === 'experience') {
      this.form = this.fb.group({
        company: ['', Validators.required],
        position: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: [''],
        description: ['']
      });
    } else if (this.type === 'education') {
      this.form = this.fb.group({
        institution: ['', Validators.required],
        degree: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['']
      });
    } else if (this.type === 'basic') {
      this.form = this.fb.group({
        name: ['', Validators.required],
        title: [''],
        location: [''],
        biography: ['']
      });
    } else {
      this.form = this.fb.group({});
    }
  }

  private patchFormValues() {
    if (!this.form || !this.data) return;

    // Hacemos una copia para no alterar el objeto original directamente
    const formattedData = { ...this.data };

    // Solo intentamos procesar fechas si el formulario las requiere
    if (this.type === 'experience' || this.type === 'education') {
      if (this.data.start_date) {
        formattedData.start_date = new Date(this.data.start_date).toISOString().split('T')[0];
      }
      if (this.data.end_date) {
        formattedData.end_date = new Date(this.data.end_date).toISOString().split('T')[0];
      }
    }

    this.form.patchValue(formattedData);
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onSaveSkills(value: string) {
    // Convierte el string separado por comas en un array limpio
    const skillsArray = value.split(',').map(s => s.trim()).filter(s => s !== '');
    this.save.emit(skillsArray);
  }
}