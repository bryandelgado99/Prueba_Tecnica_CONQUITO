import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/layout.component.tsx';
import { AppRoutes } from './routes/routes.tsx';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <AppRoutes />
            </Layout>
        </BrowserRouter>
    );
}

export default App;