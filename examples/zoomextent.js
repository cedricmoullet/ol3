goog.provide('ol.control.ZoomToExtent');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('ol');
goog.require('ol.Coordinate');
goog.require('ol.Map');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.layer.TileLayer');
goog.require('ol.source.OpenStreetMap');

// -------------------------------
// CODE OF THE ZOOM EXTENT CONTROL
// -------------------------------



/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ol.control.ZoomExtentOptions=} opt_options Options.
 */
ol.control.ZoomExtent = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  var zoomToElement = goog.dom.createDom(goog.dom.TagName.A, {
    'href': '#zoomTo',
    'class': 'ol-zoom-to'
  });
  goog.events.listen(zoomToElement, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleZoomTo_, false, this);

  var cssClasses = 'ol-zoom-extent ' + ol.CSS_CLASS_UNSELECTABLE;
  var element = goog.dom.createDom(goog.dom.TagName.DIV, cssClasses,
      zoomToElement);

  goog.base(this, {
    element: element,
    map: options.map,
    target: options.target
  });

  /**
    * @type {ol.Extent}
    * @private
  */
  this.extent_ = goog.isDef(options.extent) ? options.extent :
      this.getMap().getView().getProjection().getExtent();

};
goog.inherits(ol.control.ZoomExtent, ol.control.Control);


/**
 * @param {goog.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
ol.control.ZoomExtent.prototype.handleZoomTo_ = function(browserEvent) {
  // prevent #zoomToExtent anchor from getting appended to the url
  browserEvent.preventDefault();
  var map = this.getMap();
  map.requestRenderFrame();
  // FIXME works for View2D only
  var view2d = map.getView().getView2D();
  var maxResolution = view2d.getResolutionForExtent(
      this.extent_ ? this.extent_ :
      map.getView().getProjection().getExtent(),
      map.getSize());
  view2d.zoom(map, maxResolution, undefined,
      ol.control.ZOOM_DURATION);
};

// -------------------
// CODE OF THE EXAMPLE
// -------------------
var map = new ol.Map({
  layers: [
    new ol.layer.TileLayer({
      source: new ol.source.OpenStreetMap()
    })
  ],
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    center: new ol.Coordinate(0, 0),
    zoom: 2
  })
});

var zoomextent = new ol.control.ZoomExtent({
  extent: null,
  map: map
});

