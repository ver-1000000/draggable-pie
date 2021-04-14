const NAMESPACE = 'http://www.w3.org/2000/svg';

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
  const x              = centerX + (radius * Math.cos(angleInRadians));
  const y              = centerY + (radius * Math.sin(angleInRadians));
  return { x, y };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start        = polarToCartesian(x, y, radius, endAngle);
  const end          = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const dM           = `M ${start.x} ${start.y}`;
  const dA           = `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  const d            = `${dM} ${dA}`;
  return d;       
};

const canTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

interface Dataset {
  value: number;
  color: string;
}

interface DraggablePieOptions {
  id?: string;
  class?: string;
  datasets?: Dataset[];
}

export class DraggablePie {
  element: SVGElement;
  arcGroup: SVGGElement;
  lineGroup: SVGGElement;
  private dragging: { arc: SVGPathElement, line: SVGLineElement } | null = null

  constructor(options: DraggablePieOptions) {
    this.element   = document.createElementNS(NAMESPACE, 'svg');
    this.arcGroup  = document.createElementNS(NAMESPACE, 'g');
    this.lineGroup = document.createElementNS(NAMESPACE, 'g');
    this.element.append(this.arcGroup, this.lineGroup);
    this.updateDraggablePieOptions(options);
  }

  async updateDraggablePieOptions(options: DraggablePieOptions): Promise<void> {
    if (options.id) { this.element.id = options.id; }
    if (options.class) { this.element.classList.add(options.class); }
    if (options.datasets) {
      await new Promise(requestAnimationFrame);
      this.arcGroup.innerHTML  = '';
      this.lineGroup.innerHTML = '';
      const boundingClientRect = this.element.getBoundingClientRect();
      const maxValue           = options.datasets?.reduce<number>((a, b) => a + b.value, 0) || 0;
      options.datasets.forEach((dataset, i) => {
        const arc              = document.createElementNS(NAMESPACE, 'path');
        const line             = document.createElementNS(NAMESPACE, 'line');
        const startAngle       = Number((this.arcGroup.children[i - 1] as SVGPathElement | undefined)?.dataset.endAngle || 0);
        const endAngle         = startAngle + dataset.value / maxValue * 360;
        arc.dataset.index      = line.dataset.index = String(i);
        arc.dataset.startAngle = String(startAngle);
        arc.setAttribute('fill', 'none');
        this.updateArc({ arc, line, boundingClientRect, startAngle, endAngle, dataset });
        this.arcGroup.appendChild(arc);
        this.lineGroup.appendChild(line);
        if (canTouch()) {
          line.addEventListener('touchstart', e => this.dragStart(e));
          document.addEventListener('touchmove', e => this.dragMove(e));
          document.addEventListener('touchend', () => this.dragEnd());
        } else {
          line.addEventListener('mousedown', e => this.dragStart(e));
          document.addEventListener('mousemove', e => this.dragMove(e));
          document.addEventListener('mouseup', () => this.dragEnd());
        }
      });
    }
  }

  dragStart(event: MouseEvent | TouchEvent) {
    const line = event.target as SVGLineElement;
    const arc  = this.arcGroup.children[Number(line.dataset.index)] as SVGPathElement;
    this.dragging = { arc, line };
  }

  dragMove(event: MouseEvent | TouchEvent): void {
    if (!this.dragging) { return; }
    const rect     = this.element.getBoundingClientRect();
    const { x, y } = (() => {
      const { clientX, clientY } = event instanceof MouseEvent ? event : event.targetTouches[0];
      return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.y - rect.height / 2 };
    })();
    const rad              = Math.atan2(y - 0, x - 0);
    const beforeStartAngle = Number(this.dragging.arc.dataset.startAngle || 0);
    const endAngle         = rad * 180 / Math.PI + 90;
    const startAngle       = beforeStartAngle;
    const nextArc          = (this.arcGroup.children[Number(this.dragging.arc.dataset?.index) + 1] || this.arcGroup.children[0]) as SVGPathElement;
    const nextLine         = (this.lineGroup.children[Number(this.dragging.line.dataset?.index) + 1] || this.lineGroup.children[0]) as SVGLineElement;
    const nextEndAngle     = Number(nextArc.dataset?.endAngle || 0);
    const nextStartAngle   = endAngle %360;
    if (startAngle > endAngle || nextStartAngle > nextEndAngle) { return; }
    this.updateArc({ arc: this.dragging.arc, line: this.dragging.line, boundingClientRect: rect, startAngle, endAngle });
    this.updateArc({ arc: nextArc, line: nextLine, boundingClientRect: rect, startAngle: nextStartAngle, endAngle: nextEndAngle });
  }

  dragEnd() {
    this.dragging = null;
  }

  updateArc({ arc, line, boundingClientRect, startAngle, endAngle, dataset }: {
    arc: SVGPathElement, line: SVGLineElement, boundingClientRect: DOMRect, startAngle: number, endAngle: number, dataset?: Dataset
  }) {
    const x                = boundingClientRect.width / 2;
    const y                = boundingClientRect.height / 2;
    const strokeWidth      = Math.min(x, y);
    const radius           = strokeWidth / 2;
    arc.dataset.startAngle = String(startAngle);
    arc.dataset.endAngle   = String(endAngle);
    if (dataset?.color) { arc.setAttribute('stroke', dataset.color); }
    arc.setAttribute('stroke-width', String(strokeWidth));
    arc.setAttribute('d', describeArc(x, y, radius, startAngle, endAngle));
    this.updateLine({ line, origin: { x, y }, distance: strokeWidth, angle: endAngle });
  }

  updateLine({ line, origin, distance, angle }: {
    line: SVGLineElement, origin: { x: number, y: number }, distance: number, angle: number
  }): void {
    const rad = (angle - 90) * Math.PI / 180;
    const x2  = origin.x + distance * Math.cos(rad);
    const y2  = origin.y + distance * Math.sin(rad);
    line.setAttribute('stroke', '#333333');
    line.setAttribute('stroke-width', '5');
    line.setAttribute('x1', String(origin.x));
    line.setAttribute('y1', String(origin.y));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
  }
}
