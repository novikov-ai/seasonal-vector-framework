import { useState, useEffect, useCallback } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Onboarding from './views/Onboarding'
import Today from './views/Today'
import Map from './views/Map'
import Calendar from './views/Calendar'
import Review from './views/Review'
import Settings from './views/Settings'
import { loadData, saveData, loadTheme, saveTheme, clearAll, isOnboarded } from './data/storage'
import { applyTheme } from './data/utils'
import { EXAMPLE_DATA } from './data/example'

export default function App() {
  const [onboarded, setOnboarded] = useState(() => isOnboarded())
  const [data,      setDataRaw]   = useState(() => loadData())
  const [view,      setView]      = useState('today')
  const [theme,     setThemeRaw]  = useState(() => loadTheme())

  // Apply theme on mount and change
  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  // Persist data whenever it changes
  const setData = useCallback(newData => {
    const resolved = typeof newData === 'function' ? newData(data) : newData
    const updated  = { ...resolved, lastUpdated: new Date().toISOString().split('T')[0] }
    setDataRaw(updated)
    saveData(updated)
  }, [data])

  function setTheme(t) {
    setThemeRaw(t)
  }

  function toggleTheme() {
    setThemeRaw(t => t === 'dark' ? 'light' : 'dark')
  }

  function handleOnboard(choice) {
    const init = choice === 'example'
      ? JSON.parse(JSON.stringify(EXAMPLE_DATA))
      : { domains: [], anchors: [], calNotes: [], checkedActions: [], lastUpdated: new Date().toISOString().split('T')[0] }
    setData(init)
    setOnboarded(true)
  }

  function handleReset() {
    clearAll()
    setDataRaw(null)
    setOnboarded(false)
    setView('today')
    setThemeRaw('system')
  }

  function toggleAction(id) {
    setData(d => ({
      ...d,
      checkedActions: d.checkedActions.includes(id)
        ? d.checkedActions.filter(x => x !== id)
        : [...d.checkedActions, id],
    }))
  }

  if (!onboarded) return <Onboarding onStart={handleOnboard} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav view={view} setView={setView} theme={theme} toggleTheme={toggleTheme} />

      <main className={`main ${view === 'review' ? 'narrow' : ''}`}>
        {view === 'today'    && <Today    data={data} onToggleAction={toggleAction} />}
        {view === 'map'      && <Map      data={data} setData={setData} />}
        {view === 'calendar' && <Calendar data={data} setData={setData} />}
        {view === 'review'   && <Review   data={data} setData={setData} />}
        {view === 'settings' && <Settings data={data} setData={setData} theme={theme} setTheme={setTheme} onReset={handleReset} />}

        <Footer />
      </main>
    </div>
  )
}
