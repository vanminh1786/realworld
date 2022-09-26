import { useEffect, useRef, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
	const err1 = useRef()
	const err2 = useRef()
	const email = useRef()
	const username = useRef()
	const password = useRef()
	let updating = false

	const navigate = useNavigate()

	useEffect(() => {
		err1.current.style.display = 'none'
		err2.current.style.display = 'none'
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault()
		if (updating) return
		updating = true
		const data = {
			user: {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			},
		}
		axios({
			url: 'https://api.realworld.io/api/users',
			data,
			method: 'post',
		})
			.then((res) => {
				const dataUser = res.data.user
				localStorage.setItem('token', JSON.stringify(dataUser.token))
				navigate('/', { replace: true })
			})
			.catch((err) => {
				if (err.response.data.errors.email) err1.current.style.display = 'block'
				else err1.current.style.display = 'none'
				if (err.response.data.errors.username)
					err2.current.style.display = 'block'
				else err2.current.style.display = 'none'
			})
	}

	return (
		<div className="auth-page">
			<div className="container page">
				<div className="row">
					<div className="col-md-6 offset-md-3 col-xs-12">
						<h1 className="text-xs-center">Sign up</h1>
						<p className="text-xs-center">
							<Link to="/login">Have an account?</Link>
						</p>
						<ul className="error-messages" ref={err1}>
							<li>email has already been taken</li>
						</ul>
						<ul className="error-messages" ref={err2}>
							<li>username has already been taken</li>
						</ul>
						<form onSubmit={(e) => handleSubmit(e)}>
							<fieldset className="form-group">
								<input
									className="form-control form-control-lg"
									type="text"
									placeholder="Username"
									ref={username}
								/>
							</fieldset>
							<fieldset className="form-group">
								<input
									className="form-control form-control-lg"
									type="text"
									placeholder="Email"
									ref={email}
								/>
							</fieldset>
							<fieldset className="form-group">
								<input
									className="form-control form-control-lg"
									type="password"
									placeholder="Password"
									ref={password}
								/>
							</fieldset>
							<button className="btn btn-lg btn-primary pull-xs-right">
								Sign up
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(Login)
