import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { signupSchema, loginSchema } from '@/lib/schemas/auth'

export const AuthService = {
  async register(values: z.infer<typeof signupSchema>) {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          phone: values.phone
        }
      }
    })
    if (error) throw error
    return data
  },

  async login(values: z.infer<typeof loginSchema>) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })
    if (error) throw error
    return data
  },

  async sendResetCode(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
}