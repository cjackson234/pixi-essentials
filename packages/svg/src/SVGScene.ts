import { DisplayObject, Container } from '@pixi/display';
import { InheritedPaintProvider } from './paint/InheritedPaintProvider';
import { MaskServer } from './mask/MaskServer';
import { LINE_CAP, LINE_JOIN, GraphicsData } from '@pixi/graphics';
import { Matrix, Rectangle } from '@pixi/math';
import { PaintProvider } from './paint/PaintProvider';
import { PaintServer } from './paint/PaintServer';
import { RenderTexture, Texture } from '@pixi/core';
import { SVGGraphicsNode } from './SVGGraphicsNode';
import { SVGImageNode } from './SVGImageNode';
import { SVGPathNode } from './SVGPathNode';
import { SVGTextNode } from './SVGTextNode';
import { SVGUseNode } from './SVGUseNode';

import type { Paint } from './paint/Paint';
import type { Renderer } from '@pixi/core';

const tempMatrix = new Matrix();
const tempRect = new Rectangle();

/**
 * {@link SVGScene} can be used to build an interactive viewer for scalable vector graphics images. You must specify the size
 * of the svg viewer.
 */
export class SVGScene extends DisplayObject
{
    /**
     * The SVG image content being rendered by the scene.
     */
    public content: SVGSVGElement;

    /**
     * The root display object of the scene.
     */
    public root: Container;

    /**
     * Display objects that don't render to the screen, but are required to update before the rendering
     * nodes, e.g. mask sprites.
     */
    public renderServers: Container;

    /**
     * The width of the rendered scene in local space.
     */
    protected _width: number;

    /**
     * The height of the rendered scene in local space.
     */
    protected _height: number;

    /**
     * Maps content elements to their paint. These paints do not inherit from their parent element. You must
     * compose an {@link InheritedPaintProvider} manually.
     */
    private _elementToPaint: Map<SVGElement, Paint>;

    /**
     * Maps `SVGMaskElement` elements to their nodes. These are not added to the scene graph directly and are
     * only referenced as a `mask`.
     */
    private _elementToMask: Map<SVGElement, MaskServer>;

    /**
     * @param content - the SVG node to render
     */
    constructor(content: SVGSVGElement)
    {
        super();

        this.content = content;
        this._width = 0;
        this._height = 0;

        this._elementToPaint = new Map();
        this._elementToMask = new Map();

        this.renderServers = new Container();
        this.root = this.populateScene(content);

        this.root.addChildAt(this.renderServers, 0);
    }

    /**
     * Calculates the bounds of this scene, which is defined by the set `width` and `height`. The contents
     * of this scene are scaled to fit these bounds, and don't affect them whatsoever.
     *
     * @override
     */
    calculateBounds(): void
    {
        this._bounds.addFrameMatrix(this.worldTransform, 0, 0, this.width, this.height);
    }

    render(renderer: Renderer): void
    {
        this.root.render(renderer);
    }

    updateTransform(): void
    {
        super.updateTransform();

        this.root.enableTempParent();
        this.root.transform.setFromMatrix(this.worldTransform);
        this.root.updateTransform();
        this.root.disableTempParent(null);
    }

    protected createNode(element: SVGElement): Container
    {
        let renderNode = null;

        switch (element.nodeName.toLowerCase())
        {
            case 'circle':
            case 'g':
            case 'line':
            case 'polyline':
            case 'polygon':
            case 'rect':
                renderNode = new SVGGraphicsNode();
                break;
            case 'image':
                renderNode = new SVGImageNode();
                break;
            case 'mask':
            case 'svg':
                renderNode = new Container();
                break;
            case 'path':
                renderNode = new SVGPathNode();
                break;
            case 'text':
                renderNode = new SVGTextNode();
                break;
            case 'use':
                renderNode = new SVGUseNode();
                break;
            default:
                renderNode = null;
                break;
        }

        return renderNode;
    }

    /**
     * Creates a `Paint` object for the given element. This should only be used when sharing the `Paint`
     * is not desired; otherwise, use {@link SVGScene.queryPaint}.
     *
     * This will return `null` if the passed element is not an instance of `SVGElement`.
     *
     * @alpha
     * @param element
     */
    protected createPaint(element: SVGElement): Paint
    {
        if (!(element instanceof SVGElement))
        {
            return null;
        }

        return new PaintProvider(element);
    }

    /**
     * Creates a lazy paint texture for the paint server.
     *
     * @alpha
     * @param paintServer - The paint server to be rendered.
     */
    protected createPaintServer(paintServer: SVGGradientElement): Texture
    {
        const renderTexture = RenderTexture.create({
            width: 128,
            height: 128,
        });

        return new PaintServer(paintServer, renderTexture);
    }

