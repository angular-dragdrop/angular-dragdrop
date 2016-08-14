import angular from 'angular';

export class uiDraggableDirective {
    constructor($parse, $rootScope, $dragImage) {
        this.restrict = 'A';
        this._$parse = $parse;
        this._$rootScope = $rootScope;
        this._$dragImage = $dragImage;
        this._element = null;
        this._scope = null;
        this._attrs = null;
        this._dragTarget = null;
        this._isDragHandleUsed = false;
    }

    link = (scope, element, attrs) => {
        this._scope = scope;
        this._element = element;
        this._attrs = attrs;
        this._element.attr('draggable', false);
        this._watchUiDraggable();
        this._setupDragHandle();
    };

    _watchUiDraggable() {

        this._scope.$watch(this._attrs.uiDraggable, (newValue) => {
            if (newValue) {
                this._element.attr('draggable', newValue);
                this._element.bind('dragend', this._dragendHandler);
                this._element.bind('dragstart',this._dragStartHandler);
            }
            else {
                this._element.removeAttr('draggable');
                this._element.unbind('dragend', this._dragendHandler);
                this._element.unbind('dragstart', this._dragStartHandler);
            }

        });
    }

    _setupDragHandle() {
        const { dragHandleClass } = this._attrs;
        if (angular.isString(dragHandleClass)) {
            this._isDragHandleUsed = true;
            this._dragHandleClass = dragHandleClass.trim() || 'drag-handle';
            this._element.bind('mousedown', (e) => { this._dragTarget = e.target; });
        }
    }

    _dragStartHandler = (e) => {
        if (e.originalEvent) {
            e.dataTransfer = e.originalEvent.dataTransfer;
        }

        var isDragAllowed = !this._isDragHandleUsed || this._dragTarget.classList.contains(this._dragHandleClass);

        if (isDragAllowed) {
            var sendChannel = this._attrs.dragChannel || 'defaultchannel';
            var dragData = '';
            if (this._attrs.drag) {
                dragData = this._scope.$eval(this._attrs.drag);
            }

            var dragImage = this._attrs.dragImage || null;

            const draggingClass = this._attrs.draggingClass || 'on-dragging';
            this._element.addClass(draggingClass);
            this._element.bind('$destroy', this._dragEndHandler);

            //Code to make sure that the setDragImage is available. IE 10, 11, and Opera do not support setDragImage.
            var hasNativeDraggable = !(document.uniqueID || window.opera);

            //If there is a draggable image passed in, then set the image to be dragged.
            if (dragImage && hasNativeDraggable) {
                var dragImageFn = this._$parse(this._attrs.dragImage);
                this._scope.$apply(function () {
                    let dragImageParameters = dragImageFn(this._scope, {$event: e});
                    if (dragImageParameters) {
                        if (angular.isString(dragImageParameters)) {
                            dragImageParameters = this._$dragImage.generate(dragImageParameters);
                        }
                        if (dragImageParameters.image) {
                            var xOffset = dragImageParameters.xOffset || 0,
                                yOffset = dragImageParameters.yOffset || 0;
                            e.dataTransfer.setDragImage(dragImageParameters.image, xOffset, yOffset);
                        }
                    }
                });
            } else if (this._attrs.dragImageElementId) {
                this._setDragElement(e, this._attrs.dragImageElementId);
            }

            var offset = {x: e.offsetX, y: e.offsetY};
            var transferDataObject = { data: dragData, channel: sendChannel, offset: offset};
            var transferDataText = angular.toJson(transferDataObject);

            e.dataTransfer.setData('text', transferDataText);
            e.dataTransfer.effectAllowed = 'copyMove';

            this._$rootScope.$broadcast('ANGULAR_DRAG_START', e, sendChannel, transferDataObject);
        }
        else {
            e.preventDefault();
        }
    }
}

