import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import urlGeneral from '../functions_variables/UrlGeneral'
import formatSlug from '../functions_variables/FormatSlug'
import { Link } from 'react-router-dom'
import InforInArticle from '../components/InforInArticle'
import changeStringToDate from '../functions_variables/ChangeStringToDate'
import ReactLoading from 'react-loading'

function Article(props) {
	const pathname = window.location.pathname
	let slug = pathname.split('/')[2]

	const token = JSON.parse(localStorage.getItem('token'))
	const isLoggedIn = token ? true : false

	const [article, setArticle] = useState({})
	const [comments, setComments] = useState([])
	const [isLiked, setIsLiked] = useState(true)
	const [isFollowed, setIsFollowed] = useState(true)
	const [favoritesCount, setFavoritesCount] = useState(0)
	const [commentBody, setCommentBody] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		axios({
			method: 'get',
			url: urlGeneral + '/api/articles/' + slug,
			headers: isLoggedIn
				? {
						Authorization: 'Token ' + token,
				  }
				: {},
		})
			.then((res) => {
				setArticle(res.data.article)
				setIsLiked(res.data.article.favorited)
				setIsFollowed(res.data.article.author.following)
				setFavoritesCount(res.data.article.favoritesCount)
			})
			.catch((err) => console.log(err))

		axios({
			method: 'get',
			url: urlGeneral + '/api/articles/' + slug + '/comments',
			headers: isLoggedIn
				? {
						Authorization: 'Token ' + token,
				  }
				: {},
		})
			.then((res) => {
				setComments(res.data.comments)
			})
			.catch((err) => console.log(err))
	}, [])

	const changing = (id) => {
		if (id === 1) {
			if (isLiked) setFavoritesCount(favoritesCount - 1)
			else setFavoritesCount(favoritesCount + 1)
			setIsLiked(!isLiked)
		} else setIsFollowed(!isFollowed)
	}

	const addComment = (e) => {
		e.preventDefault()
		if (isLoading) return
		setIsLoading(true)
		const comment = commentBody
		const data = {
			comment: {
				body: comment,
			},
		}
		axios({
			method: 'post',
			url: urlGeneral + '/api/articles/' + article.slug + '/comments',
			data,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then((res) => {
				setComments([...comments, res.data.comment])
				setCommentBody('')
				setIsLoading(false)
			})
			.catch((err) => console.log(err))
	}

	const deleteComment = (idComment, index) => {
		if (isLoading) return
		setIsLoading(true)
		axios({
			method: 'delete',
			url:
				urlGeneral + '/api/articles/' + article.slug + '/comments/' + idComment,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then(() => {
				setComments((preState) => {
					const tmp = [...preState]
					tmp.splice(index, 1)
					return tmp
				})
				setIsLoading(false)
			})
			.catch((err) => console.log(err))
	}

	return (
		<div className="article-page">
			<div className="banner">
				<div className="container">
					<h1>{formatSlug(slug)}</h1>
					{article.author && (
						<InforInArticle
							article={article}
							changing={changing}
							isFollowed={isFollowed}
							isLiked={isLiked}
							favoritesCount={favoritesCount}
							username={props.user.username}
						/>
					)}
				</div>
			</div>

			<div className="container page">
				<div className="row article-content">
					<div className="col-md-12">
						<p>{article.body ? article.body : ''}</p>
						{article.tagList &&
							article.tagList.map((cur, id) => {
								return (
									<ul className="tag-list" key={id}>
										<li
											className="tag-default tag-pill tag-outline ng-binding ng-scope"
											ng-repeat="tag in ::$ctrl.article.tagList"
										>
											{cur}
										</li>
									</ul>
								)
							})}
					</div>
				</div>

				<hr />

				<div className="article-actions">
					{article.author && (
						<InforInArticle
							article={article}
							changing={changing}
							isFollowed={isFollowed}
							isLiked={isLiked}
							favoritesCount={favoritesCount}
							username={props.user.username}
						/>
					)}
				</div>

				{!isLoading ? (
					<div className="row">
						<div className="col-xs-12 col-md-8 offset-md-2">
							<form className="card comment-form" onSubmit={addComment}>
								<div className="card-block">
									<textarea
										className="form-control"
										placeholder="Write a comment..."
										rows="3"
										value={commentBody}
										onChange={(e) => setCommentBody(e.target.value)}
									></textarea>
								</div>
								<div className="card-footer">
									<img src={props.user.image} className="comment-author-img" />
									<button
										className="btn btn-sm btn-primary"
										onClick={addComment}
									>
										Post Comment
									</button>
								</div>
							</form>

							{comments &&
								comments.map((cur, id) => {
									return (
										<div className="card" key={id}>
											<div className="card-block">
												<p className="card-text">{cur.body}</p>
											</div>
											<div className="card-footer">
												<Link to="" className="comment-author">
													<img
														src={article.author?.image}
														className="comment-author-img"
													/>
												</Link>
												&nbsp;
												<Link
													to={'/profile/' + article.author?.username}
													className="comment-author"
												>
													{article.author?.username}
												</Link>
												<span className="date-posted">
													{changeStringToDate(cur.updatedAt)}
												</span>
												{article.author &&
													article.author.username === props.user.username && (
														<span
															className="mod-options"
															ng-show="$ctrl.canModify"
															onClick={() => deleteComment(cur.id, id)}
														>
															<i
																className="ion-trash-a"
																ng-click="$ctrl.deleteCb()"
															></i>
														</span>
													)}
											</div>
										</div>
									)
								})}
						</div>
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

export default Article
