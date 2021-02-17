# Changelog

## `[0.4.0]` 2021-02-17

- Major update to the Cesium viewer underlying this interface to bring the
  code into alignment with Macrostrat's [in-development Earth viewer](https://dev.macrostrat.org/next/web)
- Updated terrain data processor to use web workers
- Fixed some unnecessary re-renders
- Brought in CTX and HiRISE elevation models of landing site and immediate context

## `[0.3.0]` 2021-02-12

- Added CRISM layer, with ability to toggle and enable from hash string
- Reorganize text a little bit
- Small style fixes

## `[0.2.1]` 2021-02-10

- Fix bug with base URL

## `[0.2.0]` 2021-02-10

#### Return to a position

Positions can now be retreived from URL hash parameters, enabling "deep linking" to specific locations. Parameters
represent the camera position, using the following schema:

- `x`: Latitude (degrees)
- `y`: Latitude (degrees)
- `z`: Elevation (meters relative to Mars 2000 datum)
- `a`: Azimuth (degrees from N)
- `e`: Off-nadir angle (degrees from vertical)

At least `x` and `y` must be defined for a position to be returned.

#### Deployment

- Decouple data backend from frontend viewer
- Add deployment scripts for Macrostrat server

## `[0.1.2]` 2021-02-09

- Add button to show and hide the sidebar
- Add links to GitHub revision and automate version string
- Small styling fixes

## `[0.1.1]` 2020-08-10

### Changes

- A few new references in main body text
- Added this Changelog as a separate page

### Bugs fixed

- Removed elevation artifacts caused by smoothing and off-by-one errors
- Small typographical and grammatical errors
- Rendering of hillshade layer in production
- Scroll container bounds on narrow mobile devices

## `[0.1.0]` 2020-08-03

- Initial release
