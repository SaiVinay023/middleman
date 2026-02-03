'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/lib/schemas/auth'
import { useAuth } from '@/hooks/useAuth'
import { AuthService } from '@/services/authService'

export default function Signup() {
  const { loading, error, handleAction } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = (data: any) => {
    handleAction(() => AuthService.register(data), '/dashboard')
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Create Technician Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register('fullName')} placeholder="Full Name" className="w-full p-3 border rounded-xl" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
        </div>

        <div>
          <input {...register('email')} placeholder="Email" className="w-full p-3 border rounded-xl" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <input {...register('phone')} placeholder="Phone Number" className="w-full p-3 border rounded-xl" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>

        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full p-3 border rounded-xl" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">
          {loading ? 'Processing...' : 'Register'}
        </button>
      </form>
    </div>
  )
}