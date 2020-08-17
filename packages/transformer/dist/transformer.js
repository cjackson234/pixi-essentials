/*!
 * @pixi-essentials/transformer - v2.0.2
 * Compiled Mon, 17 Aug 2020 20:19:04 UTC
 *
 * @pixi-essentials/transformer is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Shukant K. Pal, All Rights Reserved
 */
this.PIXI=this.PIXI||{};var _pixi_essentials_transformer=function(t,e,s,n,i,o,r){"use strict";const a={color:16777215,outlineColor:0,outlineThickness:1,radius:8,shape:"tooth"};class h extends i.Graphics{constructor(t,e={},s,i,o){super();const r=Object.assign({},a,e);this._handle=t,this._style=r,this.onHandleDelta=s,this.onHandleCommit=i,this._dirty=!0,this.interactive=!0,this.cursor=o||"move",this._pointerDown=!1,this._pointerDragging=!1,this._pointerPosition=new n.Point,this.on("mousedown",this.onPointerDown,this),this.on("mousemove",this.onPointerMove,this),this.on("mouseup",this.onPointerUp,this),this.on("mouseupoutside",this.onPointerUp,this)}get style(){return this._style}set style(t){this._style=Object.assign({},a,t),this._dirty=!0}render(t){this._dirty&&(this.draw(),this._dirty=!1),super.render(t)}draw(){const t=this._handle,e=this._style,s=e.radius;if(this.lineStyle(e.outlineThickness,e.outlineColor).beginFill(e.color),"square"===e.shape)this.drawRect(-s/2,-s/2,s,s);else if("tooth"===e.shape)switch(t){case"middleLeft":this.drawPolygon([-s/2,-s/2,-s/2,s/2,s/2,s/2,1.1*s,0,s/2,-s/2]);break;case"topCenter":this.drawPolygon([-s/2,-s/2,s/2,-s/2,s/2,s/2,0,1.1*s,-s/2,s/2]);break;case"middleRight":this.drawPolygon([-s/2,s/2,1.1*-s,0,-s/2,-s/2,s/2,-s/2,s/2,s/2]);break;case"bottomCenter":this.drawPolygon([0,1.1*-s,s/2,-s/2,s/2,s/2,-s/2,s/2,-s/2,-s/2]);break;case"rotator":this.drawCircle(0,0,s/Math.sqrt(2));break;default:this.drawRect(-s/2,-s/2,s,s)}else this.drawCircle(0,0,s);this.endFill()}onPointerDown(t){this._pointerDown=!0,this._pointerDragging=!1,t.stopPropagation()}onPointerMove(t){this._pointerDown&&(this._pointerDragging?this.onDrag(t):this.onDragStart(t),t.stopPropagation())}onPointerUp(t){this._pointerDragging&&this.onDragEnd(t),this._pointerDown=!1}onDragStart(t){this._pointerPosition.copyFrom(t.data.global),this._pointerDragging=!0}onDrag(t){const e=t.data.global;this.onHandleDelta&&this.onHandleDelta(e),this._pointerPosition.copyFrom(e)}onDragEnd(t){this._pointerDragging=!1,this.onHandleCommit&&this.onHandleCommit()}}const l=new n.Matrix;function d(t){const e=l.identity();return e.c=Math.tan(t),e}function p(t){const e=l.identity();return e.b=Math.tan(t),e}function c(t,e,s,n=t.pivot){const i=e.a,o=e.b,r=e.c,a=e.d,h=-Math.atan2(-r,a),l=Math.atan2(o,i);return s=null!=s?s:l,t.pivot.set(n.x,n.y),t.rotation=s,t.skew.x=s+h,t.skew.y=-s+l,t.scale.x=Math.sqrt(i*i+o*o),t.scale.y=Math.sqrt(r*r+a*a),t.position.x=e.tx+(n.x*e.a+n.y*e.c),t.position.y=e.ty+(n.x*e.b+n.y*e.d),t}const w=new n.Matrix,u=new n.Matrix;function y(t,e,s){if(!s){const e=t.parent?t.parent:t.enableTempParent();t.updateTransform(),t.disableTempParent(e)}const i=t.worldTransform,o=t.parent?u.copyFrom(t.parent.worldTransform):n.Matrix.IDENTITY;w.copyFrom(i),w.prepend(e),w.prepend(o.invert()),c(t.transform,w)}const m=new n.Transform,g=[new n.Point,new n.Point,new n.Point,new n.Point],f=new n.Matrix,b=new n.Point,x=new o.OrientedBounds,_=new n.Rectangle,k=[new n.Point,new n.Point,new n.Point,new n.Point],P=new n.Point,T=r.ObjectPoolFactory.build(n.Point),M={topLeft:"nw-resize",topCenter:"n-resize",topRight:"ne-resize",middleLeft:"w-resize",middleRight:"e-resize",bottomLeft:"sw-resize",bottomCenter:"s-resize",bottomRight:"se-resize"},v=["topLeft","topCenter","topRight","middleLeft","middleCenter","middleRight","bottomLeft","bottomCenter","bottomRight"],B={topLeft:{x:-1,y:-1},topCenter:{x:0,y:-1},topRight:{x:1,y:-1},middleLeft:{x:-1,y:0},middleCenter:{x:0,y:0},middleRight:{x:1,y:0},bottomLeft:{x:-1,y:1},bottomCenter:{x:0,y:1},bottomRight:{x:1,y:1}},E=[...v,"rotator","skewHorizontal","skewVertical"],I=[Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,3*-Math.PI/4,-Math.PI],S=Math.PI/90,L=[Math.PI/4,-Math.PI/4],C=Math.PI/90,D={color:0,thickness:2};class H extends s.Container{constructor(t={}){super(),this.translateGroup=t=>{const e=f.identity().translate(t.x,t.y);this.prependTransform(e)},this.rotateGroup=(t,e)=>{const s=this.groupBounds,n=this.worldTransform.apply(this.handles[t].position,b);this.projectionTransform.applyInverse(n,n),e=this.projectionTransform.applyInverse(e,P);const i=s.center,o=Math.atan2(n.y-i.y,n.x-i.x);let r=Math.atan2(e.y-i.y,e.x-i.x)-o,a=this.groupBounds.rotation+r;a=this.snapAngle(a,this.rotationSnapTolerance,this.rotationSnaps),r=a-this.groupBounds.rotation;const h=f.identity().translate(-i.x,-i.y).rotate(r).translate(i.x,i.y);this.prependTransform(h,!0),this.updateGroupBounds(a),this._skewX+=r,this._skewY+=r},this.scaleGroup=(t,e)=>{const s=B[t].x,n=B[t].y,i=this.groupBounds,o=i.rotation,r=i.innerBounds,a=this.worldTransform.apply(this.handles[t].position,b);this.projectionTransform.applyInverse(a,a);const h=(e=this.projectionTransform.applyInverse(e,P)).x-a.x,l=e.y-a.y,d=(i.topRight.x-i.topLeft.x)/r.width,p=(i.topRight.y-i.topLeft.y)/r.width,c=h*((i.bottomLeft.x-i.topLeft.x)/r.height)+l*((i.bottomLeft.y-i.topLeft.y)/r.height),w=1+(h*d+l*p)*s/r.width,u=1+c*n/r.height,y=f.identity();if(0!==s){const t=this.centeredScaling?i.center:1===s?i.topLeft:i.topRight;y.translate(-t.x,-t.y).rotate(-o).scale(w,1).rotate(o).translate(t.x,t.y)}if(0!==n){const t=this.centeredScaling?i.center:1===n?i.topLeft:i.bottomLeft;y.translate(-t.x,-t.y).rotate(-o).scale(1,u).rotate(o).translate(t.x,t.y)}this.prependTransform(y)},this.skewGroup=(t,e)=>{const s=this.groupBounds,n=b.copyFrom(e);this.projectionTransform.applyInverse(n,n);const i=s.center,o=f.identity().translate(-i.x,-i.y);let r=this.groupBounds.rotation;if("skewHorizontal"===t){const t=this._skewX;this._skewX=Math.atan2(n.y-i.y,n.x-i.x),this._skewX=this.snapAngle(this._skewX,this.skewSnapTolerance,this.skewSnaps),o.prepend(p(-t)),o.prepend(p(this._skewX))}else{const t=this._skewY,e=Math.atan2(n.y-i.y,n.x-i.x)-Math.PI/2;this._skewY=e,this._skewY=this.snapAngle(this._skewY,this.skewSnapTolerance,this.skewSnaps),o.prepend(d(t)),o.prepend(d(-this._skewY)),r-=this._skewY-t}o.translate(i.x,i.y),this.prependTransform(o,!0),this.updateGroupBounds(r)},this.commitGroup=()=>{!1!==this.transientGroupTilt&&this.group.length>1&&this.updateGroupBounds(0)},this.interactive=!0,this.cursor="move",this.group=t.group||[],this.centeredScaling=!!t.centeredScaling,this.projectionTransform=new n.Matrix,this.rotationSnaps=t.rotationSnaps||I,this.rotationSnapTolerance=void 0!==t.rotationSnapTolerance?t.rotationSnapTolerance:S,this.skewRadius=t.skewRadius||64,this.skewSnaps=t.skewSnaps||L,this.skewSnapTolerance=void 0!==t.skewSnapTolerance?t.skewSnapTolerance:C,this._rotateEnabled=!1!==t.rotateEnabled,this._scaleEnabled=!1!==t.scaleEnabled,this._skewEnabled=!0===t.skewEnabled,this.translateEnabled=!1!==t.translateEnabled,this.transientGroupTilt=void 0===t.transientGroupTilt||t.transientGroupTilt,this.wireframe=this.addChild(new i.Graphics),this._skewX=0,this._skewY=0,this._wireframeStyle=Object.assign({},D,t.wireframeStyle||{});const e=t.handleConstructor||h,s=t.handleStyle||{};this._handleStyle=s;const r={rotator:this.addChild(new e("rotator",s,t=>{this.rotateGroup("rotator",t)},this.commitGroup))},a=v.reduce((t,n)=>(t[n]=new e(n,s,t=>{this.scaleGroup(n,t)},this.commitGroup,M[n]),t[n].visible=this._scaleEnabled,this.addChild(t[n]),t),{}),l={skewHorizontal:this.addChild(new e("skewHorizontal",s,t=>{this.skewGroup("skewHorizontal",t)},this.commitGroup,"pointer")),skewVertical:this.addChild(new e("skewVertical",s,t=>{this.skewGroup("skewVertical",t)},this.commitGroup,"pointer"))};this.handles=Object.assign({},r,a,l),this.handles.middleCenter.visible=!1,this.handles.skewHorizontal.visible=this._skewEnabled,this.handles.skewVertical.visible=this._skewEnabled,this.groupBounds=new o.OrientedBounds,this.updateGroupBounds(),this._pointerDown=!1,this._pointerDragging=!1,this._pointerPosition=new n.Point,this.on("pointerdown",this.onPointerDown,this),this.on("pointermove",this.onPointerMove,this),this.on("pointerup",this.onPointerUp,this),this.on("pointerupoutside",this.onPointerUp,this)}get enabledHandles(){return this._enabledHandles}set enabledHandles(t){(this._enabledHandles||t)&&(this._enabledHandles=t,E.forEach(t=>{this.handles[t].visible=!1}),t?t.forEach(t=>{this.handles[t].visible=!0}):(this.handles.rotator.visible=this._rotateEnabled,this.handles.skewHorizontal.visible=this._skewEnabled,this.handles.skewVertical.visible=this._skewEnabled,v.forEach(t=>{"middleCenter"!==t&&(this.handles[t].visible=this._scaleEnabled)})))}get handleStyle(){return this._handleStyle}set handleStyle(t){const e=this.handles;for(const s in e)e[s].style=t;this._handleStyle=t}get rotateEnabled(){return this._rotateEnabled}set rotateEnabled(t){if(!this._rotateEnabled!==t){if(this._rotateEnabled=t,this._enabledHandles)return;this.handles.rotator.visible=t}}get scaleEnabled(){return this._scaleEnabled}set scaleEnabled(t){if(!this._scaleEnabled!==t){if(this._scaleEnabled=t,this._enabledHandles)return;v.forEach(e=>{"middleCenter"!==e&&(this.handles[e].visible=t)})}}get skewEnabled(){return this._skewEnabled}set skewEnabled(t){if(this._skewEnabled!==t){if(this._skewEnabled=t,this._enabledHandles)return;this.handles.skewHorizontal.visible=t,this.handles.skewVertical.visible=t}}get wireframeStyle(){return this._wireframeStyle}set wireframeStyle(t){this._wireframeStyle=Object.assign({},D,t)}render(t){this.draw(),super.render(t)}draw(){const t=this.group,{color:e,thickness:s}=this._wireframeStyle;this.wireframe.clear().lineStyle(s,e);for(let e=0,s=t.length;e<s;e++)this.drawBounds(H.calculateOrientedBounds(t[e],x));const n=1!==t.length?H.calculateGroupOrientedBounds(t,this.groupBounds.rotation,x,!0):H.calculateOrientedBounds(t[0],x);this.drawBounds(n),this.drawHandles(n),this.groupBounds.copyFrom(n)}drawBounds(t){const e=k;for(let s=0;s<4;s++)this.toTransformerLocal(t.hull[s],e[s]);this.wireframe.beginFill(16777215,1e-4).drawPolygon(e).endFill()}drawHandles(t){const e=this.handles,{topLeft:s,topRight:n,bottomLeft:i,bottomRight:o,center:r}=t,[a,h,l,d]=k,p=b;if(this.toTransformerLocal(s,a),this.toTransformerLocal(n,h),this.toTransformerLocal(i,l),this.toTransformerLocal(o,d),this.toTransformerLocal(r,p),this._rotateEnabled){const t=(a.x+h.x)/2,s=(a.y+h.y)/2;let n=-(a.y-h.y),i=a.x-h.x;const o=Math.sqrt(n*n+i*i);n*=32/o,i*=32/o,e.rotator.position.x=t+n,e.rotator.position.y=s+i,this.wireframe.moveTo(t,s).lineTo(e.rotator.position.x,e.rotator.position.y)}if(this._scaleEnabled&&(e.topLeft.position.copyFrom(a),e.topCenter.position.set((a.x+h.x)/2,(a.y+h.y)/2),e.topRight.position.copyFrom(h),e.middleLeft.position.set((a.x+l.x)/2,(a.y+l.y)/2),e.middleCenter.position.set((a.x+d.x)/2,(a.y+d.y)/2),e.middleRight.position.set((h.x+d.x)/2,(h.y+d.y)/2),e.bottomLeft.position.copyFrom(l),e.bottomCenter.position.set((l.x+d.x)/2,(l.y+d.y)/2),e.bottomRight.position.copyFrom(d)),this._skewEnabled){const t=p.x,s=p.y;this.worldTransform.apply(p,p),e.skewHorizontal.position.set(p.x+Math.cos(this._skewX)*this.skewRadius,p.y+Math.sin(this._skewX)*this.skewRadius),e.skewVertical.position.set(p.x+-Math.sin(this._skewY)*this.skewRadius,p.y+Math.cos(this._skewY)*this.skewRadius),this.worldTransform.applyInverse(e.skewHorizontal.position,e.skewHorizontal.position),this.worldTransform.applyInverse(e.skewVertical.position,e.skewVertical.position),p.set(t,s),this.wireframe.beginFill(this.wireframeStyle.color).drawCircle(p.x,p.y,2*this.wireframeStyle.thickness).endFill(),this.wireframe.moveTo(p.x,p.y).lineTo(e.skewHorizontal.x,e.skewHorizontal.y).moveTo(p.x,p.y).lineTo(e.skewVertical.x,e.skewVertical.y)}for(const t in e){let s=this.groupBounds.rotation;"skewHorizontal"===t?s=this._skewX:"skewVertical"===t&&(s=this._skewY);const n=e[t];n.rotation=s,n.getBounds(!1,_)}}onPointerDown(t){this._pointerDown=!0,this._pointerDragging=!1,t.stopPropagation()}onPointerMove(t){if(!this._pointerDown)return;const e=this._pointerPosition,s=b.copyFrom(t.data.global),n=s.x,i=s.y;if(this._pointerDragging&&this.translateEnabled){const[t,n,i]=k;t.set(0,0),n.set(s.x-e.x,s.y-e.y),this.projectionTransform.applyInverse(t,t),this.projectionTransform.applyInverse(n,n),i.set(n.x-t.x,n.y-t.y),this.translateGroup(i)}this._pointerPosition.x=n,this._pointerPosition.y=i,this._pointerDragging=!0,t.stopPropagation()}onPointerUp(t){this._pointerDragging=!1,this._pointerDown=!1,t.stopPropagation()}prependTransform(t,e=!1){const s=this.group;for(let e=0,n=s.length;e<n;e++)y(s[e],t,!1);e||this.updateGroupBounds(),this.emit("transformchange")}updateGroupBounds(t=this.groupBounds.rotation){H.calculateGroupOrientedBounds(this.group,t,this.groupBounds)}snapAngle(t,e,s){if(t%=2*Math.PI,!s||1===s.length||!e)return t;for(let n=0,i=s.length;n<i;n++)if(Math.abs(t-s[n])<=e)return s[n];return t}toTransformerLocal(t,e){return this.projectionTransform.apply(t,e),this.worldTransform.applyInverse(e,e),e}static calculateTransformedCorners(t,e=t.worldTransform,s,i=0){const o=t.getLocalBounds();return t.getBounds(),(s=s||[new n.Point,new n.Point,new n.Point,new n.Point])[i].set(o.x,o.y),s[i+1].set(o.x+o.width,o.y),s[i+2].set(o.x+o.width,o.y+o.height),s[i+3].set(o.x,o.y+o.height),e.apply(s[i],s[i]),e.apply(s[i+1],s[i+1]),e.apply(s[i+2],s[i+2]),e.apply(s[i+3],s[i+3]),s}static calculateOrientedBounds(t,e){const s=t.parent?t.parent:t.enableTempParent();t.updateTransform(),t.disableTempParent(s),c(m,t.worldTransform),m.updateLocalTransform();const n=m.rotation,i=H.calculateTransformedCorners(t,t.worldTransform,g),r=(i[0].x+i[1].x+i[2].x+i[3].x)/4,a=(i[0].y+i[1].y+i[2].y+i[3].y)/4,h=f.identity().translate(-r,-a).rotate(-m.rotation).translate(r,a);return h.apply(i[0],i[0]),h.apply(i[1],i[1]),h.apply(i[2],i[2]),h.apply(i[3],i[3]),(e=e||new o.OrientedBounds).rotation=n,e.innerBounds.x=Math.min(i[0].x,i[1].x,i[2].x,i[3].x),e.innerBounds.y=Math.min(i[0].y,i[1].y,i[2].y,i[3].y),e.innerBounds.width=Math.max(i[0].x,i[1].x,i[2].x,i[3].x)-e.innerBounds.x,e.innerBounds.height=Math.max(i[0].y,i[1].y,i[2].y,i[3].y)-e.innerBounds.y,e}static calculateGroupOrientedBounds(t,e,s,n=!1){const i=t.length,r=T.allocateArray(4*i);for(let e=0;e<i;e++){const s=t[e];if(!n){const t=s.parent?s.parent:s.enableTempParent();s.updateTransform(),s.disableTempParent(t)}H.calculateTransformedCorners(s,s.worldTransform,r,4*e)}const a=f.identity().rotate(-e);let h=Number.MAX_VALUE,l=Number.MAX_VALUE,d=-Number.MAX_VALUE,p=-Number.MAX_VALUE;for(let t=0,e=r.length;t<e;t++){const e=r[t];a.apply(e,e);const s=e.x,n=e.y;h=s<h?s:h,l=n<l?n:l,d=s>d?s:d,p=n>p?n:p}return T.releaseArray(r),(s=s||new o.OrientedBounds).innerBounds.x=h,s.innerBounds.y=l,s.innerBounds.width=d-h,s.innerBounds.height=p-l,s.rotation=e,a.applyInverse(s.center,b),s.center.copyFrom(b),s}}return t.Transformer=H,t.TransformerHandle=h,t}({},0,PIXI,PIXI,PIXI,PIXI,PIXI);Object.assign(this.PIXI,_pixi_essentials_transformer);
//# sourceMappingURL=transformer.js.map
