import { useEffect, useRef, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
	const err = useRef()
	const email = useRef()
	const password = useRef()
	let updating = false

	const navigate = useNavigate()

	useEffect(() => {
		err.current.style.display = 'none'
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault()
		if (updating) return
		updating = true
		const data = {
			user: {
				email: email.current.value,
				password: password.current.value,
			},
		}
		axios({
			url: 'https://api.realworld.io/api/users/login',
			data,
			method: 'post',
		})
			.then((res) => {
				const dataUser = res.data.user
				localStorage.setItem('token', JSON.stringify(dataUser.token))
				window.dispatchEvent(new Event('storage'))
				navigate('/', { replace: true })
			})
			.catch(() => {
				err.current.style.display = 'block'
			})
	}

	return (
		<div className="auth-page">
			<div className="container page">
				<div className="row">
					<div className="col-md-6 offset-md-3 col-xs-12">
						<h1 className="text-xs-center">Sign in</h1>
						<p className="text-xs-center">
							<Link to="/register">Need an account?</Link>
						</p>
						<ul className="error-messages" ref={err}>
							<li>Email or password is invalid</li>
						</ul>
						<form onSubmit={(e) => handleSubmit(e)}>
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
								Sign in
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(Login)
