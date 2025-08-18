import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Detail from '../pages/detail/Detail';
import Watch from '../pages/Watch';

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path='/:category/search/:keyword'
                element={<Catalog />}
            />
            <Route
                path='/watch'
                element={<Watch />}
            />
            <Route
                path='/:category/:id'
                element={<Detail />}
            />
            <Route
                path='/:category'
                element={<Catalog />}
            />
            <Route
                path='/'
                element={<Home />}
            />
        </Routes>
    );
}

export default AppRoutes;
