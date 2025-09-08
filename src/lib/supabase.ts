import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here'

// Only create Supabase client if properly configured
export const supabase = isSupabaseConfigured 

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'farmer' | 'consumer'
          location: string
          phone?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'farmer' | 'consumer'
          location: string
          phone?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'farmer' | 'consumer'
          location?: string
          phone?: string
          avatar_url?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          unit: string
          quantity: number
          location: string
          image: string
          farmer_id: string
          farmer_name: string
          rating: number
          description: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          unit: string
          quantity: number
          location: string
          image: string
          farmer_id: string
          farmer_name: string
          rating?: number
          description?: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          unit?: string
          quantity?: number
          location?: string
          image?: string
          farmer_id?: string
          farmer_name?: string
          rating?: number
          description?: string
          category?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          farmer_id: string
          items: any
          total: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          delivery_address: string
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          farmer_id: string
          items: any
          total: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          delivery_address: string
          payment_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          farmer_id?: string
          items?: any
          total?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          delivery_address?: string
          payment_method?: string
          updated_at?: string
        }
      }
      market_trends: {
        Row: {
          id: string
          crop_name: string
          current_price: number
          predicted_price: number
          price_change: number
          demand_level: 'low' | 'medium' | 'high'
          supply_level: 'low' | 'medium' | 'high'
          recommendation: 'sell' | 'hold' | 'wait'
          confidence: number
          factors: string[]
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          crop_name: string
          current_price: number
          predicted_price: number
          price_change: number
          demand_level: 'low' | 'medium' | 'high'
          supply_level: 'low' | 'medium' | 'high'
          recommendation: 'sell' | 'hold' | 'wait'
          confidence: number
          factors: string[]
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          crop_name?: string
          current_price?: number
          predicted_price?: number
          price_change?: number
          demand_level?: 'low' | 'medium' | 'high'
          supply_level?: 'low' | 'medium' | 'high'
          recommendation?: 'sell' | 'hold' | 'wait'
          confidence?: number
          factors?: string[]
          date?: string
          created_at?: string
        }
      }
    }
  }
}

// Auth helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    console.log('🔄 Starting sign up process...', { email, role: userData.role });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          location: userData.location,
          phone: userData.phone
        }
      }
    })
    
    if (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
    
    console.log('✅ Auth user created:', data.user?.id);
    
    // Create profile in profiles table
    if (data.user) {
      console.log('🔄 Creating profile in database...');
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          location: userData.location,
          phone: userData.phone || null
        })
      
      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        throw profileError;
      }
      
      console.log('✅ Profile created successfully');
    }
    
    return data
  } catch (error) {
    console.error('❌ Sign up error:', error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    console.log('🔄 Starting sign in process...', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
    
    console.log('✅ Sign in successful:', data.user?.id);
    return data
  } catch (error) {
    console.error('❌ Sign in error:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    console.log('🔄 Signing out...');
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    console.log('✅ Sign out successful');
  } catch (error) {
    console.error('❌ Sign out error:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    if (!isSupabaseConfigured) {
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      console.log('🔄 Fetching user profile...', user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.error('❌ Profile fetch error:', error)
        return null
      }
      
      console.log('✅ Profile fetched:', profile.name, `(${profile.role})`);
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        location: profile.location,
        phone: profile.phone,
        avatar: profile.avatar_url
      }
    }
    
    return null
  } catch (error) {
    console.error('❌ Get current user error:', error)
    return null
  }
}

// Product operations
export const addProduct = async (product: any) => {
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    console.log('🔄 Adding product...', product.name);
    
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ Product added:', data.name);
    return data
  } catch (error) {
    console.error('❌ Add product error:', error)
    throw error
  }
}

export const getProducts = async () => {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }
    
    console.log('🔄 Fetching products...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log('✅ Products fetched:', data?.length || 0);
    return data || []
  } catch (error) {
    console.error('❌ Get products error:', error)
    return []
  }
}

export const getFarmerProducts = async (farmerId: string) => {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }
    
    console.log('🔄 Fetching farmer products...', farmerId);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log('✅ Farmer products fetched:', data?.length || 0);
    return data || []
  } catch (error) {
    console.error('❌ Get farmer products error:', error)
    return []
  }
}

// Order operations
export const createOrder = async (order: any) => {
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Database not configured. Please set up Supabase credentials.');
    }
    
    console.log('🔄 Creating order...', order.total);
    
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ Order created:', data.id);
    return data
  } catch (error) {
    console.error('❌ Create order error:', error)
    throw error
  }
}

export const getFarmerOrders = async (farmerId: string) => {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }
    
    console.log('🔄 Fetching farmer orders...', farmerId);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log('✅ Farmer orders fetched:', data?.length || 0);
    return data || []
  } catch (error) {
    console.error('❌ Get farmer orders error:', error)
    return []
  }
}

export const getConsumerOrders = async (userId: string) => {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }
    
    console.log('🔄 Fetching consumer orders...', userId);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log('✅ Consumer orders fetched:', data?.length || 0);
    return data || []
  } catch (error) {
    console.error('❌ Get consumer orders error:', error)
    return []
  }
}

// Market trends operations
export const getMarketTrends = async () => {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }
    
    console.log('🔄 Fetching market trends...');
    
    const { data, error } = await supabase
      .from('market_trends')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log('✅ Market trends fetched:', data?.length || 0);
    return data || []
  } catch (error) {
    console.error('❌ Get market trends error:', error)
    return []
  }
}

// Test database connection
export const testConnection = async () => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.log('⚠️ Supabase not configured - using demo mode');
      return false;
    }
    
    console.log('🔄 Testing database connection...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    console.log('✅ Database connection successful');
    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
}