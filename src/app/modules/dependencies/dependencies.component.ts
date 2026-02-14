import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { DependenciesService } from './dependencies.service';
import { DependencyNode, DependencyEdge, ImpactItem } from './dependencies.model';

import { DependenciesGraphComponent } from './dependencies-graph/dependencies-graph.component';
import { ImpactAnalysisComponent } from './impact-analysis/impact-analysis.component';

@Component({
  selector: 'app-dependencies',
  standalone: true,
  imports: [
    CommonModule,
    DependenciesGraphComponent,
    ImpactAnalysisComponent,
  ],
  templateUrl: './dependencies.component.html',
  styleUrls: ['./dependencies.component.scss']
})
export class DependenciesComponent implements OnInit {
  loadingGraph = signal(true);
  loadingImpact = signal(false);
  nodes = signal<DependencyNode[]>([]);
  edges = signal<DependencyEdge[]>([]);
  impactList = signal<ImpactItem[]>([]);
  selectedNodeId = signal<string | null>(null);

  private projectId!: string;

  constructor(
    private route: ActivatedRoute,
    private dependenciesService: DependenciesService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.loadDependencyGraph();
  }

  loadDependencyGraph(): void {
    this.loadingGraph.set(true);
    this.dependenciesService.getDependencyGraph(this.projectId)
      .pipe(finalize(() => this.loadingGraph.set(false)))
      .subscribe(data => {
        this.nodes.set(data.nodes);
        this.edges.set(data.edges);
      });
  }

  onNodeSelected(nodeId: string): void {
    this.selectedNodeId.set(nodeId);
    this.loadImpactAnalysis(nodeId);
  }

  loadImpactAnalysis(nodeId: string): void {
    this.loadingImpact.set(true);
    this.dependenciesService.getImpactAnalysis(this.projectId, nodeId)
      .pipe(finalize(() => this.loadingImpact.set(false)))
      .subscribe(data => {
        this.impactList.set(data);
      });
  }
}
