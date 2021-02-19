This viewer brings together the two key components of a sustainable visualization
strategy:
**high-resolution, regionally extensive
data products**, displayed in a **configurable user interface**.
Earth and planetary scientists must work to improve
both of these tools for representing the physical world.
If you are interested in collaborating in this direction, [I'd love to hear from you](mailto:dev@davenquinn.com).

<div data-location="syrtis-overview-2">

Much of my PhD was dedicated to interpreting the geologic history of Syrtis Major,
particularly aspects involving the "layered sulfates" exposed ~50 km southwest of
Jezero crater [@Quinn2019]. As part of this work, I built high-resolution terrain models
covering a wide area; these data products supported the discovery
of key geological features and relationships.

</div>

This software driving this viewer
is based on [Macrostrat](https://macrostrat.org)'s [in-development tools](https://dev.macrostrat.org/next/web/map#/3d/z=8.2410/x=-113.7824/y=34.9962/bedrock/lines/) for displaying geological data
in rich context. At Macrostrat, we are interested in paring global-scale datasets with
rich interfaces that support science and outreach.

## 3D terrain visualization

The relationships between rock units
in the natural world are critical geological concepts. At the [_Macrostrat_](https://macrostrat.org) lab, we are building multi-scale global geologic maps
that integrate data from worldwide sources; we seek to visualize these
data atop the landscape which they describe.
Since _Macrostrat_ is a primarily a data-sharing platform, any visualization capabilities
built for that system must operate on the web. These
3D visualizers strive primarily for accessibility and presentation of geologic information
to a broad audience.

In orbital Mars science, software-based simulations
of the natural world must fully substitute for on-the-ground field methods.
Thus, visualizing terrain data was a major component of my work in the NE Syrtis region.
These tools I employed were based around complex software
packages such as [SOCET Set](https://www.geospatialexploitationproducts.com/content/socet-gxp/)
and [OSGEarth](http://osgearth.org/), and targeted at
high-end visualization laboratories (e.g. the Caltech Murray Lab).
These viewers were highly effective
for specific tasks but not simple to set up, customize, and keep running.

With the advent of [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API),
many of the advanced capabilities formerly confined to high-end lab can
be packaged for browser
environments. Because of the robustness of the web software stack, such code is
much more portable and easy to maintain than similar desktop software. This
viewer experiments with bringing the best aspects of high-performance 3D visualization
to the browser, balancing performance, flexibility, and
accessibility; it is based on open-source, widely used components that can be
improved over time. Above all, it strives to build better tools for both
_doing_ and _communicating_ Mars science.

The code for this application is available [on GitHub](https://github.com/davenquinn/ne-syrtis-jezero-viewer),
and its [basic map interface](https://github.com/UW-Macrostrat/cesium-viewer).
is a thin skin over the open-source [CesiumJS](https://cesium.com/cesiumjs/) digital globe.
This core software package drives many other 3D mapping interfaces, including
digital Earth viewers ([TerriaJS](https://terria.io/)) and NASA's [MMGIS](https://github.com/NASA-AMMOS/MMGIS)
and [Mars Trek](https://trek.nasa.gov/mars/) 3D data viewers.
Advances made for any of these platforms can be
readily integrated into this software.

Elevation maps are encoded as
[Terrain RGB images](https://blog.mapbox.com/global-elevation-data-6689f1d0ba65),
a format devised by [Mapbox](https://mapbox.com) for efficient storage and streaming to the browser.
This viewer incorporates a few small technical contributions that support 3D
displays of dynamic, high-resolution terrain:

- [A new Cesium "terrain provider"](https://github.com/davenquinn/cesium-martini)
  to parse these tiles and convert them to 3D meshes, a key step for supporting
  3D visualization of raster data
- A very rough on-the-fly hillshade, generated in WebGL.

These features are both unoptimized, but they provide key visualization primitives
that will be improved going forward.

## Multiscale, combined data products

The CesiumJS engine is designed to handle global, streaming data; the main
barrier to applying this capability across Mars is limited data. Like Earth,
much of the planet is covered by moderate- to high-resolution stereo image surveys.
Global data products, designed to be accessed through a
unified interface, are critical precursors to building
interactive visualizations of Mars locales.

For Earth, both imagery and topography data are readily available in
globally-consistent interfaces. For instance, Mapbox's Terrain RGB tileset
provides elevation at up to ~30 m horizontal resolution globally that can be accessed
in the web browser. Inevitably, these products sacrifice some
level of local precision for global consistency. However, the loss of accuracy
is often inconsequential for contextual studies.

Efforts to standardize Mars data products at a global scale
have not gained comparable traction.
This viewer relies on several efforts to build consistent regional and global
context datasets. Most apparent is the [CTX mosaic of
Mars](http://murray-lab.caltech.edu/CTX/), created by Jay Dickson at the
Caltech [Murray Lab](http://murray-lab.caltech.edu/), which provides the imagery
basemap here.

Global basemaps maintained by the [OpenPlanetary](https://www.openplanetary.org/opm)
have also been integrated, and HiRISE imagery (especially Jezero landing site orthomosaics
from the USGS) are coming soon.

</div>

<div data-location="viewer-guts">
The elevation products underlying this map are anchored by several key products:

- A 21-image mosaicked CTX elevation model that I prepared in SOCET Set in 2015-16, covering the
  northeast Syrtis region.
- Seven HiRISE DEMs for targeted areas within the northeast Syrtis region
- The Jezero Crater HiRISE and CTX elevation models prepared by the USGS to support
  _Perseverance_ mission planning
- Mosaicked HRSC and MOLA topography for outlying areas.

All of this data is
aligned and merged into a single tileset in
[Terrain RGB](https://docs.mapbox.com/help/troubleshooting/access-elevation-data/) format. This is a fraction of the
high-resolution topography available, particularly in the vicinity of Jezero
crater, and more data will be integrated into future iterations of this viewer.

</div>

## The path forward

This viewer highlights emerging capabilities for visualizing and communicating
regional geology using the web platform, and outlines the software and data requirements
to drive such work forward. I am excited to assemble collaborative efforts to
work in the areas outlined below, and to hear from colleagues also working in this domain.

### 3D viewers for geologic "field trips"

One exciting application for adaptable viewers involves using 3D topography
as a guided exploration and science communication tool. This viewer is designed along these lines,
but a more scalable approach will integrate it with a curation system for
"field trips" such as [_Rockd_ trips](https://rockd.org/trip/122). Much of this work
will be most impactful for Earth data, but the infrastructure
to design immersive field trips could be tailored to Mars as well.

### Scalable data products for northeast Syrtis and Mars

A common data backbone is a necessary component of new visualization approaches.
The greatest effort in assembling this viewer, by far, went towards building integrated
elevation data products covering the entire northeast Syrtis region. This type of task
should be seen as a critical component of regional-scale science in the northeast
Syrtis Region and globally.

In this context, a global, multiscale elevation product incorporating the
highest-resolution data for any given location on Mars would be a great
improvement on current fragmented processes. This should incorporate existing
DEMs, but a more powerful approach would integrate software components such as
the [Ames Stereo
Pipeline](https://github.com/NeoGeographyToolkit/StereoPipeline) and/or other
photogrammetry techniques to build a fully-automated DEM processing pipeline
that can be applied globally. Steps in this direction [are already being
taken](https://www.hou.usra.edu/meetings/lpsc2018/pdf/1604.pdf), but integrating
components into a common data infrastructure will be a major advance.

Geologic mapping data should also be compiled into a cohesive product:
Northeast Syrtis Major has an unusual concentration of
regional-scale geologic maps focused on different processes and geologic units.
Combining these into a composite product would provide an ongoing mechanism to
focus on uncertainty and debates surrounding geologic processes.

### Near-term goals

#### Viewer

- Integrate a keyframe system for smoother and more controllable
  animations
- Add highlighting of locations and geologic map units
- Add the ability to go back to a specific location
- Provide more controls on data layers, etc. (components of existing projects
  based on CesiumJS such as [TerriaJS](https://terria.io/) can be adapted here).
- Fix terrain pre-processing, which blocks the main browser rendering thread
  and causes major display lag during view transitions.

#### Data backend

- Integrate aligned HiRISE imagery into the imagery viewer to show sub-meter-scale features.
- Add more high-resolution elevation surrounding Jezero crater
- Add geologic map polygons as a layer
- Add landing ellipses, feature highlights, and labels

### References
