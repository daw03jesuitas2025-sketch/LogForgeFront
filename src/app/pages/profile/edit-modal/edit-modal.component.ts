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
  @Input() type: 'experience' | 'education' | 'skills' = 'experience';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup; // Usamos ! porque lo inicializaremos en el método

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    
    if (this.data && this.type !== 'skills') {
      this.patchFormValues();
    }
  }

  // Creamos el formulario EXACTO para cada tipo
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
        end_date: [''],
        description: [''] // Tu modelo de educación puede no usarlo, pero lo dejamos por si acaso
      });
    } else {
      // Para skills no necesitamos FormGroup necesariamente si usas el textarea directo
      this.form = this.fb.group({}); 
    }
  }

  private patchFormValues() {
    const formattedData = { ...this.data };
    // Formateo de fechas para el input date de HTML5
    if (this.data.start_date) formattedData.start_date = new Date(this.data.start_date).toISOString().split('T')[0];
    if (this.data.end_date) formattedData.end_date = new Date(this.data.end_date).toISOString().split('T')[0];
    
    this.form.patchValue(formattedData);
  }

  onSubmit() {
    if (this.form.valid) {
      // Enviamos el valor del formulario tal cual, ya que ahora 
      // solo contiene los campos que Laravel espera para ese modelo.
      this.save.emit(this.form.value);
    }
  }

  onSaveSkills(value: string) {
    const skillsArray = value.split(',').map(s => s.trim()).filter(s => s !== '');
    this.save.emit(skillsArray);
  }
}