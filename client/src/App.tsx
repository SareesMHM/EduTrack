import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>{AppRoutes}</Routes>
    </BrowserRouter>
  );
}
