# Congressional District Interactive Mapping Tool

## Embed

Include this tag in the taxfoundation.org post:

`<div id="biden-plan-map-2021"></div>`

Include these scripts on the taxfoundation.org post page:

    https://biden-plan-map-2021.netlify.app/pym.js
    https://biden-plan-map-2021.netlify.app/pymSetup.js



## Data Sources

* [Cartographic Boundary Files - Shapefile](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html)

To create the individual state topojson files, the [mapshaper](https://github.com/mbloch/mapshaper) tool was used with the following configuration:

```
mapshaper -i cb_2018_us_cd116_500k.shp name='' -proj wgs84 -split STATEFP -o format=geojson
mapshaper -i *.json -o format=topojson force
```

Splitting directly to topojson does not create separate files, so you must first split to geojson and then convert to topojson. D3 expects WGS84 coordinate system, from which it will then apply whatever other projection (in this case, Mercator). Failing to project to WGS84 will result in computer generated art, not a map.

For Alaska specifically, which was 1mb originally, it was simplified with the `-simplify 10%` argument in `mapshaper`.