import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { signupSchema, loginSchema } from '@/lib/schemas/auth'
import { logAuthError } from '@/lib/errorTracking'

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
        logAuthError(error, 'register', values.email);
    if (error) throw error
    return data
  },

  async login(values: z.infer<typeof loginSchema>) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })
    logAuthError(error, 'login', values.email);
    if (error) throw error
    return data
  },

  async sendResetCode(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    logAuthError(error, 'password_reset', email);
    if (error) throw error
  }
}
