import TopHome from '../components/TopHome'
import MainContentHome from '../components/MainContentHome'

function Home() {
	return (
		<div className="home-page">
			<TopHome />
			<div className="container page">
				<div className="row">
					<MainContentHome />
				</div>
			</div>
		</div>
	)
}

export default Home
