import React from 'react';
import { Box, Button, Notification } from 'components/ui/bulma';
import UserAvatar from 'react-user-avatar';
import { Link } from '@reach/router';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;
const LOGO_URI = 'https://res.cloudinary.com/hqsczucpx/image/upload/c_scale,h_100/logo/';
// const POST_URL = 'https://res.cloudinary.com/hqsczucpx/image/upload/c_scale,h_400/posts/';

export default function Cards({ type, data, actions }) {
	if (!data || data.length < 1)
		return (
			<Notification color="dark">
				<strong>{`No ${type} found. Please check back later!`}</strong>
			</Notification>
		);

	return (
		<div className="columns is-multiline is-mobile">
			{data.map((item) => <Item type={type} data={item} actions={actions} key={item.id} />)}
		</div>
	);
}

const Item = ({ type, data, actions }) => {
	switch (type) {
		case 'ads':
			return (
				<div className="column is-narrow">
					<Box>
						<div className="media">
							<div className="media-left">
								<figure className="image is-48x48">
									<img src={`${LOGO_URI}${data.creativeURI}`} alt="Post" />
								</figure>
							</div>
							<div className="media-content">
								<p className="title is-4">{data.status}</p>
								<p className="subtitle is-6">${data.rate}</p>
							</div>
						</div>
					</Box>
				</div>
			);

		case 'campaigns':
			return (
				<div className="column is-narrow">
					<Box>
						<div className="media">
							<div className="media-left">
								<figure className="image is-48x48">
									<img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder" />
								</figure>
							</div>
							<div className="media-content">
								<p className="title is-4">{data.name}</p>
								<p className="subtitle is-6">{data.status}</p>
							</div>
						</div>
					</Box>
				</div>
			);

		case 'locations':
			return (
				<div className="column is-narrow">
					<Box>
						<div className="media">
							<div className="media-left">
								<figure className="image is-48x48">
									{/* <img src={`${LOGO_URI}${data.assets.logoURI}`} alt="Post" /> */}
									<span className="icon is-large has-text-light">
										<span className="fa-stack fa-lg">
											<i className="fas fa-square fa-stack-2x" />
											<i className="fas fa-map-marker-alt fa-stack-1x fa-inverse" />
										</span>
									</span>
								</figure>
							</div>
							<div className="media-content">
								<p className="title is-4">{data.name}</p>
								<p className="subtitle is-6">{data.category}</p>
								<p className="subtitle is-6">
									{data.address}
									<br />
									{data.city},{data.state}
								</p>
							</div>
						</div>
					</Box>
				</div>
			);

		case 'consumers':
			return (
				<div className="column is-narrow">
					<div className="card">
						<div className="card-content">
							<div className="media">
								<div className="media-left">
									<figure className="image is-48x48">
										<img className="is-rounded" src={data.avatar} alt="Avatar" />
									</figure>
								</div>
								<div className="media-content">
									<p className="title is-4">{data.displayName}</p>
									<p className="subtitle is-6">{data.postCount} posts</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			);

		case 'posts':
			return (
				<div className="column is-narrow">
					<div className="card">
						<div className="card-image">
							<figure className="image is-150x150">
								<img src={`${CLOUDINARY}/c_scale,w_300/posts/${data.uri}`} alt="Post" />
							</figure>
						</div>
						<div className="card-content">
							{data.consumer && (
								<div className="media">
									<div className="media-left">
										<figure className="image is-48x48">
											<Link to={`/customers/${data.consumer.id}`}>
												<UserAvatar
													size="64"
													name={
														data.consumer.displayName ? data.consumer.displayName : 'user'
													}
													src={data.consumer.avatar}
													colors={[ '#ccc', '#aaa', '#ddd' ]}
												/>
											</Link>
										</figure>
									</div>
									<div className="media-content">
										<p className="title is-4">{data.consumer.displayName}</p>
										<p className="subtitle is-6">@{data.consumer.displayName}</p>
									</div>
								</div>
							)}
							{actions && (
								<div className="field is-grouped">
									<Button
										color="primary"
										icon="check-circle"
										action={() => actions[0]({ variables: { postID: data.id } })}
									>
										Approve
									</Button>
									<Button
										color="warning"
										icon="hashtag"
										action={() =>
											actions[1]({
												variables: {
													postID: data.id,
													statusText:
														'Post not found on Instagram. Please make sure your account is public and you add #cashmark tag to your post.'
												}
											})}
									>
										Not Found
									</Button>
									<Button
										color="danger"
										icon="smile"
										action={() =>
											actions[1]({
												variables: {
													postID: data.id,
													statusText: 'Please make sure your face is in the picture!'
												}
											})}
									>
										No Face
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			);

		default:
			break;
	}
};
