import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BlogTablePage } from './pages/BlogTablePage/BlogTablePage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { Home } from './pages/HomePage/Home';
import { legacy_createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './ducks/root/reducers';
import thunk from 'redux-thunk';
import { ThemeProvider } from './components/ThemeProvider';
import { UserAccountPage } from './pages/UserPage/UserAccountPage';

import './style/App.css';
import { Header } from './components/Header';

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="layout-container">
            <Router>
              <Header />
              <div className="page-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blogs" element={<BlogTablePage />} />
                  <Route path="/blogs/old" element={<BlogTablePage />} />
                  <Route path="/myaccount" element={<UserAccountPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </Router>
        </div>
      </ThemeProvider>
    </Provider>
  );
} 

export default App;
