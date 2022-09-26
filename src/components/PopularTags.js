import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, memo } from 'react'
import urlGeneral from '../functions_variables/UrlGeneral'
import ReactLoading from 'react-loading'

function PopularTags(props) {
	console.log('popular tags')
	const token = JSON.parse(localStorage.getItem('token'))
	const isLoggedIn = token ? true : false
	const [tags, setTags] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	let tag = ''

	useEffect(() => {
		setIsLoading(true)
		axios({
			method: 'get',
			url: urlGeneral + '/api/articles',
			headers: isLoggedIn
				? {
						Authorization: 'Token ' + token,
				  }
				: {},
		})
			.then((res) => {
				setIsLoading(false)
				const fetchedArticles = res.data.articles
				const tagList = new Set()
				fetchedArticles.forEach((cur) => {
					cur.tagList.forEach((curTag) => {
						if (tagList.size >= 10) return
						tagList.add(curTag)
					})
				})
				setTags([...tagList])
			})
			.catch((err) => console.log(err))
	}, [])

	const showPopularTagFeed = (e) => {
		tag = e.target.innerText
		props.changeFeed(urlGeneral + '/api/articles?tag=' + tag)
	}

	return (
		<div className="col-md-3">
			<div className="sidebar">
				<p>Popular Tags</p>

				{!isLoading ? (
					<div className="tag-list">
						{tags.map((current, id) => {
							return (
								<Link
									to="/"
									key={id}
									className="tag-pill tag-default"
									onClick={showPopularTagFeed}
								>
									{current}
								</Link>
							)
						})}
					</div>
				) : (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<ReactLoading
							type="spinningBubbles"
							color="black"
							width="40px"
							height="40px"
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default memo(PopularTags)
