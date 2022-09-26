import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import CreateAndEditArticle from './pages/CreateAndEditArticle'
import Article from './pages/Article'
import Settings from './pages/Settings'
import { createContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import axios from 'axios'
import { useState } from 'react'
import urlGeneral from './functions_variables/UrlGeneral'

const AppContext = createContext()

function App() {
	const token = JSON.parse(localStorage.getItem('token'))
	const [user, setUser] = useState({})

	useEffect(() => {
		if (token) {
			axios({
				method: 'get',
				url: urlGeneral + '/api/user',
				headers: {
					Authorization: 'Token ' + token,
				},
			})
				.then((res) => {
					setUser(res.data.user)
				})
				.catch((err) => console.log(err))
		}
	}, [])

	return (
		<BrowserRouter>
			<Header user={user} />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Signin />} />
				<Route path="/register" element={<Signup />} />
				<Route path="/settings" element={<Settings user={user} />} />
				<Route path="/profile/:username" element={<Profile user={user} />} />
				<Route path="/editor/:slug" element={<CreateAndEditArticle />} />
				<Route path="/editor" element={<CreateAndEditArticle />} />
				<Route path="/article/:slug" element={<Article user={user} />} />
				<Route path="/article" element={<Article user={user} />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	)
}

export { AppContext }
export default App
