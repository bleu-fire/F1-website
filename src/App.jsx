import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import RaceDetail from './pages/RaceDetail'
import MyGarage from './pages/MyGarage'
import MySeason from './pages/MySeason'

function Layout() {
  const location = useLocation()
  const wrapperRef = useRef(null)
  const isFirstMount = useRef(true)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion || !wrapperRef.current) return

    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    // Page transition: fade + slide up
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    )
  }, [location.pathname, prefersReducedMotion])

  return (
    <>
      <Navbar />
      <div ref={wrapperRef} className="page-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'calendrier', element: <Calendar /> },
      { path: 'calendrier/:raceId', element: <RaceDetail /> },
      { path: 'mongarage', element: <MyGarage /> },
      { path: 'masaison', element: <MySeason /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
