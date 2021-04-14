interface Dataset {
    value: number;
    color: string;
}
interface DraggablePieOptions {
    id?: string;
    class?: string;
    datasets?: Dataset[];
}
export declare class DraggablePie {
    element: SVGElement;
    arcGroup: SVGGElement;
    lineGroup: SVGGElement;
    private dragging;
    constructor(options: DraggablePieOptions);
    updateDraggablePieOptions(options: DraggablePieOptions): Promise<void>;
    dragStart(event: MouseEvent | TouchEvent): void;
    dragMove(event: MouseEvent | TouchEvent): void;
    dragEnd(): void;
    updateArc({ arc, line, boundingClientRect, startAngle, endAngle, dataset }: {
        arc: SVGPathElement;
        line: SVGLineElement;
        boundingClientRect: DOMRect;
        startAngle: number;
        endAngle: number;
        dataset?: Dataset;
    }): void;
    updateLine({ line, origin, distance, angle }: {
        line: SVGLineElement;
        origin: {
            x: number;
            y: number;
        };
        distance: number;
        angle: number;
    }): void;
}
export {};
