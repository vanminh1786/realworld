import Information from './Information'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import urlGeneral from '../functions_variables/UrlGeneral'

function InforInArticle(props) {
	const token = JSON.parse(localStorage.getItem('token'))
	const isLoggedIn = token ? true : false
	const article = props.article
	let updating = false

	const [favoritesCount, setFavoritesCount] = useState(props.favoritesCount)
	const [isLiked, setIsLiked] = useState(props.isLiked)
	const [isFollowed, setIsFollowed] = useState(props.isFollowed)

	const navigate = useNavigate()

	useEffect(() => {
		setIsFollowed(props.isFollowed)
		setIsLiked(props.isLiked)
		setFavoritesCount(props.favoritesCount)
	}, [props.isLiked, props.isFollowed, props.favoritesCount])

	const likeOrUnlike = () => {
		if (updating) return
		if (!isLoggedIn) {
			navigate('/login', { replace: true })
			return
		}
		updating = true
		axios({
			method: isLiked ? 'delete' : 'post',
			url: urlGeneral + `/api/articles/${article.slug}/favorite`,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then(() => {
				updating = false
				if (!isLiked) setFavoritesCount(favoritesCount + 1)
				else setFavoritesCount(favoritesCount - 1)
				setIsLiked(!isLiked)
				props.changing(1)
			})
			.catch((err) => console.log(err))
	}

	const followOrUnfollow = () => {
		if (updating) return
		if (!isLoggedIn) {
			navigate('/login', { replace: true })
			return
		}
		axios({
			method: isFollowed ? 'delete' : 'post',
			url: urlGeneral + `/api/profiles/${article.author.username}/follow`,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then(() => {
				updating = false
				if (!isFollowed) setFavoritesCount(favoritesCount + 1)
				else setFavoritesCount(favoritesCount - 1)
				setIsFollowed(!isFollowed)
				props.changing(2)
			})
			.catch((err) => console.log(err))
	}

	const deleteArticle = () => {
		axios({
			method: 'delete',
			url: urlGeneral + '/api/articles/' + article.slug,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then(() => {
				navigate('/', { replace: true })
			})
			.catch((err) => console.log(err))
	}

	return (
		<>
			<div className="article-meta">
				{article.author && (
					<Information
						props={{
							current: article,
							date: article.updatedAt,
						}}
					/>
				)}
				{article.author.username !== props.username && (
					<span className="ng-scope">
						<button
							className="btn btn-sm btn-outline-secondary"
							onClick={followOrUnfollow}
						>
							<i className="ion-plus-round"></i>
							&nbsp;{' '}
							{isFollowed
								? `Unfollow ${article.author.username}`
								: `Follow ${article.author.username}`}
						</button>
						&nbsp;
						<button
							className="btn btn-sm btn-outline-primary"
							onClick={likeOrUnlike}
						>
							<i className="ion-heart"></i>
							&nbsp; {isLiked ? 'Unfavorite' : 'Favorite'} Post{' '}
							<span className="counter">({favoritesCount})</span>
						</button>
					</span>
				)}
				{article.author.username === props.username && (
					<span className="ng-scope">
						<Link
							className="btn btn-outline-secondary btn-sm"
							ui-sref="app.editor({ slug: $ctrl.article.slug })"
							to={'/editor/' + article.slug}
						>
							<i className="ion-edit"></i> Edit Article
						</Link>
						&nbsp;
						<button
							className="btn btn-outline-danger btn-sm"
							ng-class="{disabled: $ctrl.isDeleting}"
							ng-click="$ctrl.deleteArticle()"
							onClick={deleteArticle}
						>
							<i className="ion-trash-a"></i> Delete Article
						</button>
					</span>
				)}
			</div>
		</>
	)
}

export default InforInArticle
