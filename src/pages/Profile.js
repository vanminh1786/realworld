import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import urlGeneral from '../functions_variables/UrlGeneral'
import Feed from '../components/Feed'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'

function Profile(props) {
	const token = JSON.parse(localStorage.getItem('token'))
	const pathname = window.location.pathname
	const name = pathname.split('/')[2]
	// console.log(name, props.user.username)

	const [profile, setProfile] = useState({})
	const [myArticles, setMyArticles] = useState([])
	const [urlArticles, setUrlArticles] = useState(
		urlGeneral + '/api/articles/?author=' + name
	)
	const [isFollowed, setIsFollowed] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const myArticlesBtn = useRef()
	const favoritedArticlesBtn = useRef()

	useEffect(() => {
		axios({
			method: 'get',
			url: urlGeneral + '/api/profiles/' + name,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then((res) => {
				setProfile(res.data.profile)
				setIsFollowed(res.data.profile.following)
			})
			.catch((err) => console.log(err))

		myArticlesBtn.current.classList.add('active')
	}, [])

	useEffect(() => {
		setIsLoading(true)
		axios({
			method: 'get',
			url: urlArticles,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then((res) => {
				setMyArticles(res.data.articles)
				setIsLoading(false)
			})
			.catch((err) => console.log(err))
	}, [urlArticles])

	const changeArticles = (e) => {
		if (e.target.className.includes('active')) return
		if (e.target.innerText === 'My Articles') {
			myArticlesBtn.current.classList.add('active')
			favoritedArticlesBtn.current.classList.remove('active')
			setUrlArticles(urlGeneral + '/api/articles?author=' + name)
		} else {
			myArticlesBtn.current.classList.remove('active')
			favoritedArticlesBtn.current.classList.add('active')
			setUrlArticles(urlGeneral + '/api/articles?favorited=' + name)
		}
	}

	let updating = false
	const followOrUnfollow = () => {
		if (updating) return
		updating = false
		let methodFollowed = 0
		if (isFollowed) methodFollowed = 'delete'
		else methodFollowed = 'post'
		axios({
			method: methodFollowed,
			url: urlGeneral + `/api/profiles/${name}/follow`,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then(() => {
				setIsFollowed(!isFollowed)
				updating = true
			})
			.catch((err) => console.log(err))
	}

	return (
		<div className="profile-page">
			<div className="user-info">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-md-10 offset-md-1">
							<img src={profile.image} className="user-img" alt="" />
							<h4>{name}</h4>
							<p></p>
							{name !== props.user.username && (
								<button
									className="btn btn-sm btn-outline-secondary action-btn"
									onClick={followOrUnfollow}
								>
									<i className="ion-plus-round"></i>
									&nbsp; {isFollowed ? `Unfollow ${name}` : `Follow ${name}`}
								</button>
							)}
							{name === props.user.username && (
								<Link
									ui-sref="app.settings"
									className="btn btn-sm btn-outline-secondary action-btn"
									ng-show="$ctrl.isUser"
									to="/settings"
								>
									<i className="ion-gear-a"></i> Edit Profile Settings
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-10 offset-md-1">
						<div className="articles-toggle">
							<ul className="nav nav-pills outline-active">
								<li className="nav-item">
									<Link
										className="nav-link"
										to={'/profile/' + name}
										ref={myArticlesBtn}
										onClick={changeArticles}
									>
										My Articles
									</Link>
								</li>
								<li className="nav-item">
									<Link
										className="nav-link"
										to={'/profile/' + name}
										ref={favoritedArticlesBtn}
										onClick={changeArticles}
									>
										Favorited Articles
									</Link>
								</li>
							</ul>
						</div>
						{!isLoading ? (
							<>
								{myArticles.length > 0 &&
									myArticles.map((current, id) => {
										return <Feed key={id} props={{ current, token }} />
									})}
								{myArticles.length === 0 && (
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
				</div>
			</div>
		</div>
	)
}

export default Profile
