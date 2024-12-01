import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CafePage } from './pages/CafePage';
import { CafeForm } from './pages/CafeForm';
import { EmployeePage } from './pages/EmployeePage';
import { EmployeeForm } from './pages/EmployeeForm';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

const App = () => {
  return (
    <BrowserRouter>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6">Cafe Employee Manager</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          {/* Redirect root to cafes page */}
          <Route path="/" element={<Navigate to="/cafes" replace />} />
          <Route path="/cafes" element={<CafePage />} />
          <Route path="/cafes/new" element={<CafeForm />} />
          <Route path="/cafes/edit/:id" element={<CafeForm />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;