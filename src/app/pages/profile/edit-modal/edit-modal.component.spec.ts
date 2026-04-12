import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">{{ title }}</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-rose-500 transition">
            <span class="material-icons">close</span>
          </button>
        </div>

        <form [formGroup]="experienceForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Empresa</label>
            <input formControlName="company" type="text" class="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Puesto / Cargo</label>
            <input formControlName="position" type="text" class="w-full border-gray-200 rounded-lg text-sm">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Inicio</label>
              <input formControlName="start_date" type="date" class="w-full border-gray-200 rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Fin (Opcional)</label>
              <input formControlName="end_date" type="date" class="w-full border-gray-200 rounded-lg text-sm">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
            <textarea formControlName="description" rows="3" class="w-full border-gray-200 rounded-lg text-sm"></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" (click)="close.emit()" class="flex-1 py-2 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              Cancelar
            </button>
            <button type="submit" [disabled]="experienceForm.invalid" class="flex-1 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() initialData: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  experienceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.initialData) {
      // Limpiamos los datos para que el formato de fecha sea YYYY-MM-DD
      const formattedData = { ...this.initialData };
      
      if (formattedData.start_date) {
        formattedData.start_date = formattedData.start_date.split('T')[0];
      }
      if (formattedData.end_date) {
        formattedData.end_date = formattedData.end_date.split('T')[0];
      }

      this.experienceForm.patchValue(formattedData);
    }
  }

  onSubmit() {
    if (this.experienceForm.valid) {
      this.save.emit(this.experienceForm.value);
    }
  }
}