// Real-world conservation data for demonstration
export const conservationData = {
  // Active Conservation Projects (Based on real initiatives)
  projects: [
    {
      id: 'proj_1',
      name: 'Amazon Rainforest Restoration Initiative',
      organization: 'WWF Brazil',
      location: 'Acre, Brazil',
      coordinates: [-9.0238, -70.8120],
      area_hectares: 15600,
      status: 'active',
      start_date: '2023-01-15',
      budget: 2800000,
      species_count: 847,
      trees_planted: 125000,
      carbon_offset: 45600,
      description: 'Large-scale reforestation and biodiversity conservation in the Brazilian Amazon',
      impact_metrics: {
        forest_cover_restored: 12400,
        species_protected: 847,
        communities_involved: 23,
        jobs_created: 156
      }
    },
    {
      id: 'proj_2',
      name: 'Coral Reef Regeneration Project',
      organization: 'Great Barrier Reef Foundation',
      location: 'Queensland, Australia',
      coordinates: [-16.2839, 145.7781],
      area_hectares: 2340,
      status: 'active',
      start_date: '2022-08-01',
      budget: 1900000,
      species_count: 432,
      coral_coverage: 68,
      water_quality_score: 7.8,
      description: 'Coral restoration and marine ecosystem protection in the Great Barrier Reef',
      impact_metrics: {
        coral_fragments_planted: 15600,
        reef_area_restored: 2340,
        marine_species_count: 432,
        water_quality_improvement: 15
      }
    },
    {
      id: 'proj_3',
      name: 'African Elephant Conservation Program',
      organization: 'Save the Elephants',
      location: 'Samburu, Kenya',
      coordinates: [0.5667, 37.5333],
      area_hectares: 8900,
      status: 'active',
      start_date: '2021-03-10',
      budget: 950000,
      species_count: 156,
      elephant_population: 890,
      poaching_incidents: 3,
      description: 'Comprehensive elephant protection and habitat conservation in Northern Kenya',
      impact_metrics: {
        elephants_tracked: 890,
        poaching_reduction: 78,
        habitat_protected: 8900,
        community_rangers: 45
      }
    },
    {
      id: 'proj_4',
      name: 'Urban Biodiversity Initiative',
      organization: 'NYC Parks Conservation',
      location: 'New York City, USA',
      coordinates: [40.7128, -74.0060],
      area_hectares: 567,
      status: 'active',
      start_date: '2023-06-01',
      budget: 780000,
      species_count: 234,
      green_corridors: 12,
      native_plants: 45600,
      description: 'Creating biodiversity corridors and native habitat in urban environments',
      impact_metrics: {
        native_species_returned: 89,
        green_space_created: 567,
        air_quality_improvement: 23,
        community_volunteers: 1200
      }
    },
    {
      id: 'proj_5',
      name: 'Polar Bear Habitat Protection',
      organization: 'Polar Bears International',
      location: 'Svalbard, Norway',
      coordinates: [78.2232, 15.6267],
      area_hectares: 34500,
      status: 'active',
      start_date: '2022-04-15',
      budget: 1200000,
      species_count: 67,
      polar_bear_population: 234,
      ice_coverage: 76,
      description: 'Arctic habitat conservation and polar bear population monitoring',
      impact_metrics: {
        bears_monitored: 234,
        habitat_protected: 34500,
        research_stations: 8,
        climate_data_points: 12600
      }
    }
  ],

  // Live Field Surveys and Data Collection
  surveys: [
    {
      id: 'survey_1',
      project_id: 'proj_1',
      title: 'Weekly Forest Monitoring Survey',
      type: 'biodiversity_assessment',
      frequency: 'weekly',
      responses: 1245,
      completion_rate: 94,
      last_updated: '2025-01-24',
      fields: [
        'Tree density per hectare',
        'Canopy cover percentage', 
        'Species diversity index',
        'Seedling survival rate',
        'Soil quality indicators',
        'Wildlife sighting frequency'
      ],
      recent_data: [
        { date: '2025-01-24', tree_density: 485, canopy_cover: 82, species_count: 67 },
        { date: '2025-01-17', tree_density: 478, canopy_cover: 80, species_count: 65 },
        { date: '2025-01-10', tree_density: 471, canopy_cover: 79, species_count: 63 }
      ]
    },
    {
      id: 'survey_2',
      project_id: 'proj_2',
      title: 'Coral Health Assessment',
      type: 'marine_monitoring',
      frequency: 'monthly',
      responses: 567,
      completion_rate: 91,
      last_updated: '2025-01-23',
      fields: [
        'Coral coverage percentage',
        'Bleaching severity index',
        'Fish species diversity',
        'Water temperature',
        'pH levels',
        'Turbidity measurements'
      ],
      recent_data: [
        { date: '2025-01-23', coral_coverage: 68, bleaching_index: 2.1, fish_species: 89 },
        { date: '2024-12-23', coral_coverage: 65, bleaching_index: 2.3, fish_species: 87 },
        { date: '2024-11-23', coral_coverage: 63, bleaching_index: 2.5, fish_species: 85 }
      ]
    },
    {
      id: 'survey_3',
      project_id: 'proj_3',
      title: 'Elephant Movement Tracking',
      type: 'wildlife_monitoring',
      frequency: 'daily',
      responses: 2890,
      completion_rate: 97,
      last_updated: '2025-01-25',
      fields: [
        'Herd size',
        'Location coordinates',
        'Movement patterns',
        'Habitat usage',
        'Human-wildlife conflict incidents',
        'Health observations'
      ],
      recent_data: [
        { date: '2025-01-25', herd_size: 23, conflicts: 0, health_score: 8.5 },
        { date: '2025-01-24', herd_size: 25, conflicts: 0, health_score: 8.7 },
        { date: '2025-01-23', herd_size: 24, conflicts: 1, health_score: 8.3 }
      ]
    }
  ],

  // Species Observations (Real-time data simulation)
  species: [
    {
      id: 'species_1',
      name: 'Jaguar',
      scientific_name: 'Panthera onca',
      conservation_status: 'Near Threatened',
      project_id: 'proj_1',
      population_trend: 'increasing',
      recent_sightings: 34,
      habitat_quality: 8.2,
      threats: ['Habitat loss', 'Human-wildlife conflict'],
      last_sighting: '2025-01-23'
    },
    {
      id: 'species_2',
      name: 'Green Sea Turtle',
      scientific_name: 'Chelonia mydas',
      conservation_status: 'Endangered',
      project_id: 'proj_2',
      population_trend: 'stable',
      recent_sightings: 78,
      habitat_quality: 7.6,
      threats: ['Climate change', 'Plastic pollution'],
      last_sighting: '2025-01-24'
    },
    {
      id: 'species_3',
      name: 'African Elephant',
      scientific_name: 'Loxodonta africana',
      conservation_status: 'Endangered',
      project_id: 'proj_3',
      population_trend: 'stable',
      recent_sightings: 890,
      habitat_quality: 7.9,
      threats: ['Poaching', 'Habitat fragmentation'],
      last_sighting: '2025-01-25'
    }
  ],

  // Stakeholder Data (NGO ecosystem)
  stakeholders: [
    {
      id: 'stake_1',
      name: 'Global Conservation Foundation',
      type: 'major_donor',
      total_donated: 2400000,
      projects_supported: 8,
      engagement_level: 'high',
      last_contact: '2025-01-20',
      contact_frequency: 'monthly',
      interests: ['forest_conservation', 'climate_change']
    },
    {
      id: 'stake_2',
      name: 'Marine Biology Research Institute',
      type: 'research_partner',
      collaboration_projects: 3,
      data_contributions: 1250,
      engagement_level: 'high',
      last_contact: '2025-01-22',
      contact_frequency: 'weekly',
      interests: ['marine_conservation', 'coral_restoration']
    },
    {
      id: 'stake_3',
      name: 'Local Community Rangers',
      type: 'field_partner',
      active_members: 45,
      training_hours: 2340,
      engagement_level: 'high',
      last_contact: '2025-01-24',
      contact_frequency: 'daily',
      interests: ['wildlife_protection', 'community_development']
    }
  ],

  // Impact Metrics (Real-time updates)
  impact_summary: {
    total_area_protected: 62007, // hectares
    species_monitored: 1836,
    carbon_sequestered: 156700, // tons CO2
    communities_engaged: 89,
    volunteers_active: 2890,
    data_points_collected: 45600,
    funding_raised: 8630000, // USD
    projects_completed: 23,
    success_rate: 94.2,
    last_updated: '2025-01-25T10:30:00Z'
  }
}

export default conservationData
