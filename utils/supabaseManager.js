// Comprehensive Supabase Integration for Conservation Platform
// This module provides full data persistence and real-time updates

import { createClient } from '@supabase/supabase-js'

// Supabase configuration with your actual project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lyvulonnashmukxedovq.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dnVsb25uYXNobXVreGVkb3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzk1NDIsImV4cCI6MjA2ODg1NTU0Mn0.BIOt9KiMwIrm4sExH01z3BVJIkMyL-GaBsLSIzoUNB4'

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration. Please check your environment variables.')
} else {
  console.log('✅ Supabase configuration loaded successfully')
  console.log('🔗 Connected to:', supabaseUrl)
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Conservation Data Management Class
export class ConservationDataManager {
  constructor() {
    this.isOnline = true;
    this.localCache = new Map();
    this.setupConnectionMonitoring();
  }

  // Connection monitoring
  setupConnectionMonitoring() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncPendingChanges();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      if (!this.isOnline) {
        return this.saveToLocalCache('create', table, data);
      }

      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`✅ Created ${table} record:`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error(`❌ Error creating ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  async read(table, filters = {}) {
    try {
      if (!this.isOnline) {
        return this.getFromLocalCache(table, filters);
      }

      let query = supabase.from(table).select('*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Cache the data locally
      this.localCache.set(`${table}_${JSON.stringify(filters)}`, data);
      
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error reading ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  async update(table, id, updates) {
    try {
      if (!this.isOnline) {
        return this.saveToLocalCache('update', table, { id, ...updates });
      }

      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`✅ Updated ${table} record:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error updating ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  async delete(table, id) {
    try {
      if (!this.isOnline) {
        return this.saveToLocalCache('delete', table, { id });
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log(`✅ Deleted ${table} record with ID:`, id);
      return { success: true };
    } catch (error) {
      console.error(`❌ Error deleting ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Conservation-specific data operations
  
  // Survey Management
  async createSurvey(surveyData) {
    const survey = {
      ...surveyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await this.create('surveys', survey);
  }

  async getSurveys(filters = {}) {
    return await this.read('surveys', filters);
  }

  async updateSurvey(id, updates) {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return await this.update('surveys', id, updatedData);
  }

  async deleteSurvey(id) {
    return await this.delete('surveys', id);
  }

  // Volunteer Management
  async createVolunteer(volunteerData) {
    const volunteer = {
      ...volunteerData,
      status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await this.create('volunteers', volunteer);
  }

  async getVolunteers(filters = {}) {
    return await this.read('volunteers', filters);
  }

  async updateVolunteer(id, updates) {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return await this.update('volunteers', id, updatedData);
  }

  async deleteVolunteer(id) {
    return await this.delete('volunteers', id);
  }

  // Donor Management
  async createDonor(donorData) {
    const donor = {
      ...donorData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await this.create('donors', donor);
  }

  async getDonors(filters = {}) {
    return await this.read('donors', filters);
  }

  async updateDonor(id, updates) {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return await this.update('donors', id, updatedData);
  }

  // Grant Management
  async createGrant(grantData) {
    const grant = {
      ...grantData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await this.create('grants', grant);
  }

  async getGrants(filters = {}) {
    return await this.read('grants', filters);
  }

  async updateGrant(id, updates) {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return await this.update('grants', id, updatedData);
  }

  // Compliance Management
  async createComplianceItem(complianceData) {
    const compliance = {
      ...complianceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await this.create('compliance', compliance);
  }

  async getComplianceItems(filters = {}) {
    return await this.read('compliance', filters);
  }

  async updateComplianceItem(id, updates) {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return await this.update('compliance', id, updatedData);
  }

  // Advanced query operations
  async getConservationMetrics() {
    try {
      // Get aggregated conservation metrics
      const metrics = {
        totalSurveys: 0,
        totalVolunteers: 0,
        totalDonors: 0,
        totalGrants: 0,
        totalFunding: 0,
        activeProjects: 0
      };

      if (this.isOnline) {
        // Fetch real data from Supabase
        const [surveys, volunteers, donors, grants] = await Promise.all([
          this.getSurveys(),
          this.getVolunteers(),
          this.getDonors(),
          this.getGrants()
        ]);

        metrics.totalSurveys = surveys.data?.length || 0;
        metrics.totalVolunteers = volunteers.data?.length || 0;
        metrics.totalDonors = donors.data?.length || 0;
        metrics.totalGrants = grants.data?.length || 0;
        
        if (donors.data) {
          metrics.totalFunding = donors.data.reduce((sum, donor) => sum + (donor.total_donated || 0), 0);
        }
        
        if (grants.data) {
          metrics.activeProjects = grants.data.filter(grant => grant.status === 'Active').length;
        }
      }

      return { success: true, data: metrics };
    } catch (error) {
      console.error('❌ Error fetching conservation metrics:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  subscribeToTable(table, callback) {
    if (!this.isOnline) return null;

    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: table 
      }, callback)
      .subscribe();
  }

  // File upload operations
  async uploadFile(bucket, fileName, file) {
    try {
      if (!this.isOnline) {
        throw new Error('File upload requires internet connection');
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;
      
      console.log(`✅ File uploaded: ${fileName}`);
      return { success: true, data };
    } catch (error) {
      console.error('❌ File upload error:', error);
      return { success: false, error: error.message };
    }
  }

  async downloadFile(bucket, fileName) {
    try {
      if (!this.isOnline) {
        throw new Error('File download requires internet connection');
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .download(fileName);

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ File download error:', error);
      return { success: false, error: error.message };
    }
  }

  // Offline support methods
  saveToLocalCache(operation, table, data) {
    const cacheKey = `pending_${operation}_${table}_${Date.now()}`;
    const pendingOperation = {
      operation,
      table,
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(pendingOperation));
    console.log(`💾 Saved to local cache: ${operation} on ${table}`);
    
    return { success: true, cached: true, data };
  }

  getFromLocalCache(table, filters) {
    const cacheKey = `${table}_${JSON.stringify(filters)}`;
    const cached = this.localCache.get(cacheKey);
    
    if (cached) {
      console.log(`📱 Retrieved from cache: ${table}`);
      return { success: true, data: cached, cached: true };
    }
    
    return { success: false, error: 'No cached data available' };
  }

  async syncPendingChanges() {
    console.log('🔄 Syncing pending changes...');
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('pending_')) {
        try {
          const pendingOp = JSON.parse(localStorage.getItem(key));
          
          switch (pendingOp.operation) {
            case 'create':
              await this.create(pendingOp.table, pendingOp.data);
              break;
            case 'update':
              await this.update(pendingOp.table, pendingOp.data.id, pendingOp.data);
              break;
            case 'delete':
              await this.delete(pendingOp.table, pendingOp.data.id);
              break;
          }
          
          localStorage.removeItem(key);
          console.log(`✅ Synced: ${pendingOp.operation} on ${pendingOp.table}`);
        } catch (error) {
          console.error('❌ Sync error:', error);
        }
      }
    }
  }

  // Utility methods
  async checkConnection() {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('count')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }

  async getTableSchema(table) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      return { success: !error, schema: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const dataManager = new ConservationDataManager();

// Export utility functions
export const createRecord = async (table, data) => {
  return await dataManager.create(table, data);
};

export const getRecords = async (table, filters = {}) => {
  return await dataManager.read(table, filters);
};

export const updateRecord = async (table, id, updates) => {
  return await dataManager.update(table, id, updates);
};

export const deleteRecord = async (table, id) => {
  return await dataManager.delete(table, id);
};

// Conservation-specific exports
export const {
  createSurvey,
  getSurveys,
  updateSurvey,
  deleteSurvey,
  createVolunteer,
  getVolunteers,
  updateVolunteer,
  deleteVolunteer,
  createDonor,
  getDonors,
  updateDonor,
  createGrant,
  getGrants,
  updateGrant,
  createComplianceItem,
  getComplianceItems,
  updateComplianceItem,
  getConservationMetrics,
  subscribeToTable,
  uploadFile,
  downloadFile
} = dataManager;

export default ConservationDataManager;
