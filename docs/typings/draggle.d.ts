// Type definitions for draggable 4.2.0
// Project: https://github.com/bcherny/draggable
// Definitions by: ibreeze2017 <https://www.ruwind.top>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.4.5

declare module 'draggable/*' {
  /**
   * limit x/y drag bounds
   */
  type ILimit = number | number[] | null;

  /**
   * limit bounds interface
   */
  interface ILimitBounds {
    x: ILimit;
    y: ILimit;
  }

  export interface DraggableOptions {
    /**
     *  grid size for snapping on drag
     *  @default {0}
     */
    grid?: number;
    /**
     * the handle of the draggable; if null, the whole element is the handle
     * @default {null}
     */
    handle: Element;
    /**
     * prevent drag when target passes this test
     */
    filterTarget?: Function;
    /**
     * limit x/y drag bounds
     * @default {{x:null,y:null}}
     */
    limit?: Element | ILimit | ((x: number, y: number, x0: number, y0: number) => ILimitBounds);
    /**
     * threshold before drag begins (in px)
     * @default {0}
     */
    threshold?: number;
    /**
     * change cursor to move
     * @default {false}
     */
    setCursor?: boolean;
    /**
     * change draggable position to absolute
     * @default {true}
     */
    setPosition?: boolean;
    /**
     * snap to grid only when dropped, not during drag
     * @default {true}
     */
    smoothDrag?: boolean;
    /**
     *    move graphics calculation/composition to the GPU? (modern browsers only, graceful degradation)
     * @default {true}
     */
    useGPU?: boolean;

    onDrag?(element: Element, x: number, y: number, event: DragEvent): void;

    onDragStart?(element: Element, x: number, y: number, event: DragEvent): void;

    onDragEnd?(element: Element, x: number, y: number, event: DragEvent): void;
  }

  export default class Draggable {
    constructor(ele: Element, options?: DraggableOptions);

    /**
     * Get the current coordinates
     * @returns {{x: number; y: number}}
     */
    get(): { x: number, y: number }

    /**
     * Move to the specified coordinates
     * @param {number} x
     * @param {number} y
     * @returns {this}
     */
    set(x: number, y: number): this;

    /**
     * Set an option in the live instance
     * @param {string} property
     * @param value
     * @returns {this}
     */
    setOption(property: string, value: any): this;

    /**
     * Unbind the instance's DOM event listeners
     */
    destroy(): void;
  }
}