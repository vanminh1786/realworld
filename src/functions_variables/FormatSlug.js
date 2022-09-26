const formatSlug = (slug) => {
	let tmpStr = slug
	tmpStr = tmpStr.split('-')
	tmpStr.pop()
	tmpStr = tmpStr.join(' ')
	return tmpStr
}

export default formatSlug
