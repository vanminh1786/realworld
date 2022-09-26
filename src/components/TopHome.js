function TopHome() {
	const token = JSON.parse(localStorage.getItem('token'))

	return (
		<>
			{!token && (
				<div className="banner">
					<div className="container">
						<h1 className="logo-font">conduit</h1>
						<p>A place to share your knowledge.</p>
					</div>
				</div>
			)}
		</>
	)
}

export default TopHome