    /**
     * Creates a lazy luminance mask for the `SVGMaskElement` or its rendering node.
     *
     * @param ref - The `SVGMaskElement` or its rendering node, if already generated.
     */
    protected createMask(ref: SVGMaskElement | Container): MaskServer
    {
        if (ref instanceof SVGElement)
        {
            ref = this.populateScene(ref, {
                basePaint: this.queryInheritedPaint(ref),
            });
        }

        const localBounds = ref.getLocalBounds();

        ref.getBounds();

        const maskTexture = RenderTexture.create({
            width: localBounds.width,
            height: localBounds.height,
        });

        const maskSprite = new MaskServer(maskTexture);

        // Lazily render mask when needed.
        maskSprite.addChild(ref);

        return maskSprite;
    }

    /**
     * Returns the rendering node for a mask.
     *
     * @alpha
     * @param ref - The mask element whose rendering node is needed.
     */
    protected queryMask(ref: SVGMaskElement): MaskServer
    {
        let queryHit = this._elementToMask.get(ref);

        if (!queryHit)
        {
            queryHit = this.createMask(ref);

            this._elementToMask.set(ref, queryHit);
        }

        return queryHit;
    }

    /**
     * Returns the cached paint of a content element. The returned paint will not account for any paint
     * attributes inherited from ancestor elements.
     *
     * @alpha
     * @param ref - A reference to the content element.
     */
    protected queryPaint(ref: SVGElement): Paint
    {
        let queryHit = this._elementToPaint.get(ref);

        if (!queryHit)
        {
            queryHit = this.createPaint(ref);
            this._elementToPaint.set(ref, queryHit);
        }

        return queryHit;
    }

    /**
     * Returns an (uncached) inherited paint of a content element.
     *
     * @alpha
     * @param ref
     */
    protected queryInheritedPaint(ref: SVGElement): Paint
    {
        const paint = this.queryPaint(ref);
        const parentPaint = ref.parentElement && this.queryPaint(ref.parentElement as unknown as SVGElement);

        if (!parentPaint)
        {
            return paint;
        }

        return new InheritedPaintProvider(parentPaint, paint);
    }

    protected parseReference(url: string): string
    {
        if (url.startsWith('url'))
        {
            let contents = url.slice(4, -1);

            if (contents.startsWith('\'') && contents.endsWith('\'')) {
                contents = contents.slice(1, -1);
            }

            return contents;
        }

        return url;
    }

