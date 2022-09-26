import { Link } from 'react-router-dom'
import changeStringToDate from '../functions_variables/ChangeStringToDate'

function Information(props) {
	const current = props.props.current
	let date = current.updatedAt
	date = changeStringToDate(date)

	return (
    <>
      <Link to={'/profile/' + current.author.username}>
        <img src={current.author.image} alt="" />
      </Link>
      <div className="info">
        <Link to={'/profile/' + current.author.username} className="author">
          {current.author.username}
        </Link>
        <span className="date">{date}</span>
      </div>
    </>
	)
}

export default Information
