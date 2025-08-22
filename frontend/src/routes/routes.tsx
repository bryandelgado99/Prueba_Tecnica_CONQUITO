// routes.tsx
import { Routes, Route } from 'react-router-dom';
import ListPersons from '../pages/ListPersons.page.tsx';
import PersonFormPage from '../pages/PersonForm.page.tsx';
import Dashboard from '../pages/Dashboard.page';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/persons" element={<ListPersons />} />
        <Route path="/persons/new" element={<PersonFormPage mode="create" />} />
        <Route path="/persons/:id/edit" element={<PersonFormPage mode="edit" />} />
    </Routes>
);