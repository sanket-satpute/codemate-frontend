import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DependencyNode, DependencyEdge } from '../dependencies.model';

interface GraphNodeDisplay extends DependencyNode {
  x: number;
  y: number;
}

@Component({
  selector: 'app-dependencies-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dependencies-graph.component.html',
  styleUrls: ['./dependencies-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DependenciesGraphComponent implements OnChanges {
  @Input() nodes: DependencyNode[] = [];
  @Input() edges: DependencyEdge[] = [];
  @Output() nodeSelected = new EventEmitter<string>();

  nodesWithCoordinates = signal<GraphNodeDisplay[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes'] || changes['edges']) {
      this.layoutGraph();
    }
  }

  private layoutGraph(): void {
    const arrangedNodes: GraphNodeDisplay[] = this.nodes.map((node, index) => ({
      ...node,
      x: 50 + (index % 5) * 100, // Simple layout for demonstration
      y: 50 + Math.floor(index / 5) * 100,
    }));
    this.nodesWithCoordinates.set(arrangedNodes);
  }

  getNodeColor(riskScore: number): string {
    if (riskScore >= 80) return 'var(--color-critical)';
    if (riskScore >= 60) return 'var(--color-danger)';
    if (riskScore >= 40) return 'var(--color-warning)';
    return 'var(--color-success)';
  }

  getNodeById(id: string): GraphNodeDisplay | undefined {
    return this.nodesWithCoordinates().find(node => node.id === id);
  }

  onNodeClick(nodeId: string): void {
    this.nodeSelected.emit(nodeId);
  }
}
