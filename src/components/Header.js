import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header(props) {
	const token = JSON.parse(localStorage.getItem('token'))
	const isLoggedIn = token ? true : false

	const [hasChange, setHasChange] = useState(false)

	window.addEventListener('storage', () => {
		setHasChange(!hasChange)
	})

	return (
		<nav className="navbar navbar-light">
			<div className="container">
				<Link className="navbar-brand" to="/">
					conduit
				</Link>
				<ul className="nav navbar-nav pull-xs-right">
					<li className="nav-item">
						{/* <!-- Add "active" className when you're on that page" --> */}
						<Link className="nav-link" to="/">
							Home
						</Link>
					</li>
					{isLoggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/editor">
								<i className="ion-compose"></i>&nbsp;New Article
							</Link>
						</li>
					)}
					{isLoggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/settings">
								<i className="ion-gear-a"></i>&nbsp;Settings
							</Link>
						</li>
					)}
					{isLoggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to={'/profile/' + props.user.username}>
								{props.user.username}
							</Link>
						</li>
					)}
					{!isLoggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/login">
								Sign in
							</Link>
						</li>
					)}
					{!isLoggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/register">
								Sign up
							</Link>
						</li>
					)}
				</ul>
			</div>
		</nav>
	)
}

export default Header
