# Changelog

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