    /**
     * Embeds a content `element` into the rendering `node`.
     *
     * This is **not** a stable API.
     *
     * @alpha
     * @param node - The node in this scene that will render the `element`.
     * @param element - The content `element` to be rendered. This must be an element of the SVG document
     *  fragment under `this.content`.
     * @param options - Additional options
     * @param {Paint} [options.basePaint] - the base paint that the element's paint should inherit from
     */
    protected embedIntoNode(
        node: Container,
        element: SVGGraphicsElement | SVGMaskElement,
        options: {
            basePaint?: Paint;
        } = {},
    ): {
        paint: Paint;
    }
    {
        const {
            basePaint,
        } = options;

        // Paint
        const paint = basePaint ? new InheritedPaintProvider(basePaint, this.queryPaint(element)) : this.queryPaint(element);
        const {
            fill,
            opacity,
            stroke,
            strokeDashArray,
            strokeDashOffset,
            strokeLineCap,
            strokeLineJoin,
            strokeMiterLimit,
            strokeWidth,
        } = paint;

        // Transform
        const transform = element instanceof SVGGraphicsElement ? element.transform.baseVal.consolidate() : null;
        const transformMatrix = transform ? transform.matrix : tempMatrix.identity();

        if (node instanceof SVGGraphicsNode)
        {
            if (fill === 'none')
            {
                node.beginFill(0, 0);
            }
            else if (typeof fill === 'number')
            {
                node.beginFill(fill, opacity === null ? 1 : opacity);
            }
            else if (!fill)
            {
                node.beginFill(0);
            }
            else
            {
                const ref = fill
                    .replace('url(', '')
                    .slice(1, -2);// Remove single quotes + the ending ')' parenthesis
                const paintElement = this.content.querySelector(ref);

                if (paintElement && paintElement instanceof SVGGradientElement)
                {
                    const paintServer = this.createPaintServer(paintElement);
                    const paintTexture = paintServer.paintTexture;

                    node.paintServers.push(paintServer);
                    node.beginTextureFill({
                        texture: paintTexture,
                        alpha: opacity === null ? 1 : opacity,
                        matrix: new Matrix(),
                    });
                }
            }

            let strokeTexture: Texture;

            if (typeof stroke === 'string' && stroke.startsWith('url'))
            {
                const ref = this.parseReference(stroke);
                const paintElement = this.content.querySelector(ref);

                if (paintElement && paintElement instanceof SVGGradientElement)
                {
                    const paintServer = this.createPaintServer(paintElement);
                    const paintTexture = paintServer.paintTexture;

                    node.paintServers.push(paintServer);
                    strokeTexture = paintTexture;
                }
            }

            node.lineTextureStyle({
                /* eslint-disable no-nested-ternary */
                color: stroke === null ? 0 : (typeof stroke === 'number' ? stroke : 0xffffff),
                cap: strokeLineCap === null ? LINE_CAP.SQUARE : strokeLineCap as unknown as LINE_CAP,
                dashArray: strokeDashArray,
                dashOffset: strokeDashOffset === null ? strokeDashOffset : 0,
                join: strokeLineJoin === null ? LINE_JOIN.MITER : strokeLineJoin as unknown as LINE_JOIN,
                miterLimit: strokeMiterLimit === null ? 150 : strokeMiterLimit,
                texture: strokeTexture || Texture.WHITE,
                width: strokeWidth === null ? (stroke ? 1 : 0) : strokeWidth,
                /* eslint-enable no-nested-ternary */
            });
        }

        switch (element.nodeName.toLowerCase())
        {
            case 'circle':
                (node as SVGGraphicsNode).embedCircle(element as SVGCircleElement);
                break;
            case 'image':
                (node as SVGImageNode).embedImage(element as SVGImageElement);
                break;
            case 'line':
                (node as SVGGraphicsNode).embedLine(element as SVGLineElement);
                break;
            case 'path':
                (node as SVGPathNode).embedPath(element as SVGPathElement);
                break;
            case 'polyline':
                (node as SVGGraphicsNode).embedPolyline(element as SVGPolylineElement);
                break;
            case 'polygon':
                (node as SVGGraphicsNode).embedPolygon(element as SVGPolygonElement);
                break;
            case 'rect':
                (node as SVGGraphicsNode).embedRect(element as SVGRectElement);
                break;
            case 'text':
                (node as SVGTextNode).embedText(element as SVGTextElement);
                break;
            case 'use': {
                const useElement = element as SVGUseElement;
                const useTargetURL = useElement.getAttribute('href') || useElement.getAttribute('xlink:href');
                const useTarget = this.content.querySelector(useTargetURL);
                const usePaint = this.queryPaint(useElement);

                const contentNode = this.populateScene(useTarget as SVGGraphicsElement, {
                    basePaint: usePaint,
                }) as SVGGraphicsNode;

                (node as SVGUseNode).ref = contentNode;
                contentNode.transform.setFromMatrix(Matrix.IDENTITY);// clear transform

                (node as SVGUseNode).embedUse(useElement);
            }
        }

        node.transform.setFromMatrix(tempMatrix.set(
            transformMatrix.a,
            transformMatrix.b,
            transformMatrix.c,
            transformMatrix.d,
            transformMatrix instanceof Matrix ? transformMatrix.tx : transformMatrix.e,
            transformMatrix instanceof Matrix ? transformMatrix.ty : transformMatrix.f,
        ));

        if (element instanceof SVGMaskElement)
        {
            this._elementToMask.set(element, this.createMask(node));
        }

        const maskURL = element.getAttribute('mask');

        if (maskURL)
        {
            const maskElement: SVGMaskElement = this.content.querySelector(this.parseReference(maskURL));

            if (maskElement)
            {
                const maskServer = this.queryMask(maskElement);
                const maskSprite = maskServer.createMask(node);

                this.renderServers.addChild(maskServer);
                node.mask = maskSprite;
                node.addChild(maskSprite);
            }
        }

        if (element instanceof SVGTextElement && node instanceof SVGTextNode)
        {
            node.y -= node.style.fontSize;
        }

        return {
            paint,
        };
    }

    protected populateScene(
        element: SVGElement,
        options?: {
            basePaint?: Paint;
        },
    ): Container
    {
        const node = this.createNode(element);

        if (!node)
        {
            return null;
        }

        let paint;

        if (element instanceof SVGGraphicsElement || element instanceof SVGMaskElement)
        {
            const opts = this.embedIntoNode(node, element, options);

            paint = opts.paint;
        }

        for (let i = 0, j = element.children.length; i < j; i++)
        {
            // eslint-disable-next-line
            // @ts-ignore
            const childNode = this.populateScene(element.children[i], {
                basePaint: paint,
            });

            if (childNode)
            {
                node.addChild(childNode);
            }
        }

        if (node instanceof SVGGraphicsNode)
        {
            const bbox = node.getLocalBounds(tempRect);
            const { x, y } = bbox;
            const w = Math.ceil(bbox.width);
            const h = Math.ceil(bbox.height);

            node.paintServers.forEach(({ paintTexture }) =>
            {
                paintTexture.resize(w, h, true);
            });

            const geometry = node.geometry;
            const graphicsData: GraphicsData[] = (geometry as any).graphicsData;

            if (graphicsData)
            {
                graphicsData.forEach((data) =>
                {
                    if (data.fillStyle.matrix)
                    {
                        data.fillStyle.matrix.invert().translate(x, y).invert();
                    }
                });

                geometry.updateBatches();
            }
        }

        if (element instanceof SVGMaskElement)
        {
            // Mask elements are *not* a part of the scene graph.
            return null;
        }

        return node;
    }

    get width(): number
    {
        return this._width;
    }

    set width(value: number)
    {
        this._width = value;
        this.scale.x = this._width / this.content.viewBox.baseVal.width;
    }

    get height(): number
    {
        return this._height;
    }

    set height(value: number)
    {
        this._height = value;
        this.scale.y = this._height / this.content.viewBox.baseVal.height;
    }
}
