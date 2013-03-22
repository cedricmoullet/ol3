// FIXME works for View2D only

goog.provide('ol.control.Zoom');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('ol');
goog.require('ol.control.Control');


/**
 * @define {number} Zoom duration.
 */
ol.control.ZOOM_DURATION = 250;



/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ol.control.ZoomOptions=} opt_options Options.
 */
ol.control.Zoom = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  var inElement = goog.dom.createDom(goog.dom.TagName.A, {
    'href': '#zoomIn',
    'class': 'ol-zoom-in'
  });
  goog.events.listen(inElement, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleIn_, false, this);

  var outElement = goog.dom.createDom(goog.dom.TagName.A, {
    'href': '#zoomOut',
    'class': 'ol-zoom-out'
  });
  goog.events.listen(outElement, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleOut_, false, this);

  /**
   * @type {ol.Extent}
   * @private
   */
  this.extent_ = goog.isDef(options.extent) ? options.extent : undefined;

  /**
   * @type {boolean}
   * @private
   */
  this.isExtent_ = goog.isDef(options.isExtent) ? options.isExtent : false;

  if (this.isExtent_) {
      var extentElement = goog.dom.createDom(goog.dom.TagName.A, {
          'href': '#zoomExtent',
          'class': 'ol-zoom-extent'
      });
      goog.events.listen(extentElement, [
          goog.events.EventType.TOUCHEND,
          goog.events.EventType.CLICK
      ], this.handleExtent_, false, this);
  }

  var cssClasses = 'ol-zoom ' + ol.CSS_CLASS_UNSELECTABLE;
  var element = goog.dom.createDom(goog.dom.TagName.DIV, cssClasses, inElement,
      outElement, this.isExtent_ ? extentElement : undefined);

  goog.base(this, {
    element: element,
    map: options.map,
    target: options.target
  });

  /**
   * @type {number}
   * @private
   */
  this.delta_ = goog.isDef(options.delta) ? options.delta : 1;

};
goog.inherits(ol.control.Zoom, ol.control.Control);


/**
 * @param {goog.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
ol.control.Zoom.prototype.handleIn_ = function(browserEvent) {
  // prevent #zoomIn anchor from getting appended to the url
  browserEvent.preventDefault();
  var map = this.getMap();
  map.requestRenderFrame();
  // FIXME works for View2D only
  map.getView().zoomByDelta(map, this.delta_, undefined,
      ol.control.ZOOM_DURATION);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
ol.control.Zoom.prototype.handleOut_ = function(browserEvent) {
  // prevent #zoomOut anchor from getting appended to the url
  browserEvent.preventDefault();
  var map = this.getMap();
  map.requestRenderFrame();
  // FIXME works for View2D only
  map.getView().zoomByDelta(map, -this.delta_, undefined,
      ol.control.ZOOM_DURATION);
};

/**
 * @param {goog.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
ol.control.Zoom.prototype.handleExtent_ = function(browserEvent) {
  // prevent #zoomFull anchor from getting appended to the url
  browserEvent.preventDefault();
  var map = this.getMap();
  map.requestRenderFrame();
  // FIXME works for View2D only

  var view2d = map.getView().getView2D();
  var maxResolution = view2d.getResolutionForExtent(this.extent_ ? this.extent_ :
      map.getView().getProjection().getExtent(),
      map.getSize());
  view2d.zoom(map,maxResolution,undefined,
      ol.control.ZOOM_DURATION);
};
