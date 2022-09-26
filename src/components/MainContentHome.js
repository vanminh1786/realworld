import axios from 'axios'
import ButtonChangeFeed from './ButtonChangeFeed'
import Feed from './Feed'
import PopularTags from './PopularTags'
import urlGeneral from '../functions_variables/UrlGeneral'
import { useState, useEffect, useCallback } from 'react'
import ReactLoading from 'react-loading'

function MainContentHome() {
	const token = JSON.parse(localStorage.getItem('token'))
	const isLoggedIn = token ? true : false

	const [url, setUrl] = useState(
		isLoggedIn
			? urlGeneral + '/api/articles/feed'
			: urlGeneral + '/api/articles'
	)
	const [articles, setArticles] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		axios({
			method: 'get',
			url,
			headers: isLoggedIn
				? {
						Authorization: 'Token ' + token,
				  }
				: {},
		})
			.then((res) => {
				setIsLoading(false)
				setArticles(res.data.articles)
			})
			.catch((err) => console.log(err))
	}, [url])

	const changeFeed = useCallback((newUrl) => {
		if (newUrl !== url) setUrl(newUrl)
	}, [])

	return (
		<>
			<div className="col-md-9">
				<ButtonChangeFeed changeFeed={changeFeed} url={url} />
				{!isLoading ? (
					<>
						{articles.length > 0 &&
							articles.map((current, id) => {
								return <Feed key={id} props={{ current, token }} />
							})}
						{articles.length === 0 && (
							<div
								className="article-preview"
								ng-show="!$ctrl.loading &amp;&amp; !$ctrl.list.length"
							>
								No articles are here... yet.
							</div>
						)}
					</>
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
			<PopularTags changeFeed={changeFeed} />
		</>
	)
}

export default MainContentHome
