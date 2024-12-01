import { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { employeeService } from '../services/api'
import { Employee } from '../types'

export const EmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const cafeId = new URLSearchParams(location.search).get('cafe')

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll(cafeId || undefined)
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [cafeId])

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await employeeService.delete(deleteId)
        setDeleteId(null)
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  const ActionsRenderer = (props: ICellRendererParams) => (
    <Box>
      <Button onClick={() => navigate(`/employees/edit/${props.data.id}`)}>
        Edit
      </Button>
      <Button color="error" onClick={() => setDeleteId(props.data.id)}>
        Delete
      </Button>
    </Box>
  )

  const columns: ColDef[] = [
    { field: 'id', headerName: 'Employee ID', width: 130 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'emailAddress', headerName: 'Email Address', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 130 },
    { field: 'daysWorked', headerName: 'Days Worked', width: 130 },
    { field: 'cafeName', headerName: 'Cafe Name', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false
    }
  ]

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button onClick={() => navigate('/cafes')}>Back to Cafes</Button>
        <Button variant="contained" onClick={() => navigate('/employees/new')}>
          Add New Employee
        </Button>
      </Box>

      <div className="ag-theme-material" style={{ height: 600 }}>
        <AgGridReact
          rowData={employees}
          columnDefs={columns}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}