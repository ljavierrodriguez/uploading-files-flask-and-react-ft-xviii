import logo from './logo.svg';
import './App.css';
import RegisterForm from './components/RegisterForm';
import AddArticleForm from './components/AddArticleForm';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <div className="container">
      <LoginForm />
      <RegisterForm />
      <AddArticleForm />
    </div>
  );
}

export default App;
