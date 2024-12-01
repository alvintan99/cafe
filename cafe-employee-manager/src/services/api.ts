import axios from 'axios'
import { Cafe, Employee } from '../types'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export const cafeService = {
  getAll: async (location?: string) => {
    const response = await api.get<Cafe[]>('/cafes', {
      params: { location }
    })
    return response.data
  },

  getById: async (id: string) => {
    if (!id) throw new Error('Cafe ID is required')
    const response = await api.get<Cafe>(`/cafes/${id}`)
    return response.data
  },

  create: async (formData: FormData) => {
    const response = await api.post<Cafe>('/cafe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.put<Cafe>(`/cafe/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  delete: async () => {
    await api.delete('/cafe')
  },
}

export const employeeService = {
  getAll: async (cafeId?: string) => {
    const response = await api.get<Employee[]>('/employees', {
      params: { cafe: cafeId }
    })
    return response.data
  },

  getById: async (id: string) => {
    if (!id) throw new Error('Employee ID is required')
    const response = await api.get<Employee>(`/employees/${id}`)
    return response.data
  },

  create: async (data: Partial<Employee>) => {
    const response = await api.post<Employee>('/employee', data)
    return response.data
  },

  update: async (id: string, data: Partial<Employee>) => {
    const response = await api.put<Employee>(`/employee/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/employee/${id}`)
  },
}