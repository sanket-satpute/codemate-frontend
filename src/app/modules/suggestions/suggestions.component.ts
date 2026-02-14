import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { SuggestionsService } from './suggestions.service';
import { Suggestion, RefactorPreview } from './suggestions.model';
import { SuggestionCardComponent } from './suggestion-card.component';
import { RefactorPreviewComponent } from './refactor-preview.component';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';


@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [
    CommonModule,
    SuggestionCardComponent,
    RefactorPreviewComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  loading = signal(true);
  suggestions = signal<Suggestion[]>([]);
  selectedSuggestion = signal<Suggestion | null>(null);
  previewLoading = signal(false);
  preview = signal<RefactorPreview | null>(null);

  private projectId!: string;

  constructor(
    private route: ActivatedRoute,
    private suggestionsService: SuggestionsService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.loading.set(true);
    this.suggestionsService.getSuggestions(this.projectId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(data => {
        this.suggestions.set(data);
      });
  }

  onPreviewRequested(suggestion: Suggestion): void {
    this.selectedSuggestion.set(suggestion);
    this.preview.set(null);
    this.previewLoading.set(true);

    this.suggestionsService.getRefactorPreview(this.projectId, suggestion.id)
      .pipe(finalize(() => this.previewLoading.set(false)))
      .subscribe(data => {
        this.preview.set(data);
      });
  }
}
