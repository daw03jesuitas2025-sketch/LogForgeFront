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
  isEditing = false;
  selectedSkillId: number | null = null;
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
    this.isEditing = false;
    this.selectedSkillId = null;
    this.form.reset();
    this.isModalOpen = true;
  }

  openEdit(skill: any) {
    this.isEditing = true;
    this.selectedSkillId = skill.id;
    this.form.patchValue({ name: this.getSkillName(skill) });
    this.isModalOpen = true;
  }

  saveSkill() {
    if (this.form.invalid) return;

    const request = this.isEditing && this.selectedSkillId
      ? this.profileService.updateSkill(this.selectedSkillId, this.form.value)
      : this.profileService.addSkill(this.form.value);

    request.subscribe({
      next: () => {
        this.isModalOpen = false;
        window.location.reload(); // O llama a un emit() para refrescar el padre sin recargar
      },
      error: (err: any) => {
        console.error('Error al procesar skill:', err);
        alert('Ocurrió un error.');
      }
    });
  }

  deleteSkill(id: number) {
    if (confirm('¿Eliminar esta habilidad?')) {
      this.profileService.deleteSkill(id).subscribe({
        next: () => window.location.reload(),
        error: (err: any) => console.error('Error al borrar:', err)
      });
    }
  }

  getSkillName(skill: any): string {
    return typeof skill === 'string' ? skill : skill.name;
  }
}