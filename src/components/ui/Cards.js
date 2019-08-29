import React from 'react';
import { Box } from 'components/ui/bulma/elements';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;

const LOGO_URI = 'https://res.cloudinary.com/hqsczucpx/image/upload/c_scale,h_100/logo/';
// const POST_URL = 'https://res.cloudinary.com/hqsczucpx/image/upload/c_scale,h_400/posts/';

export default function Cards({ type, data }) {
	return (
		<div className="columns is-multiline is-mobile">
			{data.map((item) => <Item type={type} data={item} key={item.id} />)}
		</div>
	);
}

const Item = ({ type, data }) => {
	switch (type) {
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
									<img src={`${LOGO_URI}${data.assets.logoURI}`} alt="Post" />
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
										<img
											className="is-rounded"
											src="https://bulma.io/images/placeholders/96x96.png"
											alt="Placeholder"
										/>
									</figure>
								</div>
								<div className="media-content">
									<p className="title is-4">{data.displayName}</p>
									<p className="subtitle is-6">@{data.displayName}</p>
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
								<img src={`${CLOUDINARY}/posts/${data.uri}`} alt="Post" />
							</figure>
						</div>
						<div className="card-content">
							<div className="media">
								<div className="media-left">
									<figure className="image is-48x48">
										<img
											className="is-rounded"
											src="https://bulma.io/images/placeholders/96x96.png"
											alt="Placeholder"
										/>
									</figure>
								</div>
								<div className="media-content">
									<p className="title is-4">{data.consumer.displayName}</p>
									<p className="subtitle is-6">@{data.consumer.displayName}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			);

		default:
			break;
	}
};
