import { createRoot } from 'react-dom/client'

import App from './modules'

const rootElement = document.getElementById('root') as HTMLElement
const root = createRoot(rootElement)

root.render(<App />)
