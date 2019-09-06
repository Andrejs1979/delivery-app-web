import React, { useContext } from 'react';
import { useModal } from 'react-modal-hook';
import UserContext from 'context/UserContext';

const Modal = ({ onClose }) => (
	<div className="modal">
		<div className="modal-background" />
		<div className="modal-content">
			<div>sfsdf</div>
		</div>
		<button className="modal-close is-large" aria-label="close" />
	</div>
);
export default function Dashboard() {
	const { account } = useContext(UserContext);

	return (
		<div>
			<br />
			<nav className="level">
				<div className="level-item has-text-centered">
					<div>
						<p className="heading">Tweets</p>
						<p className="title">3,456</p>
					</div>
				</div>
				<div className="level-item has-text-centered">
					<div>
						<p className="heading">Following</p>
						<p className="title">123</p>
					</div>
				</div>
				<div className="level-item has-text-centered">
					<div>
						<p className="heading">Followers</p>
						<p className="title">456K</p>
					</div>
				</div>
				<div className="level-item has-text-centered">
					<div>
						<p className="heading">Likes</p>
						<p className="title">789</p>
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
