import { useEffect, useState } from 'react'
import axios from 'axios'
import url from '../functions_variables/UrlGeneral'
import { useNavigate } from 'react-router-dom'

function CreateAndEditArticle() {
	const token = JSON.parse(localStorage.getItem('token'))
	const pathname = window.location.pathname
	const slug = pathname.split('/')[2]

	const updatingArticle = slug ? true : false
	const [tagList, setTagList] = useState([])
	const [article, setArticle] = useState({})

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [body, setBody] = useState('')
	const [tag, setTag] = useState('')

	const navigate = useNavigate()

	useEffect(() => {
		if (updatingArticle) {
			axios({
				method: 'get',
				url: url + '/api/articles/' + slug,
			})
				.then((res) => {
					// console.log(res.data);
					const dataArticle = res.data.article
					setArticle(dataArticle)
					setTagList(dataArticle.tagList)
					setTitle(dataArticle.title)
					setDescription(dataArticle.description)
					setBody(dataArticle.body)
				})
				.catch((err) => console.log(err))
		}
	}, [])

	const handleSubmit = () => {
		const data = {
			article: {
				title: title,
				description: description,
				body: body,
				tagList,
			},
		}

		let method = 0
		if (!updatingArticle) method = 'post'
		else method = 'put'

		axios({
			method,
			url: url + '/api/articles/' + (method === 'put' ? article.slug : ''),
			data: data,
			headers: {
				Authorization: 'Token ' + token,
			},
		})
			.then((res) => {
				// console.log(res.data)
				navigate('/article/' + res.data.article.slug, { replace: true })
			})
			.catch((err) => console.log(err))
	}

	const addTag = (e) => {
		if (e.key !== 'Enter') return

		let addedTag = tag
		setTagList((preState) => [...preState, addedTag])
		setTag('')
	}

	const deleteTag = (id) => {
		setTagList((preState) => {
			const tmp = [...preState]
			tmp.splice(id, 1)
			return tmp
		})
	}

	const checkSilver = (value) => {
		if (value === 'silver') setBody('i am silver')
	}

	return (
		<div className="editor-page">
			<div className="container page">
				<div className="row">
					<div className="col-md-10 offset-md-1 col-xs-12">
						<form onSubmit={handleSubmit}>
							<fieldset>
								<fieldset className="form-group">
									<input
										type="text"
										className="form-control form-control-lg"
										placeholder="Article Title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
								</fieldset>
								<fieldset className="form-group">
									<input
										type="text"
										className="form-control"
										placeholder="What's this article about?"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</fieldset>
								<fieldset className="form-group">
									<textarea
										className="form-control"
										rows="8"
										placeholder="Write your article (in markdown)"
										value={body}
										onChange={(e) => setBody(e.target.value)}
									></textarea>
								</fieldset>
								<fieldset className="form-group">
									<input
										type="text"
										className="form-control"
										placeholder="Enter tags"
										value={tag}
										onChange={(e) => {
											setTag(e.target.value)
											checkSilver(e.target.value)
										}}
										onKeyDown={addTag}
									/>
									<div className="tag-list">
										{tagList.map((cur, id) => {
											return (
												<span
													key={id}
													ng-repeat="tag in $ctrl.article.tagList"
													className="tag-default tag-pill ng-binding ng-scope"
												>
													<i
														className="ion-close-round"
														ng-click="$ctrl.removeTag(tag)"
														onClick={() => deleteTag(id)}
													></i>
													{cur}
												</span>
											)
										})}
									</div>
								</fieldset>
								<button
									className="btn btn-lg pull-xs-right btn-primary"
									type="button"
									onClick={handleSubmit}
								>
									Publish Article
								</button>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateAndEditArticle
