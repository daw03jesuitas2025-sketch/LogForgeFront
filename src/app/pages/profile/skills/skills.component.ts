import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
  @Input() skills: any[] = [];
  
  isModalOpen = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  openAdd() {
    this.form.reset();
    this.isModalOpen = true;
  }

saveSkill() {
  if (this.form.invalid) return;

  this.profileService.addSkill(this.form.value).subscribe({
    next: (newSkill: any) => { // <-- Añadido :any
      this.isModalOpen = false;
      window.location.reload();
    },
    error: (err: any) => { // <-- Añadido :any
      console.error('Error al guardar skill:', err);
      alert('No se pudo añadir la habilidad.');
    }
  });
}

  getSkillName(skill: any): string {
    return typeof skill === 'string' ? skill : skill.name;
  }
}