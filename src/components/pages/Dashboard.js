import React, { useContext } from 'react';
import UserContext from 'context/UserContext';
export default function Dashboard() {
	const user = useContext(UserContext);

	return (
		<div>
			<br />
			<nav class="level">
				<div class="level-item has-text-centered">
					<div>
						<p class="heading">Tweets</p>
						<p class="title">3,456</p>
					</div>
				</div>
				<div class="level-item has-text-centered">
					<div>
						<p class="heading">Following</p>
						<p class="title">123</p>
					</div>
				</div>
				<div class="level-item has-text-centered">
					<div>
						<p class="heading">Followers</p>
						<p class="title">456K</p>
					</div>
				</div>
				<div class="level-item has-text-centered">
					<div>
						<p class="heading">Likes</p>
						<p class="title">789</p>
					</div>
				</div>
			</nav>
			<div className="tile is-ancestor">
				<div className="tile is-vertical is-8">
					<div className="tile">
						<div className="tile is-parent is-vertical">
							<article className="tile is-child notification is-primary">
								<p className="title">Latest Posts</p>
								<p className="subtitle">Top tile</p>
							</article>
							<article className="tile is-child notification is-warning">
								<p className="title">Info</p>
								<p className="subtitle">Bottom tile</p>
							</article>
						</div>
						<div className="tile is-parent">
							<article className="tile is-child notification is-info">
								<p className="title">Featured</p>
								<p className="subtitle">With an image</p>
								<figure className="image is-4by3">
									<img alt="" src="https://bulma.io/images/placeholders/640x480.png" />
								</figure>
							</article>
						</div>
					</div>
					<div className="tile is-parent">
						<article className="tile is-child notification is-danger">
							<p className="title">Approved Posts</p>
							<p className="subtitle">Aligned with the right tile</p>
							<div className="content">{/* <!-- Content --> */}</div>
						</article>
					</div>
				</div>
				<div className="tile is-parent">
					<article className="tile is-child notification is-success">
						<div className="content">
							<p className="title">Top Promoters</p>
							<p className="subtitle">With even more content</p>
							<div className="content">{/* <!-- Content --> */}</div>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}
