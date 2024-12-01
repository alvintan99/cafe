import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { TextInput } from '../components/TextInput'
import { employeeService, cafeService } from '../services/api'
import { Cafe } from '../types'

type EmployeeFormData = {
  name: string
  emailAddress: string
  phoneNumber: string
  gender: 'Male' | 'Female'  // Using literal type to match Employee type
  cafeId: string
}

export const EmployeeForm = () => {
  const [form, setForm] = useState<EmployeeFormData>({
    name: '',
    emailAddress: '',
    phoneNumber: '',
    gender: 'Male' as const,  // Using 'as const' to ensure literal type
    cafeId: '',
  })
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCafes()
    if (id) {
      fetchEmployee()
    }
  }, [id])

  const fetchCafes = async () => {
    try {
      const data = await cafeService.getAll()
      setCafes(data)
    } catch (error) {
      console.error('Error fetching cafes:', error)
    }
  }

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getById(id!)
      setForm({
        name: data.name,
        emailAddress: data.emailAddress,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        cafeId: data.cafeId || '',
      })
    } catch (error) {
      console.error('Error fetching employee:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (id) {
        await employeeService.update(id, form)
      } else {
        await employeeService.create(form)
      }
      navigate('/employees')
    } catch (error) {
      console.error('Error saving employee:', error)
    }
  }

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'gender' ? (value as 'Male' | 'Female') : value
    }))
    setIsDirty(true)
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            inputProps={{ minLength: 6, maxLength: 10 }}
            error={form.name.length > 0 && (form.name.length < 6 || form.name.length > 10)}
            helperText="Name must be between 6 and 10 characters"
            sx={{ mb: 2 }}
          />

          <TextInput
            label="Email Address"
            type="email"
            value={form.emailAddress}
            onChange={(e) => handleChange('emailAddress', e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextInput
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            required
            inputProps={{ pattern: '^[89][0-9]{7}$' }}
            error={form.phoneNumber.length > 0 && !/^[89][0-9]{7}$/.test(form.phoneNumber)}
            helperText="Phone number must start with 8 or 9 and have 8 digits"
            sx={{ mb: 2 }}
          />

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>

          <TextInput
            select
            label="Assigned Cafe"
            value={form.cafeId}
            onChange={(e) => handleChange('cafeId', e.target.value)}
            required
            sx={{ mb: 3 }}
          >
            {cafes.map((cafe) => (
              <MenuItem key={cafe.id} value={cafe.id}>
                {cafe.name}
              </MenuItem>
            ))}
          </TextInput>

          <Box display="flex" justifyContent="space-between">
            <Button onClick={() => {
              if (!isDirty || window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                navigate('/employees')
              }
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}