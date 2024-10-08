export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DiscSearch = Database['public']['Functions']['disc_search']['Returns'][0];
export type DiscListing = Database['public']['Tables']['discs']['Row'];
export type BrandCounts = Database['public']['Functions']['get_brand_counts']['Returns'];
export type MoldCounts = Database['public']['Functions']['get_mold_counts']['Returns'];
export type TypeCounts = Database['public']['Functions']['get_type_counts']['Returns'];
export type AutocompleteOption = Omit<Database['public']['Functions']['autocomplete']['Returns'][0], 'greatest_sml'>;

export type Database = {
  public: {
    Tables: {
      disc_info: {
        Row: {
          bead: string
          brand: string
          diameter: number
          fade: number
          glide: number
          height: number
          id: number
          inside_rim_diameter: number
          mold: string
          rim_configuration: number
          rim_depth: number
          rim_diameter_ratio: number
          rim_thickness: number
          speed: number
          stability: number
          turn: number
          type: string
        }
        Insert: {
          bead: string
          brand: string
          diameter: number
          fade: number
          glide: number
          height: number
          id: number
          inside_rim_diameter: number
          mold: string
          rim_configuration: number
          rim_depth: number
          rim_diameter_ratio: number
          rim_thickness: number
          speed: number
          stability: number
          turn: number
          type: string
        }
        Update: {
          bead?: string
          brand?: string
          diameter?: number
          fade?: number
          glide?: number
          height?: number
          id?: number
          inside_rim_diameter?: number
          mold?: string
          rim_configuration?: number
          rim_depth?: number
          rim_diameter_ratio?: number
          rim_thickness?: number
          speed?: number
          stability?: number
          turn?: number
          type?: string
        }
        Relationships: []
      }
      discs: {
        Row: {
          details_url: string
          disc_info_id: number
          id: string
          img_src: string
          listing: string
          price: number
          retailer: string
          type: string
        }
        Insert: {
          details_url: string
          disc_info_id: number
          id?: string
          img_src: string
          listing: string
          price: number
          retailer: string
          type: string
        }
        Update: {
          details_url?: string
          disc_info_id?: number
          id?: string
          img_src?: string
          listing?: string
          price?: number
          retailer?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "discs_disc_info_id_fkey"
            columns: ["disc_info_id"]
            isOneToOne: false
            referencedRelation: "disc_info"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      autocomplete: {
        Args: {
          search: string
        }
        Returns: {
          greatest_sml: number
          listing: string
          img_src: string
        }[]
      }
      disc_search: {
        Args: {
          query: string
          brand_filter: string[]
          mold_filter: string[]
          type_filter: string[]
          speed_filter: number[]
          turn_filter: number[]
          glide_filter: number[]
          fade_filter: number[]
          page: number
          sort: string
        }
        Returns: {
          details_url: string
          listing: string
          img_src: string
          price: number
          mold: string
          brand: string
          speed: number
          glide: number
          turn: number
          fade: number
          retailer: string
        }[]
      }
      disc_search_results_count: {
        Args: {
          query: string
          brand_filter: string[]
          mold_filter: string[]
          type_filter: string[]
          speed_filter: number[]
          turn_filter: number[]
          glide_filter: number[]
          fade_filter: number[]
        }
        Returns: number
      }
      get_brand_counts: {
        Args: {
          query: string
          type_filter: string[]
          speed_filter: number[]
          turn_filter: number[]
          glide_filter: number[]
          fade_filter: number[]
        }
        Returns: {
          brand: string
          count: number
        }[]
      }
      get_mold_counts: {
        Args: {
          query: string
          brand_filter: string[]
          type_filter: string[]
          speed_filter: number[]
          turn_filter: number[]
          glide_filter: number[]
          fade_filter: number[]
        }
        Returns: {
          mold: string
          count: number
        }[]
      }
      get_type_counts: {
        Args: {
          query: string
          brand_filter: string[]
          mold_filter: string[]
          speed_filter: number[]
          turn_filter: number[]
          glide_filter: number[]
          fade_filter: number[]
        }
        Returns: {
          type: string
          count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
