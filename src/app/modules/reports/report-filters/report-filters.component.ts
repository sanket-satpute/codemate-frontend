import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ProjectService } from '../../../core/services/project/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.scss']
})
export class ReportFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();
  filterForm: FormGroup;
  projectService = inject(ProjectService);
  projects = this.projectService.projects;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      projectId: [''],
      status: [''],
      startDate: [''],
      endDate: ['']
    });

    this.filterForm.valueChanges.subscribe(values => {
      this.filtersChanged.emit(values);
    });
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe();
  }

  applyFilters(): void {
    this.filtersChanged.emit(this.filterForm.value);
  }

  clearFilters(): void {
    this.filterForm.reset({
      projectId: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    this.filtersChanged.emit(this.filterForm.value);
  }
}
