import { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { TextInput } from '../components/TextInput'
import { Cafe } from '../types'

export const CafePage = () => {
    const [cafes, setCafes] = useState<Cafe[]>([])
    const [location, setLocation] = useState('')
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const navigate = useNavigate()

    const fetchCafes = async () => {
        const response = await fetch(
            `/api/cafes${location ? `?location=${location}` : ''}`
        )
        const data = await response.json()
        setCafes(data)
    }

    useEffect(() => {
        fetchCafes()
    }, [location])

    const handleDelete = async () => {
        if (deleteId) {
            await fetch(`/api/cafe/${deleteId}`, { method: 'DELETE' })
            setDeleteId(null)
            fetchCafes()
        }
    }

    // const LogoRenderer = (props: ICellRendererParams) => {
    //     return props.value ? (
    //         <img src={props.value} alt="logo" style={{ height: 30 }} />
    //     ) : null
    // }

    const EmployeesRenderer = (props: ICellRendererParams) => (
        <Button onClick={() => navigate(`/employees?cafe=${props.data.id}`)}>
            {props.value}
        </Button>
    )

    const ActionsRenderer = (props: ICellRendererParams) => (
        <Box>
            <Button onClick={() => navigate(`/cafes/edit/${props.data.id}`)}>
                Edit
            </Button>
            <Button color="error" onClick={() => setDeleteId(props.data.id)}>
                Delete
            </Button>
        </Box>
    )

    const columns: ColDef[] = [
        // {
        //     field: 'logo',
        //     headerName: 'Logo',
        //     cellRenderer: LogoRenderer,
        //     sortable: false,
        //     filter: false,
        // },
        { 
            field: 'name', 
            headerName: 'Name',
            sortable: true,
            filter: true
        },
        { 
            field: 'description', 
            headerName: 'Description',
            sortable: true,
            filter: true
        },
        {
            field: 'employees',
            headerName: 'Employees',
            cellRenderer: EmployeesRenderer,
            sortable: true,
            filter: true
        },
        { 
            field: 'location', 
            headerName: 'Location',
            sortable: true,
            filter: true
        },
        {
            field: 'actions',
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            sortable: false,
            filter: false,
        },
    ]

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
                <TextInput
                    label="Filter by Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={() => navigate('/cafes/new')}
                >
                    Add New Cafe
                </Button>
            </Box>

            <div className="ag-theme-material" style={{ height: 600 }}>
                <AgGridReact
                    rowData={cafes}
                    columnDefs={columns}
                    pagination={true}
                    paginationAutoPageSize={true}
                />
            </div>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this cafe?
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