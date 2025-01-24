import React from 'react'
import {  Route, Routes } from 'react-router-dom'
import Login from '../Component/Login'
import Dashboard from '../Component/Dashboard'

function MainRoute() {
  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      </>
  )
}

export default MainRoute
