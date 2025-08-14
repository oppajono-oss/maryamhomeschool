import React from 'react'
import ReactDOM from 'react-dom/client'
import StudyTracker from './App.studytracker.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import { Provider } from 'react-redux'
import { store } from './store'
import '../index.css'

const root = document.getElementById('root');
if (!root) {
  document.write('<pre style="padding:16px;color:#d32f2f">Root element #root tidak ditemukan. Pastikan index.html memiliki <div id="root"></div>.</pre>');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <StudyTracker />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
