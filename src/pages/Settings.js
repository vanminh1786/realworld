import axios from 'axios'
import { useEffect, useState } from 'react'
import urlGeneral from '../functions_variables/UrlGeneral'
import { useNavigate } from 'react-router-dom'

function Settings(props) {
	const token = JSON.parse(localStorage.getItem('token'))

	const navigate = useNavigate()
	const [url, setUrl] = useState('')
	const [username, setUsername] = useState('')
	const [bio, setBio] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	let updating = false

	useEffect(() => {
		setUrl(props.user.image)
		setUsername(props.user.username)
		setBio(props.user.bio)
		setEmail(props.user.email)
		setPassword(props.user.password)
	}, [])

	const updateInfor = (e) => {
		e.preventDefault()
		if (updating) return
		const data = {
			user: {
				image: url,
				username: username,
				email: email,
				bio: bio,
				password: password,
			},
		}
		updating = true
		axios({
			method: 'put',
			url: urlGeneral + '/api/user',
			headers: {
				Authorization: 'Token ' + token,
			},
			data,
		})
			.then((res) => {
				localStorage.setItem('token', JSON.stringify(res.data.user.token))
				navigate('/profile/' + username.current.value)
				window.location.reload()
			})
			.catch((err) => console.log(err))
	}

	const logout = () => {
		localStorage.removeItem('token')
		window.dispatchEvent(new Event('storage'))
		navigate('/', { replace: true })
	}

	return (
		<div className="settings-page">
			<div className="container page">
				<div className="row">
					<div className="col-md-6 offset-md-3 col-xs-12">
						<h1 className="text-xs-center">Your Settings</h1>

						<form onSubmit={updateInfor}>
							<fieldset>
								<fieldset className="form-group">
									<input
										className="form-control"
										type="text"
										placeholder="URL of profile picture"
										value={url || ''}
										onChange={(e) => setUrl(e.target.value)}
									/>
								</fieldset>
								<fieldset className="form-group">
									<input
										className="form-control form-control-lg"
										type="text"
										placeholder="Your Name"
										value={username || ''}
										onChange={(e) => setUsername(e.target.value)}
									/>
								</fieldset>
								<fieldset className="form-group">
									<textarea
										className="form-control form-control-lg"
										rows="8"
										placeholder="Short bio about you"
										value={bio || ''}
										onChange={(e) => setBio(e.target.value)}
									></textarea>
								</fieldset>
								<fieldset className="form-group">
									<input
										className="form-control form-control-lg"
										type="text"
										placeholder="Email"
										value={email || ''}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</fieldset>
								<fieldset className="form-group">
									<input
										className="form-control form-control-lg"
										type="password"
										placeholder="Password"
										value={password || ''}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</fieldset>
								<button className="btn btn-lg btn-primary pull-xs-right">
									Update Settings
								</button>
							</fieldset>
						</form>
						<hr />
						<button
							className="btn btn-outline-danger"
							ng-click="$ctrl.logout()"
							onClick={logout}
						>
							Or click here to logout.
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Settings
