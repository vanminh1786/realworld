import { useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import urlGeneral from '../functions_variables/UrlGeneral'

function ButtonChangeFeed(props) {
	console.log('change feed')
	const token = JSON.parse(localStorage.getItem('token'))
	const isLoggedIn = token ? true : false
	const popularTag = props.url.split('=')[1]

	const yourFeed = useRef()
	const globalFeed = useRef()
	const tagFeed = useRef()

	useEffect(() => {
		tagFeed.current.style.display = 'none'
		if (isLoggedIn) {
			yourFeed.current.classList.add('active')
		} else {
			globalFeed.current.classList.add('active')
		}
	}, [])

	useEffect(() => {
		if (popularTag) {
			tagFeed.current.style.display = 'block'
			if (isLoggedIn) yourFeed.current.classList.remove('active')
			globalFeed.current.classList.remove('active')
		}
	}, [props.url])

	const handleClick = (e) => {
		tagFeed.current.style.display = 'none'
		if (e.target.innerText === 'Your Feed') {
			if (isLoggedIn) yourFeed.current.classList.add('active')
			globalFeed.current.classList.remove('active')
			props.changeFeed(urlGeneral + '/api/articles/feed')
		} else {
			globalFeed.current.classList.add('active')
			if (isLoggedIn) yourFeed.current.classList.remove('active')
			props.changeFeed(urlGeneral + '/api/articles')
		}
	}

	return (
		<div className="feed-toggle">
			<ul className="nav nav-pills outline-active">
				{isLoggedIn && (
					<li className="nav-item" onClick={(e) => handleClick(e)}>
						<Link className="nav-link" to="/" ref={yourFeed}>
							Your Feed
						</Link>
					</li>
				)}
				<li className="nav-item" onClick={(e) => handleClick(e)}>
					<Link className="nav-link" to="/" ref={globalFeed}>
						Global Feed
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link active" to="/" ref={tagFeed}>
						# {popularTag}
					</Link>
				</li>
			</ul>
		</div>
	)
}

export default memo(ButtonChangeFeed)
