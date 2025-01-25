export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          compressed: boolean | null
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: Database["public"]["Enums"]["audit_operation"]
          record_id: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          table_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          compressed?: boolean | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: Database["public"]["Enums"]["audit_operation"]
          record_id?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          table_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          compressed?: boolean | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: Database["public"]["Enums"]["audit_operation"]
          record_id?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          table_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_history: {
        Row: {
          backup_file_name: string | null
          collectors_count: number | null
          error_message: string | null
          id: string
          members_count: number | null
          operation_type: Database["public"]["Enums"]["backup_operation_type"]
          performed_at: string | null
          performed_by: string | null
          policies_count: number | null
          roles_count: number | null
          status: string | null
        }
        Insert: {
          backup_file_name?: string | null
          collectors_count?: number | null
          error_message?: string | null
          id?: string
          members_count?: number | null
          operation_type: Database["public"]["Enums"]["backup_operation_type"]
          performed_at?: string | null
          performed_by?: string | null
          policies_count?: number | null
          roles_count?: number | null
          status?: string | null
        }
        Update: {
          backup_file_name?: string | null
          collectors_count?: number | null
          error_message?: string | null
          id?: string
          members_count?: number | null
          operation_type?: Database["public"]["Enums"]["backup_operation_type"]
          performed_at?: string | null
          performed_by?: string | null
          policies_count?: number | null
          roles_count?: number | null
          status?: string | null
        }
        Relationships: []
      }
      collector_role_fix_log: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          member_number: string
          status: Database["public"]["Enums"]["collector_role_status"] | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          member_number: string
          status?: Database["public"]["Enums"]["collector_role_status"] | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          member_number?: string
          status?: Database["public"]["Enums"]["collector_role_status"] | null
        }
        Relationships: []
      }
      documentation: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: string
          id: string
          is_current: boolean | null
          metadata: Json | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path: string
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: string
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          daily_counter: number | null
          delivered_at: string | null
          email_category: string | null
          email_type: Database["public"]["Enums"]["email_type"]
          error_message: string | null
          id: string
          member_number: string | null
          metadata: Json | null
          priority: string | null
          queued_for_date: string | null
          recipient_email: string
          resend_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_counter?: number | null
          delivered_at?: string | null
          email_category?: string | null
          email_type: Database["public"]["Enums"]["email_type"]
          error_message?: string | null
          id?: string
          member_number?: string | null
          metadata?: Json | null
          priority?: string | null
          queued_for_date?: string | null
          recipient_email: string
          resend_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_counter?: number | null
          delivered_at?: string | null
          email_category?: string | null
          email_type?: Database["public"]["Enums"]["email_type"]
          error_message?: string | null
          id?: string
          member_number?: string | null
          metadata?: Json | null
          priority?: string | null
          queued_for_date?: string | null
          recipient_email?: string
          resend_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_member_number_fkey"
            columns: ["member_number"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["member_number"]
          },
        ]
      }
      email_queue_config: {
        Row: {
          auto_process_interval: number
          category: string
          created_at: string | null
          daily_limit: number
          id: string
          updated_at: string | null
        }
        Insert: {
          auto_process_interval?: number
          category: string
          created_at?: string | null
          daily_limit?: number
          id?: string
          updated_at?: string | null
        }
        Update: {
          auto_process_interval?: number
          category?: string
          created_at?: string | null
          daily_limit?: number
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enhanced_roles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_updated_at: string | null
          role_name: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_updated_at?: string | null
          role_name: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_updated_at?: string | null
          role_name?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          created_at: string
          date_of_birth: string | null
          family_member_number: string
          full_name: string
          gender: string | null
          id: string
          member_id: string
          relationship: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          family_member_number: string
          full_name: string
          gender?: string | null
          id?: string
          member_id: string
          relationship: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          family_member_number?: string
          full_name?: string
          gender?: string | null
          id?: string
          member_id?: string
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      git_repositories: {
        Row: {
          branch: string
          created_at: string | null
          created_by: string | null
          custom_url: string | null
          id: string
          is_master: boolean
          last_sync_at: string | null
          name: string
          source_url: string
          status: string | null
          target_url: string | null
        }
        Insert: {
          branch?: string
          created_at?: string | null
          created_by?: string | null
          custom_url?: string | null
          id?: string
          is_master?: boolean
          last_sync_at?: string | null
          name: string
          source_url: string
          status?: string | null
          target_url?: string | null
        }
        Update: {
          branch?: string
          created_at?: string | null
          created_by?: string | null
          custom_url?: string | null
          id?: string
          is_master?: boolean
          last_sync_at?: string | null
          name?: string
          source_url?: string
          status?: string | null
          target_url?: string | null
        }
        Relationships: []
      }
      git_sync_logs: {
        Row: {
          created_at: string | null
          created_by: string | null
          error_details: string | null
          id: string
          message: string | null
          operation_type: string
          repository_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          message?: string | null
          operation_type: string
          repository_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          message?: string | null
          operation_type?: string
          repository_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "git_sync_logs_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "git_repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_settings: {
        Row: {
          created_at: string | null
          enabled_at: string | null
          enabled_by: string | null
          id: string
          is_enabled: boolean | null
          message: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_enabled?: boolean | null
          message?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_enabled?: boolean | null
          message?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      member_notes: {
        Row: {
          created_at: string
          id: string
          member_id: string
          note_text: string
          note_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          note_text: string
          note_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          note_text?: string
          note_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          admin_note: string | null
          auth_user_id: string | null
          collector: string | null
          collector_id: string | null
          cors_enabled: boolean | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          emergency_collection_amount: number | null
          emergency_collection_created_at: string | null
          emergency_collection_due_date: string | null
          emergency_collection_status: string | null
          failed_login_attempts: number | null
          family_member_dob: string | null
          family_member_gender: string | null
          family_member_name: string | null
          family_member_relationship: string | null
          full_name: string
          gender: string | null
          id: string
          last_failed_attempt: string | null
          locked_until: string | null
          marital_status: string | null
          member_number: string
          membership_type: string | null
          password_reset_required: boolean | null
          password_set_at: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_notes: string | null
          payment_type: string | null
          phone: string | null
          postcode: string | null
          status: string | null
          ticket_description: string | null
          ticket_priority: string | null
          ticket_status: string | null
          ticket_subject: string | null
          town: string | null
          updated_at: string
          verified: boolean | null
          yearly_payment_amount: number | null
          yearly_payment_due_date: string | null
          yearly_payment_status: string | null
        }
        Insert: {
          address?: string | null
          admin_note?: string | null
          auth_user_id?: string | null
          collector?: string | null
          collector_id?: string | null
          cors_enabled?: boolean | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_collection_amount?: number | null
          emergency_collection_created_at?: string | null
          emergency_collection_due_date?: string | null
          emergency_collection_status?: string | null
          failed_login_attempts?: number | null
          family_member_dob?: string | null
          family_member_gender?: string | null
          family_member_name?: string | null
          family_member_relationship?: string | null
          full_name: string
          gender?: string | null
          id?: string
          last_failed_attempt?: string | null
          locked_until?: string | null
          marital_status?: string | null
          member_number: string
          membership_type?: string | null
          password_reset_required?: boolean | null
          password_set_at?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_notes?: string | null
          payment_type?: string | null
          phone?: string | null
          postcode?: string | null
          status?: string | null
          ticket_description?: string | null
          ticket_priority?: string | null
          ticket_status?: string | null
          ticket_subject?: string | null
          town?: string | null
          updated_at?: string
          verified?: boolean | null
          yearly_payment_amount?: number | null
          yearly_payment_due_date?: string | null
          yearly_payment_status?: string | null
        }
        Update: {
          address?: string | null
          admin_note?: string | null
          auth_user_id?: string | null
          collector?: string | null
          collector_id?: string | null
          cors_enabled?: boolean | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_collection_amount?: number | null
          emergency_collection_created_at?: string | null
          emergency_collection_due_date?: string | null
          emergency_collection_status?: string | null
          failed_login_attempts?: number | null
          family_member_dob?: string | null
          family_member_gender?: string | null
          family_member_name?: string | null
          family_member_relationship?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          last_failed_attempt?: string | null
          locked_until?: string | null
          marital_status?: string | null
          member_number?: string
          membership_type?: string | null
          password_reset_required?: boolean | null
          password_set_at?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_notes?: string | null
          payment_type?: string | null
          phone?: string | null
          postcode?: string | null
          status?: string | null
          ticket_description?: string | null
          ticket_priority?: string | null
          ticket_status?: string | null
          ticket_subject?: string | null
          town?: string | null
          updated_at?: string
          verified?: boolean | null
          yearly_payment_amount?: number | null
          yearly_payment_due_date?: string | null
          yearly_payment_status?: string | null
        }
        Relationships: []
      }
      members_collectors: {
        Row: {
          active: boolean | null
          auth_user_id: string | null
          created_at: string
          email: string | null
          id: string
          member_number: string | null
          name: string | null
          number: string | null
          phone: string | null
          prefix: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          member_number?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          prefix?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          member_number?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          prefix?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_collectors_member_number_fkey"
            columns: ["member_number"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["member_number"]
          },
        ]
      }
      monitoring_logs: {
        Row: {
          details: Json | null
          event_type: Database["public"]["Enums"]["monitoring_event_type"]
          id: string
          metric_name: string
          metric_value: number
          severity: Database["public"]["Enums"]["severity_level"] | null
          timestamp: string | null
        }
        Insert: {
          details?: Json | null
          event_type: Database["public"]["Enums"]["monitoring_event_type"]
          id?: string
          metric_name: string
          metric_value: number
          severity?: Database["public"]["Enums"]["severity_level"] | null
          timestamp?: string | null
        }
        Update: {
          details?: Json | null
          event_type?: Database["public"]["Enums"]["monitoring_event_type"]
          id?: string
          metric_name?: string
          metric_value?: number
          severity?: Database["public"]["Enums"]["severity_level"] | null
          timestamp?: string | null
        }
        Relationships: []
      }
      password_change_logs: {
        Row: {
          action: string | null
          changed_at: string | null
          changed_by: string | null
          client_info: Json | null
          error_code: string | null
          error_details: string | null
          id: string
          ip_address: string | null
          is_reset: boolean | null
          reason: string | null
          stack_trace: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          changed_at?: string | null
          changed_by?: string | null
          client_info?: Json | null
          error_code?: string | null
          error_details?: string | null
          id?: string
          ip_address?: string | null
          is_reset?: boolean | null
          reason?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          changed_at?: string | null
          changed_by?: string | null
          client_info?: Json | null
          error_code?: string | null
          error_details?: string | null
          id?: string
          ip_address?: string | null
          is_reset?: boolean | null
          reason?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      password_config: {
        Row: {
          created_at: string | null
          id: string
          lockout_duration: unknown | null
          max_attempts: number | null
          min_length: number | null
          require_lowercase: boolean | null
          require_number: boolean | null
          require_special: boolean | null
          require_uppercase: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lockout_duration?: unknown | null
          max_attempts?: number | null
          min_length?: number | null
          require_lowercase?: boolean | null
          require_number?: boolean | null
          require_special?: boolean | null
          require_uppercase?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lockout_duration?: unknown | null
          max_attempts?: number | null
          min_length?: number | null
          require_lowercase?: boolean | null
          require_number?: boolean | null
          require_special?: boolean | null
          require_uppercase?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          invalidated_at: string | null
          member_number: string | null
          token: string
          token_type: Database["public"]["Enums"]["token_type"]
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          invalidated_at?: string | null
          member_number?: string | null
          token: string
          token_type?: Database["public"]["Enums"]["token_type"]
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          invalidated_at?: string | null
          member_number?: string | null
          token?: string
          token_type?: Database["public"]["Enums"]["token_type"]
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_member_number_fkey"
            columns: ["member_number"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["member_number"]
          },
        ]
      }
      payment_receipts: {
        Row: {
          amount: number
          collector_name: string
          created_at: string | null
          email_log_id: string | null
          id: string
          member_name: string
          member_number: string
          payment_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: string
          receipt_number: string
          sent_at: string | null
          sent_to: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          collector_name: string
          created_at?: string | null
          email_log_id?: string | null
          id?: string
          member_name: string
          member_number: string
          payment_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: string
          receipt_number: string
          sent_at?: string | null
          sent_to: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          collector_name?: string
          created_at?: string | null
          email_log_id?: string | null
          id?: string
          member_name?: string
          member_number?: string
          payment_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_type?: string
          receipt_number?: string
          sent_at?: string | null
          sent_to?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_receipts_email_log_id_fkey"
            columns: ["email_log_id"]
            isOneToOne: false
            referencedRelation: "email_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_receipts_member_number_fkey"
            columns: ["member_number"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["member_number"]
          },
          {
            foreignKeyName: "payment_receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          collector_id: string
          created_at: string | null
          id: string
          member_id: string
          member_number: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string | null
          payment_type: string
          status: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          collector_id: string
          created_at?: string | null
          id?: string
          member_id: string
          member_number: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number?: string | null
          payment_type: string
          status?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          collector_id?: string
          created_at?: string | null
          id?: string
          member_id?: string
          member_number?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_number?: string | null
          payment_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_collector_id_fkey"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "members_collectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_member_number_fkey"
            columns: ["member_number"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["member_number"]
          },
        ]
      }
      permission_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          permissions: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
        }
        Relationships: []
      }
      role_history: {
        Row: {
          change_type: string | null
          changed_by_user_id: string | null
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          role: Database["public"]["Enums"]["app_role"] | null
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          change_type?: string | null
          changed_by_user_id?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          role?: Database["public"]["Enums"]["app_role"] | null
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          change_type?: string | null
          changed_by_user_id?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          role?: Database["public"]["Enums"]["app_role"] | null
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sync_status: {
        Row: {
          error_message: string | null
          id: string
          last_attempted_sync_at: string | null
          status: string | null
          store_error: string | null
          store_status: string | null
          sync_started_at: string | null
          user_id: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          last_attempted_sync_at?: string | null
          status?: string | null
          store_error?: string | null
          store_status?: string | null
          sync_started_at?: string | null
          user_id?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          last_attempted_sync_at?: string | null
          status?: string | null
          store_error?: string | null
          store_status?: string | null
          sync_started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_announcements: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          severity: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          severity?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          severity?: string | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_collector_role: {
        Args: {
          member_id: string
          collector_name: string
          collector_prefix: string
          collector_number: string
        }
        Returns: string
      }
      audit_security_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      can_access_during_maintenance: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_api_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_auth_flow: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_critical_logic: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_data_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_error_rates: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_member_numbers: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue_type: string
          description: string
          affected_table: string
          member_number: string
          details: Json
        }[]
      }
      check_rbac: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_resource_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_system_performance: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_user_activity: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      cleanup_expired_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_auth_user_for_collector: {
        Args: {
          member_num: string
        }
        Returns: string
      }
      create_auth_users_for_collectors: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_family_member_number: {
        Args: {
          p_parent_member_number: string
          p_relationship: string
        }
        Returns: string
      }
      generate_full_backup: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_password_reset_token: {
        Args: {
          p_member_number: string
          p_token_type?: Database["public"]["Enums"]["token_type"]
        }
        Returns: string
      }
      generate_payment_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_audit_activity_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          hour_bucket: string
          operation: string
          count: number
        }[]
      }
      get_collector_role_fix_report: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_processed: number
          successful: number
          failed: number
          failure_details: Json
        }[]
      }
      get_email_quota: {
        Args: {
          category: string
        }
        Returns: number
      }
      get_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          name: string
          command: string
        }[]
      }
      get_system_metrics_history: {
        Args: Record<PropertyKey, never>
        Returns: {
          recorded_at: string
          metric_name: string
          metric_value: number
          category: string
        }[]
      }
      get_tables_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          columns: Json
          rls_enabled: boolean
        }[]
      }
      handle_failed_login: {
        Args: {
          member_number: string
        }
        Returns: Json
      }
      handle_password_reset:
        | {
            Args: {
              member_number: string
              new_password: string
              admin_user_id?: string
              ip_address?: string
              user_agent?: string
              client_info?: Json
            }
            Returns: Json
          }
        | {
            Args: {
              member_number: string
              new_password: string
              current_password?: string
              ip_address?: string
              user_agent?: string
              client_info?: Json
            }
            Returns: Json
          }
      is_admin: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      is_payment_overdue: {
        Args: {
          due_date: string
        }
        Returns: boolean
      }
      is_system_in_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_valid_member_number: {
        Args: {
          member_num: string
        }
        Returns: boolean
      }
      maintain_collector_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      manual_cleanup_expired_tokens: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      perform_user_roles_sync: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_email_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_failed_login: {
        Args: {
          member_number: string
        }
        Returns: undefined
      }
      restore_from_backup: {
        Args: {
          backup_data: Json
        }
        Returns: string
      }
      run_combined_system_checks: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
          test_category: string
        }[]
      }
      update_collector_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      use_reset_token: {
        Args: {
          token_value: string
        }
        Returns: {
          member_number: string
          user_id: string
        }[]
      }
      validate_password_complexity: {
        Args: {
          password: string
        }
        Returns: Json
      }
      validate_reset_token: {
        Args: {
          token_value: string
        }
        Returns: boolean
      }
      validate_user_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "collector" | "member"
      audit_operation:
        | "create"
        | "update"
        | "delete"
        | "INSERT"
        | "UPDATE"
        | "DELETE"
      backup_operation_type: "backup" | "restore"
      collector_role_status:
        | "started"
        | "processing"
        | "completed"
        | "failed"
        | "created"
      email_status: "pending" | "sent" | "delivered" | "failed" | "bounced"
      email_type:
        | "password_reset"
        | "welcome"
        | "verification"
        | "notification"
        | "system_announcement"
        | "payment_confirmation"
        | "payment_receipt"
      monitoring_event_type:
        | "system_performance"
        | "api_latency"
        | "error_rate"
        | "user_activity"
        | "resource_usage"
      payment_method: "bank_transfer" | "cash"
      performance_metric:
        | "response_time"
        | "query_performance"
        | "connection_count"
        | "cache_hit_ratio"
      severity_level: "info" | "warning" | "error" | "critical"
      token_type: "password_reset" | "email_verification"
    }
    CompositeTypes: {
      reset_rate_limit_error: {
        message: string | null
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
