import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Mock Mapbox token - replace with actual token in production
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.your-token-here'

const MapView = ({ 
  center = [-110.5, 44.7], 
  zoom = 10, 
  activeLayers = [], 
  surveyData = [], 
  onSiteSelect 
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])

  useEffect(() => {
    if (map.current) return // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: activeLayers.includes('satellite') ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/outdoors-v12',
      center: center,
      zoom: zoom,
      attributionControl: false
    })

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }), 'bottom-left')

    map.current.on('load', () => {
      // Add markers for survey sites
      addSurveyMarkers()
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Update map center and zoom when props change
  useEffect(() => {
    if (map.current) {
      map.current.setCenter(center)
      map.current.setZoom(zoom)
    }
  }, [center, zoom])

  // Update map style based on active layers
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      const newStyle = activeLayers.includes('satellite') 
        ? 'mapbox://styles/mapbox/satellite-v9' 
        : 'mapbox://styles/mapbox/outdoors-v12'
      
      map.current.setStyle(newStyle)
      
      // Re-add markers after style change
      map.current.once('styledata', () => {
        addSurveyMarkers()
      })
    }
  }, [activeLayers])

  const addSurveyMarkers = () => {
    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    if (!activeLayers.includes('survey_sites')) return

    surveyData.forEach(site => {
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'survey-marker'
      el.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background-color: ${
          site.status === 'active' ? '#16a34a' : 
          site.status === 'seasonal' ? '#eab308' : 
          '#6b7280'
        };
      `

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-medium text-gray-900 mb-2">${site.name}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <div><strong>Type:</strong> ${site.type}</div>
            <div><strong>Last Survey:</strong> ${site.last_survey}</div>
            <div><strong>Species:</strong> ${site.species_count}</div>
            <div><strong>Status:</strong> <span class="capitalize">${site.status}</span></div>
          </div>
          <button class="mt-2 text-xs bg-conservation-600 text-white px-2 py-1 rounded hover:bg-conservation-700">
            View Details
          </button>
        </div>
      `)

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(site.coordinates)
        .setPopup(popup)
        .addTo(map.current)

      // Add click handler
      el.addEventListener('click', () => {
        if (onSiteSelect) {
          onSiteSelect(site)
        }
      })

      markers.current.push(marker)
    })

    // Add observation points if layer is active
    if (activeLayers.includes('observations')) {
      addObservationMarkers()
    }

    // Add habitat zones if layer is active
    if (activeLayers.includes('habitats')) {
      addHabitatZones()
    }
  }

  const addObservationMarkers = () => {
    // Mock observation data
    const observations = [
      { id: 1, coordinates: [-110.1200, 44.9900], species: 'Gray Wolf', count: 3, date: '2024-12-01' },
      { id: 2, coordinates: [-110.1300, 44.9850], species: 'Brown Bear', count: 1, date: '2024-11-28' },
      { id: 3, coordinates: [-110.4600, 44.5700], species: 'Golden Eagle', count: 2, date: '2024-11-25' },
      { id: 4, coordinates: [-110.4500, 44.5650], species: 'Moose', count: 4, date: '2024-11-20' }
    ]

    observations.forEach(obs => {
      const el = document.createElement('div')
      el.className = 'observation-marker'
      el.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #3b82f6;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      `

      const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
        <div class="p-2">
          <h4 class="font-medium text-sm">${obs.species}</h4>
          <div class="text-xs text-gray-600">
            <div>Count: ${obs.count}</div>
            <div>Date: ${obs.date}</div>
          </div>
        </div>
      `)

      const marker = new mapboxgl.Marker(el)
        .setLngLat(obs.coordinates)
        .setPopup(popup)
        .addTo(map.current)

      markers.current.push(marker)
    })
  }

  const addHabitatZones = () => {
    if (!map.current.getSource('habitat-zones')) {
      // Mock habitat zone data
      const habitatZones = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { 
              name: 'Forest Habitat',
              type: 'Forest',
              area: '2,500 hectares'
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-110.2, 44.95],
                [-110.05, 44.95],
                [-110.05, 45.05],
                [-110.2, 45.05],
                [-110.2, 44.95]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { 
              name: 'Wetland Habitat',
              type: 'Wetland',
              area: '800 hectares'
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-110.5, 44.55],
                [-110.4, 44.55],
                [-110.4, 44.6],
                [-110.5, 44.6],
                [-110.5, 44.55]
              ]]
            }
          }
        ]
      }

      map.current.addSource('habitat-zones', {
        type: 'geojson',
        data: habitatZones
      })

      map.current.addLayer({
        id: 'habitat-zones-fill',
        type: 'fill',
        source: 'habitat-zones',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'type'], 'Forest'], '#16a34a',
            ['==', ['get', 'type'], 'Wetland'], '#06b6d4',
            '#6b7280'
          ],
          'fill-opacity': 0.3
        }
      })

      map.current.addLayer({
        id: 'habitat-zones-outline',
        type: 'line',
        source: 'habitat-zones',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'type'], 'Forest'], '#16a34a',
            ['==', ['get', 'type'], 'Wetland'], '#06b6d4',
            '#6b7280'
          ],
          'line-width': 2
        }
      })

      // Add click handler for habitat zones
      map.current.on('click', 'habitat-zones-fill', (e) => {
        const properties = e.features[0].properties
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h4 class="font-medium">${properties.name}</h4>
              <div class="text-sm text-gray-600">
                <div>Type: ${properties.type}</div>
                <div>Area: ${properties.area}</div>
              </div>
            </div>
          `)
          .addTo(map.current)
      })
    }
  }

  // Update markers when layers change
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      addSurveyMarkers()
    }
  }, [activeLayers, surveyData])

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}

export default MapView
