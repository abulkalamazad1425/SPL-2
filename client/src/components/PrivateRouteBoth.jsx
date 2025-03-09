import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser && ['manager', 'admin'].includes(currentUser.usertype) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
}
