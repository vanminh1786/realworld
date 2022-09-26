import { Link, useNavigate } from 'react-router-dom'
import formatSlug from '../functions_variables/FormatSlug'
import Information from './Information'
import { useEffect, useState } from 'react'
import axios from 'axios'
import urlGeneral from '../functions_variables/UrlGeneral'

function Feed(props) {
	const token = props.props.token
	const isLoggedIn = token ? true : false
	const current = props.props.current
	let slug = current.slug
	slug = formatSlug(slug)

	const [favoritesCount, setFavoritesCount] = useState(0)
	const [isLiked, setIsLiked] = useState(false)
	let isUpdating = false

	const navigate = useNavigate()

	useEffect(() => {
		setFavoritesCount(current.favoritesCount)
		setIsLiked(current.favorited)
	}, [current.favoritesCount, current.favorited])

	const likeOrUnlike = () => {
		if (!isLoggedIn) {
			navigate('/login', { replace: true })
			return
		}
		if (isUpdating === true) return
		isUpdating = true
		axios({
			method: isLiked ? 'delete' : 'post',
			url: urlGeneral + `/api/articles/${current.slug}/favorite`,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then(() => {
				if (!isLiked) setFavoritesCount(favoritesCount + 1)
				else setFavoritesCount(favoritesCount - 1)
				setIsLiked(!isLiked)
				isUpdating = false
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className="article-preview">
			<div className="article-meta">
				<Information
					props={{
						current,
					}}
				/>
				<button
					className={
						'btn btn-sm pull-xs-right btn-success ' +
						(isLiked ? '' : 'btn-outline-primary')
					}
					onClick={likeOrUnlike}
				>
					<i className="ion-heart"></i> {favoritesCount}
				</button>
			</div>
			<Link to={'/article/' + current.slug} className="preview-link">
				<h1>{slug}</h1>
				<p>{current.description}</p>
				<span>Read more...</span>
				<ul className="tag-list">
					{current.tagList.map((cur, idTag) => {
						return (
							<li
								key={idTag}
								className="tag-default tag-pill tag-outline ng-binding ng-scope"
								ng-repeat="tag in $ctrl.article.tagList"
							>
								{cur}
							</li>
						)
					})}
				</ul>
			</Link>
		</div>
	)
}

export default Feed