// @ngInject
function uiDraggableDirectiveGetter($parse, $rootScope, $dragImage) {
    return new uiDraggableDirective($parse, $rootScope, $dragImage);
    return function uiDraggableDirective(scope, element, attrs) {
        let isDragHandleUsed = false;
        let dragHandleClass;
        const draggingClass = attrs.draggingClass || 'on-dragging',
        let dragTarget;

        element.attr('draggable', false);

        scope.$watch(attrs.uiDraggable, function (newValue) {
            if (newValue) {
                element.attr('draggable', newValue);
                element.bind('dragend', dragendHandler);
                element.bind('dragstart', dragstartHandler);
            }
            else {
                element.removeAttr('draggable');
                element.unbind('dragend', dragendHandler);
                element.unbind('dragstart', dragstartHandler);
            }

        });

        if (angular.isString(attrs.dragHandleClass)) {
            isDragHandleUsed = true;
            dragHandleClass = attrs.dragHandleClass.trim() || 'drag-handle';

            element.bind('mousedown', function (e) {
                dragTarget = e.target;
            });
        }

        function dragendHandler(e) {
            if (e.originalEvent) {
                e.dataTransfer = e.originalEvent.dataTransfer;
            }

            setTimeout(function () {
                element.unbind('$destroy', dragendHandler);
            }, 0);
            var sendChannel = attrs.dragChannel || 'defaultchannel';
            $rootScope.$broadcast('ANGULAR_DRAG_END', e, sendChannel);

            determineEffectAllowed(e);

            if (e.dataTransfer && e.dataTransfer.dropEffect !== 'none') {
                if (attrs.onDropSuccess) {
                    var onDropSuccessFn = $parse(attrs.onDropSuccess);
                    scope.$evalAsync(function () {
                        onDropSuccessFn(scope, {$event: e});
                    });
                }
            } else if (e.dataTransfer && e.dataTransfer.dropEffect === 'none') {
                if (attrs.onDropFailure) {
                    var onDropFailureFn = $parse(attrs.onDropFailure);
                    scope.$evalAsync(function () {
                        onDropFailureFn(scope, {$event: e});
                    });
                }
            }
            element.removeClass(draggingClass);
        }

        function setDragElement(e, dragImageElementId) {
            var dragImageElementFn;

            if (e.originalEvent) {
                e.dataTransfer = e.originalEvent.dataTransfer;
            }

            dragImageElementFn = $parse(dragImageElementId);

            scope.$apply(function () {
                var elementId = dragImageElementFn(scope, {$event: e}),
                    dragElement;

                if (!(elementId && angular.isString(elementId))) {
                    return;
                }

                dragElement = document.getElementById(elementId);

                if (!dragElement) {
                    return;
                }

                e.dataTransfer.setDragImage(dragElement, 0, 0);
            });
        }

        function dragstartHandler(e) {
            if (e.originalEvent) {
                e.dataTransfer = e.originalEvent.dataTransfer;
            }

            var isDragAllowed = !isDragHandleUsed || dragTarget.classList.contains(dragHandleClass);

            if (isDragAllowed) {
                var sendChannel = attrs.dragChannel || 'defaultchannel';
                var dragData = '';
                if (attrs.drag) {
                    dragData = scope.$eval(attrs.drag);
                }

                var dragImage = attrs.dragImage || null;

                element.addClass(draggingClass);
                element.bind('$destroy', dragendHandler);

                //Code to make sure that the setDragImage is available. IE 10, 11, and Opera do not support setDragImage.
                var hasNativeDraggable = !(document.uniqueID || window.opera);

                //If there is a draggable image passed in, then set the image to be dragged.
                if (dragImage && hasNativeDraggable) {
                    var dragImageFn = $parse(attrs.dragImage);
                    scope.$apply(function () {
                        var dragImageParameters = dragImageFn(scope, {$event: e});
                        if (dragImageParameters) {
                            if (angular.isString(dragImageParameters)) {
                                dragImageParameters = $dragImage.generate(dragImageParameters);
                            }
                            if (dragImageParameters.image) {
                                var xOffset = dragImageParameters.xOffset || 0,
                                    yOffset = dragImageParameters.yOffset || 0;
                                e.dataTransfer.setDragImage(dragImageParameters.image, xOffset, yOffset);
                            }
                        }
                    });
                } else if (attrs.dragImageElementId) {
                    setDragElement(e, attrs.dragImageElementId);
                }

                var offset = {x: e.offsetX, y: e.offsetY};
                var transferDataObject = { data: dragData, channel: sendChannel, offset: offset};
                var transferDataText = angular.toJson(transferDataObject);

                e.dataTransfer.setData('text', transferDataText);
                e.dataTransfer.effectAllowed = 'copyMove';

                $rootScope.$broadcast('ANGULAR_DRAG_START', e, sendChannel, transferDataObject);
            }
            else {
                e.preventDefault();
            }
        }
    };
}

function getLinkFunction($parse, $rootScope, $dragImage) {
    return
}

export default uiDraggableDirectiveGetter;
