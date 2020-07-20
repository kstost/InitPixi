let $pxi = {
    install_pixi_layers: function () {
        var pixi_display;
        (function (pixi_display) {
            Object.assign(PIXI.Container.prototype, {
                render: function (renderer) {
                    if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
                        return;
                    }
                    if (!this.visible) {
                        this.displayOrder = 0;
                        return;
                    }
                    this.displayOrder = renderer.incDisplayOrder();
                    if (this.worldAlpha <= 0 || !this.renderable) {
                        return;
                    }
                    renderer._activeLayer = null;
                    this.containerRenderWebGL(renderer);
                    renderer._activeLayer = this._activeParentLayer;
                },
                renderCanvas: function (renderer) {
                    if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
                        return;
                    }
                    if (!this.visible) {
                        this.displayOrder = 0;
                        return;
                    }
                    this.displayOrder = renderer.incDisplayOrder();
                    if (this.worldAlpha <= 0 || !this.renderable) {
                        return;
                    }
                    renderer._activeLayer = null;
                    this.containerRenderCanvas(renderer);
                    renderer._activeLayer = this._activeParentLayer;
                },
                containerRenderWebGL: PIXI.Container.prototype.render,
                containerRenderCanvas: PIXI.Container.prototype.renderCanvas
            });
        })(pixi_display || (pixi_display = {}));
        Object.assign(PIXI.DisplayObject.prototype, {
            parentLayer: null,
            _activeParentLayer: null,
            parentGroup: null,
            zOrder: 0,
            zIndex: 0,
            updateOrder: 0,
            displayOrder: 0,
            layerableChildren: true,
            isLayer: false
        });
        if (PIXI.ParticleContainer) {
            PIXI.ParticleContainer.prototype.layerableChildren = false;
        }
        else if (PIXI.ParticleContainer) {
            PIXI.ParticleContainer.prototype.layerableChildren = false;
        }
        var __extends = (this && this.__extends) || (function () {
            var extendStatics = function (d, b) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                return extendStatics(d, b);
            };
            return function (d, b) {
                extendStatics(d, b);
                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        })();
        var pixi_display;
        (function (pixi_display) {
            var utils = PIXI.utils;
            var Group = (function (_super) {
                __extends(Group, _super);
                function Group(zIndex, sorting) {
                    var _this = _super.call(this) || this;
                    _this._activeLayer = null;
                    _this._activeStage = null;
                    _this._activeChildren = [];
                    _this._lastUpdateId = -1;
                    _this.useRenderTexture = false;
                    _this.useDoubleBuffer = false;
                    _this.sortPriority = 0;
                    _this.clearColor = new Float32Array([0, 0, 0, 0]);
                    _this.canDrawWithoutLayer = false;
                    _this.canDrawInParentStage = true;
                    _this.zIndex = 0;
                    _this.enableSort = false;
                    _this._tempResult = [];
                    _this._tempZero = [];
                    _this.useZeroOptimization = false;
                    _this.zIndex = zIndex;
                    _this.enableSort = !!sorting;
                    if (typeof sorting === 'function') {
                        _this.on('sort', sorting);
                    }
                    return _this;
                }
                Group.prototype.doSort = function (layer, sorted) {
                    if (this.listeners('sort', true)) {
                        for (var i = 0; i < sorted.length; i++) {
                            this.emit('sort', sorted[i]);
                        }
                    }
                    if (this.useZeroOptimization) {
                        this.doSortWithZeroOptimization(layer, sorted);
                    }
                    else {
                        sorted.sort(Group.compareZIndex);
                    }
                };
                Group.compareZIndex = function (a, b) {
                    if (a.zOrder < b.zOrder) {
                        return -1;
                    }
                    if (a.zOrder > b.zOrder) {
                        return 1;
                    }
                    return a.updateOrder - b.updateOrder;
                };
                Group.prototype.doSortWithZeroOptimization = function (layer, sorted) {
                    throw new Error("not implemented yet");
                };
                Group.prototype.clear = function () {
                    this._activeLayer = null;
                    this._activeStage = null;
                    this._activeChildren.length = 0;
                };
                Group.prototype.addDisplayObject = function (stage, displayObject) {
                    this.check(stage);
                    displayObject._activeParentLayer = this._activeLayer;
                    if (this._activeLayer) {
                        this._activeLayer._activeChildren.push(displayObject);
                    }
                    else {
                        this._activeChildren.push(displayObject);
                    }
                };
                Group.prototype.foundLayer = function (stage, layer) {
                    this.check(stage);
                    if (this._activeLayer != null) {
                        Group.conflict();
                    }
                    this._activeLayer = layer;
                    this._activeStage = stage;
                };
                Group.prototype.foundStage = function (stage) {
                    if (!this._activeLayer && !this.canDrawInParentStage) {
                        this.clear();
                    }
                };
                Group.prototype.check = function (stage) {
                    if (this._lastUpdateId < Group._layerUpdateId) {
                        this._lastUpdateId = Group._layerUpdateId;
                        this.clear();
                        this._activeStage = stage;
                    }
                    else if (this.canDrawInParentStage) {
                        var current = this._activeStage;
                        while (current && current != stage) {
                            current = current._activeParentStage;
                        }
                        this._activeStage = current;
                        if (current == null) {
                            this.clear();
                            return;
                        }
                    }
                };
                Group.conflict = function () {
                    if (Group._lastLayerConflict + 5000 < Date.now()) {
                        Group._lastLayerConflict = Date.now();
                        console.log("PIXI-display plugin found two layers with the same group in one stage - that's not healthy. Please place a breakpoint here and debug it");
                    }
                };
                Group._layerUpdateId = 0;
                Group._lastLayerConflict = 0;
                return Group;
            }(utils.EventEmitter));
            pixi_display.Group = Group;
        })(pixi_display || (pixi_display = {}));
        var pixi_display;
        (function (pixi_display) {
            var InteractionManager = PIXI.interaction.InteractionManager;
            Object.assign(InteractionManager.prototype, {
                _queue: [[], []],
                _displayProcessInteractive: function (point, displayObject, hitTestOrder, interactive, outOfMask) {
                    if (!displayObject || !displayObject.visible) {
                        return 0;
                    }
                    var hit = 0, interactiveParent = interactive = displayObject.interactive || interactive;
                    if (displayObject.hitArea) {
                        interactiveParent = false;
                    }
                    if (displayObject._activeParentLayer) {
                        outOfMask = false;
                    }
                    var mask = displayObject._mask;
                    if (hitTestOrder < Infinity && mask) {
                        if (!mask.containsPoint(point)) {
                            outOfMask = true;
                        }
                    }
                    if (hitTestOrder < Infinity && displayObject.filterArea) {
                        if (!displayObject.filterArea.contains(point.x, point.y)) {
                            outOfMask = true;
                        }
                    }
                    var children = displayObject.children;
                    if (displayObject.interactiveChildren && children) {
                        for (var i = children.length - 1; i >= 0; i--) {
                            var child = children[i];
                            var hitChild = this._displayProcessInteractive(point, child, hitTestOrder, interactiveParent, outOfMask);
                            if (hitChild) {
                                if (!child.parent) {
                                    continue;
                                }
                                hit = hitChild;
                                hitTestOrder = hitChild;
                            }
                        }
                    }
                    if (interactive) {
                        if (!outOfMask) {
                            if (hitTestOrder < displayObject.displayOrder) {
                                if (displayObject.hitArea) {
                                    displayObject.worldTransform.applyInverse(point, this._tempPoint);
                                    if (displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
                                        hit = displayObject.displayOrder;
                                    }
                                }
                                else if (displayObject.containsPoint) {
                                    if (displayObject.containsPoint(point)) {
                                        hit = displayObject.displayOrder;
                                    }
                                }
                            }
                            if (displayObject.interactive) {
                                this._queueAdd(displayObject, hit === Infinity ? 0 : hit);
                            }
                        }
                        else {
                            if (displayObject.interactive) {
                                this._queueAdd(displayObject, 0);
                            }
                        }
                    }
                    return hit;
                },
                processInteractive: function (strangeStuff, displayObject, func, hitTest, interactive) {
                    var interactionEvent = null;
                    var point = null;
                    if (strangeStuff.data &&
                        strangeStuff.data.global) {
                        interactionEvent = strangeStuff;
                        point = interactionEvent.data.global;
                    }
                    else {
                        point = strangeStuff;
                    }
                    this._startInteractionProcess();
                    this._displayProcessInteractive(point, displayObject, hitTest ? 0 : Infinity, false);
                    this._finishInteractionProcess(interactionEvent, func);
                },
                _startInteractionProcess: function () {
                    this._eventDisplayOrder = 1;
                    if (!this._queue) {
                        this._queue = [[], []];
                    }
                    this._queue[0].length = 0;
                    this._queue[1].length = 0;
                },
                _queueAdd: function (displayObject, order) {
                    var queue = this._queue;
                    if (order < this._eventDisplayOrder) {
                        queue[0].push(displayObject);
                    }
                    else {
                        if (order > this._eventDisplayOrder) {
                            this._eventDisplayOrder = order;
                            var q = queue[1];
                            for (var i = 0, l = q.length; i < l; i++) {
                                queue[0].push(q[i]);
                            }
                            queue[1].length = 0;
                        }
                        queue[1].push(displayObject);
                    }
                },
                _finishInteractionProcess: function (event, func) {
                    var queue = this._queue;
                    var q = queue[0];
                    for (var i = 0, l = q.length; i < l; i++) {
                        if (event) {
                            if (func) {
                                func(event, q[i], false);
                            }
                        }
                        else {
                            func(q[i], false);
                        }
                    }
                    q = queue[1];
                    for (var i = 0, l = q.length; i < l; i++) {
                        if (event) {
                            if (!event.target) {
                                event.target = q[i];
                            }
                            if (func) {
                                func(event, q[i], true);
                            }
                        }
                        else {
                            func(q[i], true);
                        }
                    }
                    var delayedEvents = this.delayedEvents;
                    if (delayedEvents && delayedEvents.length) {
                        event.stopPropagationHint = false;
                        var delayedLen = delayedEvents.length;
                        this.delayedEvents = [];
                        for (var i_1 = 0; i_1 < delayedLen; i_1++) {
                            var _a = delayedEvents[i_1], displayObject = _a.displayObject, eventString = _a.eventString, eventData = _a.eventData;
                            if (eventData.stopsPropagatingAt === displayObject) {
                                eventData.stopPropagationHint = true;
                            }
                            this.dispatchEvent(displayObject, eventString, eventData);
                        }
                    }
                }
            });
        })(pixi_display || (pixi_display = {}));
        var pixi_display;
        (function (pixi_display) {
            var LayerTextureCache = (function () {
                function LayerTextureCache(layer) {
                    this.layer = layer;
                    this.renderTexture = null;
                    this.doubleBuffer = null;
                    this.currentBufferIndex = 0;
                    this._tempRenderTarget = null;
                    this._tempRenderTargetSource = new PIXI.Rectangle();
                }
                LayerTextureCache.prototype.initRenderTexture = function (renderer) {
                    var width = renderer ? renderer.screen.width : 100;
                    var height = renderer ? renderer.screen.height : 100;
                    var resolution = renderer ? renderer.resolution : PIXI.settings.RESOLUTION;
                    this.renderTexture = PIXI.RenderTexture.create({ width: width, height: height, resolution: resolution });
                    if (this.layer.group.useDoubleBuffer) {
                        this.doubleBuffer = [
                            PIXI.RenderTexture.create({ width: width, height: height, resolution: resolution }),
                            PIXI.RenderTexture.create({ width: width, height: height, resolution: resolution })
                        ];
                    }
                };
                LayerTextureCache.prototype.getRenderTexture = function () {
                    if (!this.renderTexture) {
                        this.initRenderTexture();
                    }
                    return this.renderTexture;
                };
                LayerTextureCache.prototype.pushTexture = function (renderer) {
                    var screen = renderer.screen;
                    if (!this.renderTexture) {
                        this.initRenderTexture(renderer);
                    }
                    var rt = this.renderTexture;
                    var group = this.layer.group;
                    var db = this.doubleBuffer;
                    if (rt.width !== screen.width ||
                        rt.height !== screen.height ||
                        rt.baseTexture.resolution !== renderer.resolution) {
                        rt.baseTexture.resolution = renderer.resolution;
                        rt.resize(screen.width, screen.height);
                        if (db) {
                            db[0].baseTexture.resolution = renderer.resolution;
                            db[0].resize(screen.width, screen.height);
                            db[1].baseTexture.resolution = renderer.resolution;
                            db[1].resize(screen.width, screen.height);
                        }
                    }
                    this._tempRenderTarget = renderer.renderTexture.current;
                    this._tempRenderTargetSource.copyFrom(renderer.renderTexture.sourceFrame);
                    renderer.batch.flush();
                    if (group.useDoubleBuffer) {
                        var buffer = db[this.currentBufferIndex];
                        if (!buffer.baseTexture._glTextures[renderer.CONTEXT_UID]) {
                            renderer.renderTexture.bind(buffer, undefined, undefined);
                            renderer.texture.bind(buffer);
                            if (group.clearColor) {
                                renderer.renderTexture.clear(group.clearColor);
                            }
                        }
                        renderer.texture.unbind(rt);
                        rt.baseTexture._glTextures = buffer.baseTexture._glTextures;
                        rt.baseTexture.framebuffer = buffer.baseTexture.framebuffer;
                        buffer = db[1 - this.currentBufferIndex];
                        renderer.renderTexture.bind(buffer, undefined, undefined);
                    }
                    else {
                        renderer.renderTexture.bind(rt, undefined, undefined);
                    }
                    if (group.clearColor) {
                        renderer.renderTexture.clear(group.clearColor);
                    }
                    var filterStack = renderer.filter.defaultFilterStack;
                    if (filterStack.length > 1) {
                        filterStack[filterStack.length - 1].renderTexture = renderer.renderTexture.current;
                    }
                };
                LayerTextureCache.prototype.popTexture = function (renderer) {
                    renderer.batch.flush();
                    var filterStack = renderer.filter.defaultFilterStack;
                    if (filterStack.length > 1) {
                        filterStack[filterStack.length - 1].renderTexture = this._tempRenderTarget;
                    }
                    renderer.renderTexture.bind(this._tempRenderTarget, this._tempRenderTargetSource, undefined);
                    this._tempRenderTarget = null;
                    var rt = this.renderTexture;
                    var group = this.layer.group;
                    var db = this.doubleBuffer;
                    if (group.useDoubleBuffer) {
                        renderer.texture.unbind(rt);
                        this.currentBufferIndex = 1 - this.currentBufferIndex;
                        var buffer = db[this.currentBufferIndex];
                        rt.baseTexture._glTextures = buffer.baseTexture._glTextures;
                        rt.baseTexture.framebuffer = buffer.baseTexture.framebuffer;
                    }
                };
                LayerTextureCache.prototype.destroy = function () {
                    if (this.renderTexture) {
                        this.renderTexture.destroy();
                        if (this.doubleBuffer) {
                            this.doubleBuffer[0].destroy(true);
                            this.doubleBuffer[1].destroy(true);
                        }
                    }
                };
                return LayerTextureCache;
            }());
            pixi_display.LayerTextureCache = LayerTextureCache;
            var Layer = (function (_super) {
                __extends(Layer, _super);
                function Layer(group) {
                    if (group === void 0) { group = null; }
                    var _this = _super.call(this) || this;
                    _this.isLayer = true;
                    _this.group = null;
                    _this._activeChildren = [];
                    _this._tempChildren = null;
                    _this._activeStageParent = null;
                    _this._sortedChildren = [];
                    _this._tempLayerParent = null;
                    _this.insertChildrenBeforeActive = true;
                    _this.insertChildrenAfterActive = true;
                    if (group != null) {
                        _this.group = group;
                        _this.zIndex = group.zIndex;
                    }
                    else {
                        _this.group = new pixi_display.Group(0, false);
                    }
                    _this._tempChildren = _this.children;
                    return _this;
                }
                Layer.prototype.beginWork = function (stage) {
                    var active = this._activeChildren;
                    this._activeStageParent = stage;
                    this.group.foundLayer(stage, this);
                    var groupChildren = this.group._activeChildren;
                    active.length = 0;
                    for (var i = 0; i < groupChildren.length; i++) {
                        groupChildren[i]._activeParentLayer = this;
                        active.push(groupChildren[i]);
                    }
                    groupChildren.length = 0;
                };
                Layer.prototype.endWork = function () {
                    var children = this.children;
                    var active = this._activeChildren;
                    var sorted = this._sortedChildren;
                    for (var i = 0; i < active.length; i++) {
                        this.emit("display", active[i]);
                    }
                    sorted.length = 0;
                    if (this.insertChildrenBeforeActive) {
                        for (var i = 0; i < children.length; i++) {
                            sorted.push(children[i]);
                        }
                    }
                    for (var i = 0; i < active.length; i++) {
                        sorted.push(active[i]);
                    }
                    if (!this.insertChildrenBeforeActive &&
                        this.insertChildrenAfterActive) {
                        for (var i = 0; i < children.length; i++) {
                            sorted.push(children[i]);
                        }
                    }
                    if (this.group.enableSort) {
                        this.doSort();
                    }
                };
                Object.defineProperty(Layer.prototype, "useRenderTexture", {
                    get: function () {
                        return this.group.useRenderTexture;
                    },
                    set: function (value) {
                        this.group.useRenderTexture = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Layer.prototype, "useDoubleBuffer", {
                    get: function () {
                        return this.group.useDoubleBuffer;
                    },
                    set: function (value) {
                        this.group.useDoubleBuffer = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Layer.prototype, "clearColor", {
                    get: function () {
                        return this.group.clearColor;
                    },
                    set: function (value) {
                        this.group.clearColor = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Layer.prototype, "sortPriority", {
                    get: function () {
                        return this.group.sortPriority;
                    },
                    set: function (value) {
                        this.group.sortPriority = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Layer.prototype.getRenderTexture = function () {
                    if (!this.textureCache) {
                        this.textureCache = new LayerTextureCache(this);
                    }
                    return this.textureCache.getRenderTexture();
                };
                Layer.prototype.updateDisplayLayers = function () {
                };
                Layer.prototype.doSort = function () {
                    this.group.doSort(this, this._sortedChildren);
                };
                Layer.prototype._preRender = function (renderer) {
                    if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
                        return false;
                    }
                    if (!this.visible) {
                        this.displayOrder = 0;
                        return false;
                    }
                    this.displayOrder = renderer.incDisplayOrder();
                    if (this.worldAlpha <= 0 || !this.renderable) {
                        return false;
                    }
                    if (this.children !== this._sortedChildren &&
                        this._tempChildren != this.children) {
                        this._tempChildren = this.children;
                    }
                    this._boundsID++;
                    this.children = this._sortedChildren;
                    this._tempLayerParent = renderer._activeLayer;
                    renderer._activeLayer = this;
                    return true;
                };
                Layer.prototype._postRender = function (renderer) {
                    this.children = this._tempChildren;
                    renderer._activeLayer = this._tempLayerParent;
                    this._tempLayerParent = null;
                };
                Layer.prototype.render = function (renderer) {
                    if (!this._preRender(renderer)) {
                        return;
                    }
                    if (this.group.useRenderTexture) {
                        if (!this.textureCache) {
                            this.textureCache = new LayerTextureCache(this);
                        }
                        this.textureCache.pushTexture(renderer);
                    }
                    this.containerRenderWebGL(renderer);
                    this._postRender(renderer);
                    if (this.group.useRenderTexture) {
                        this.textureCache.popTexture(renderer);
                    }
                };
                Layer.prototype.destroy = function (options) {
                    if (this.textureCache) {
                        this.textureCache.destroy();
                        this.textureCache = null;
                    }
                    _super.prototype.destroy.call(this, options);
                };
                return Layer;
            }(PIXI.Container));
            pixi_display.Layer = Layer;
            Layer.prototype.renderCanvas = function (renderer) {
                if (this._preRender(renderer)) {
                    this.containerRenderCanvas(renderer);
                    this._postRender(renderer);
                }
            };
        })(pixi_display || (pixi_display = {}));
        var pixi_display;
        (function (pixi_display) {
            var Stage = (function (_super) {
                __extends(Stage, _super);
                function Stage() {
                    var _this = _super.call(this) || this;
                    _this.isStage = true;
                    _this._tempGroups = [];
                    _this._activeLayers = [];
                    _this._activeParentStage = null;
                    return _this;
                }
                Stage.prototype.clear = function () {
                    this._activeLayers.length = 0;
                    this._tempGroups.length = 0;
                };
                Stage.prototype.destroy = function (options) {
                    this.clear();
                    _super.prototype.destroy.call(this, options);
                };
                Stage.prototype._addRecursive = function (displayObject) {
                    if (!displayObject.visible) {
                        return;
                    }
                    if (displayObject.isLayer) {
                        var layer_1 = displayObject;
                        this._activeLayers.push(layer_1);
                        layer_1.beginWork(this);
                    }
                    if (displayObject != this && displayObject.isStage) {
                        var stage = displayObject;
                        stage.updateAsChildStage(this);
                        return;
                    }
                    var group = displayObject.parentGroup;
                    if (group != null) {
                        group.addDisplayObject(this, displayObject);
                    }
                    var layer = displayObject.parentLayer;
                    if (layer != null) {
                        group = layer.group;
                        group.addDisplayObject(this, displayObject);
                    }
                    displayObject.updateOrder = ++Stage._updateOrderCounter;
                    if (displayObject.alpha <= 0 || !displayObject.renderable
                        || !displayObject.layerableChildren
                        || group && group.sortPriority) {
                        return;
                    }
                    var children = displayObject.children;
                    if (children && children.length) {
                        for (var i = 0; i < children.length; i++) {
                            this._addRecursive(children[i]);
                        }
                    }
                };
                Stage.prototype._addRecursiveChildren = function (displayObject) {
                    if (displayObject.alpha <= 0 || !displayObject.renderable
                        || !displayObject.layerableChildren) {
                        return;
                    }
                    var children = displayObject.children;
                    if (children && children.length) {
                        for (var i = 0; i < children.length; i++) {
                            this._addRecursive(children[i]);
                        }
                    }
                };
                Stage.prototype._updateStageInner = function () {
                    this.clear();
                    this._addRecursive(this);
                    var layers = this._activeLayers;
                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];
                        if (layer.group.sortPriority) {
                            layer.endWork();
                            var sorted = layer._sortedChildren;
                            for (var j = 0; j < sorted.length; j++) {
                                this._addRecursiveChildren(sorted[j]);
                            }
                        }
                    }
                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];
                        if (!layer.group.sortPriority) {
                            layer.endWork();
                        }
                    }
                };
                Stage.prototype.updateAsChildStage = function (stage) {
                    this._activeParentStage = stage;
                    Stage._updateOrderCounter = 0;
                    this._updateStageInner();
                };
                Stage.prototype.updateStage = function () {
                    this._activeParentStage = null;
                    pixi_display.Group._layerUpdateId++;
                    this._updateStageInner();
                };
                ;
                Stage._updateOrderCounter = 0;
                return Stage;
            }(pixi_display.Layer));
            pixi_display.Stage = Stage;
        })(pixi_display || (pixi_display = {}));
        var pixi_display;
        (function (pixi_display) {
            Object.assign(PIXI.Renderer.prototype, {
                _lastDisplayOrder: 0,
                _activeLayer: null,
                incDisplayOrder: function () {
                    return ++this._lastDisplayOrder;
                },
                _oldRender: PIXI.Renderer.prototype.render,
                render: function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
                    if (!renderTexture) {
                        this._lastDisplayOrder = 0;
                    }
                    this._activeLayer = null;
                    if (displayObject.isStage) {
                        displayObject.updateStage();
                    }
                    this._oldRender(displayObject, renderTexture, clear, transform, skipUpdateTransform);
                }
            });
            var canvasRenderer = PIXI.CanvasRenderer;
            if (canvasRenderer) {
                Object.assign(canvasRenderer.prototype, {
                    _lastDisplayOrder: 0,
                    _activeLayer: null,
                    incDisplayOrder: function () {
                        return ++this._lastDisplayOrder;
                    },
                    _oldRender: canvasRenderer.prototype.render,
                    render: function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
                        if (!renderTexture) {
                            this._lastDisplayOrder = 0;
                        }
                        this._activeLayer = null;
                        if (displayObject.isStage) {
                            displayObject.updateStage();
                        }
                        this._oldRender(displayObject, renderTexture, clear, transform, skipUpdateTransform);
                    }
                });
            }
        })(pixi_display || (pixi_display = {}));
        var pixi_display;
        (function (pixi_display) {
            PIXI.display = pixi_display;
        })(pixi_display || (pixi_display = {}));
        //# sourceMappingURL=pixi-layers.js.map
    },
    create_view: function (arg) {
        arg.view = true;
        return $pxi.init(arg.width, arg.height, arg.fps_monitor, arg);
    },
    create_screen: function (arg) {
        document.body.style.backgroundColor = arg.body_bgcolor;
        document.body.style.overflow = 'hidden';
        return $pxi.init(arg.width, arg.height, arg.fps_monitor, arg);
    },
    init: function (GAME_WIDTH, GAME_HEIGHT, fps_monitor, arg) {
        if ($pxi.install_pixi_layers) {
            $pxi.install_pixi_layers();
            delete $pxi.install_pixi_layers;
        }
        let view = arg.view ? true : false;
        let rtn = {};
        if (!view) {
            $pxi.GAME_WIDTH = GAME_WIDTH;
            $pxi.GAME_HEIGHT = GAME_HEIGHT;
        }
        let req = {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            autoResize: true,
            transparent: view ? true : false,
            resolution: $pxi.display.getRatio(),
            backgroundColor: arg.screen_bgcolor ? arg.screen_bgcolor : '#000',
            antialias: arg.disable_antialias ? false : true
        };
        let app = new PIXI.Application(req);
        if (PIXI.display && PIXI.display.Stage) {
            app.stage = new PIXI.display.Stage();
        }
        rtn.app = app.app;
        rtn.stage = app.stage;
        rtn.renderer = app.renderer;
        rtn.resolution = req.resolution;
        rtn.size = { width: req.width, height: req.height };
        if (!view) {
            app.renderer.view.style.border = "0px";
            app.renderer.view.style.position = "absolute";
            try { rtn.g_localAdvStorage = new LocalAdvStorage({ client_kind: arg.client_kind }); } catch (e) { }
            try { rtn.vs = new AdvStore(); } catch (e) { }
            ['blocks', 'moving_things', 'aiming_line', 'extend_balls'].forEach(key => {
                try { rtn[key] = new AdvDict(); } catch (e) { }
            });
            $pxi.VS = rtn.vs;
            $pxi.APP = rtn.app;
            $pxi.STAGE = rtn.stage;
            $pxi.RENDERER = app.renderer;
            $pxi.display.setResizeEvent({ stage: rtn.stage, renderer: app.renderer });
            document.body.appendChild(app.renderer.view);
            if (fps_monitor) {
                try { (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); stats.showPanel(0); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })(); } catch (e) { }
            }
        }
        Object.keys(rtn).forEach(key => {
            if (rtn[key] === undefined) {
                delete rtn[key];
            }
        });
        return rtn;
    },
    display: {
        vrRatio: function () {
            let width = $pxi.GAME_WIDTH;
            let height = $pxi.GAME_HEIGHT;
            return Math.min(window.innerWidth / width, window.innerHeight / height);
        },
        getRatio: function () {
            return window.devicePixelRatio;
        },
        resize: function (arg) {
            let stage = arg.stage;
            let renderer = arg.renderer;
            let ratio = $pxi.display.vrRatio();
            let ppirt = $pxi.display.getRatio();
            let width = window.innerWidth;
            let height = window.innerWidth * ($pxi.GAME_HEIGHT / $pxi.GAME_WIDTH);
            if (window.innerHeight < height) {
                height = window.innerHeight;
                width = ($pxi.GAME_WIDTH * height) / $pxi.GAME_HEIGHT;
            }
            let rrv = function (renderer, width, height) {
                let ppirt = $pxi.display.getRatio();
                renderer.resize(width, height);
                let width2 = (renderer.view.width / window.innerWidth) / ppirt;
                let height2 = (renderer.view.height / window.innerHeight) / ppirt;
                return { width: width2, height: height2 };
            };
            let sz = rrv(renderer, width, height);
            let tt = 1;
            tt = sz.height;
            stage.scale.x = stage.scale.y = ratio / tt;
            renderer.resize(width / tt, height / tt);
            if (renderer.view.width / ppirt > window.innerWidth) {
                tt = sz.width;
                stage.scale.x = stage.scale.y = ratio / tt;
                renderer.resize(width / tt, height / tt);
            }
            renderer.view.style.top = ((window.innerHeight - renderer.view.height / ppirt) / 2) + 'px';
            renderer.view.style.left = ((window.innerWidth - renderer.view.width / ppirt) / 2) + 'px';
        },
        setResizeEvent: function (arg) {
            window.addEventListener("resize", (function () {
                $pxi.display.resize(this);
            }).bind(arg));
            window.dispatchEvent(new Event('resize'));
        },
    },
    cco: function (value) {
        return (value / $pxi.display.vrRatio());
    },
};
