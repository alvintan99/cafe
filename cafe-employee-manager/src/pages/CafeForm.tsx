import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { TextInput } from '../components/TextInput'

export const CafeForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: ''
  })
  // const [file, setFile] = useState<File | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchCafe()
    }
  }, [id])

  // Handle unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  const fetchCafe = async () => {
    try {
      const response = await fetch(`/api/cafes/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cafe')
      }
      const data = await response.json()
      // Explicitly map the received data to form fields
      setForm({
        name: data.name || '',
        description: data.description || '',
        location: data.location || ''
      })
      setIsDirty(false) // Reset dirty state after loading data
    } catch (error) {
      console.error('Error fetching cafe:', error)
      navigate('/cafes') // Redirect back to list on error
    }
  }

  const handleNavigate = (path: string) => {
    if (!isDirty || window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      navigate(path)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))
      
      // if (file) formData.append('logo', file)

      const response = await fetch(`/api/cafe${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to save cafe')
      }

      navigate('/cafes')
    } catch (error) {
      console.error('Error saving cafe:', error)
      alert('Failed to save cafe. Please try again.')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            inputProps={{ minLength: 6, maxLength: 10 }}
            error={form.name.length > 0 && (form.name.length < 6 || form.name.length > 10)}
            helperText="Name must be between 6 and 10 characters"
            sx={{ mb: 2 }}
          />

          <Box mt={2}>
            <TextInput
              label="Description"
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              inputProps={{ maxLength: 256 }}
              multiline
              rows={3}
              error={form.description.length > 256}
              helperText="Maximum 256 characters"
            />
          </Box>

          {/* <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile && selectedFile.size <= 2 * 1024 * 1024) {
                  setFile(selectedFile)
                  setIsDirty(true)
                } else {
                  alert('File size must be less than 2MB')
                }
              }}
            />
          </Box> */}

          <Box mt={2}>
            <TextInput
              label="Location"
              value={form.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button onClick={() => handleNavigate('/cafes')}>Cancel</Button>
            <Button type="submit" variant="contained">
              {id ? 'Update' : 'Create'} Cafe
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default CafeForm