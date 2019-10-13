import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
// import { useModal } from 'react-modal-hook';
import { Link } from '@reach/router';

import { Button, Notification } from 'components/ui/bulma/elements';

import Error from 'components/ui/Error';
import Spinner from 'components/ui/Spinner';

import UserContext from 'context/UserContext';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;

export default function Dashboard() {
	const { headers } = useContext(UserContext);
	const { data, loading, error } = useQuery(ACCOUNT, { context: { headers }, pollInterval: 20000 });

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	const { account: { campaigns, posts, consumers } } = data;

	return (
		<div>
			<br />
			<div className="tile is-ancestor">
				<div className="tile is-vertical is-12">
					{!campaigns.length > 0 && (
						<div className="tile is-parent">
							<article className="tile is-child notification is-white">
								<nav className="level">
									<div className="level-left">
										<span>
											<p className="title">Create your first promo campaign</p>
											<p className="subtitle">We'll guide you through, step by step.</p>
										</span>
									</div>

									<div className="level-right">
										<Link to="/get-started">
											<Button size="medium" icon="magic">
												Get Started
											</Button>
										</Link>
									</div>
								</nav>
							</article>
						</div>
					)}
					<div className="tile">
						<div className="tile is-parent is-vertical">
							<article className="tile is-child notification is-primary">
								<p className="title">Posts 0</p>
								<p className="subtitle">Top tile</p>
							</article>
							<article className="tile is-child notification is-danger">
								<p className="title">Promoters 0</p>
								<p className="subtitle">Bottom tile</p>
							</article>
							<article className="tile is-child notification is-warning">
								<p className="title">Locations 0</p>
								<p className="subtitle">Promoted Locations</p>
							</article>
						</div>
						<div className="tile is-parent">
							{posts.length > 1 ? (
								<article className="tile is-child notification is-light">
									<p className="title">Featured Post</p>
									{/* <p className="subtitle">With an image</p> */}
									{/* <Cards type="posts" data={[ posts[0] ]} /> */}
									<Featured post={posts[0]} />
								</article>
							) : (
								<article className="tile is-child notification is-light">
									<p className="title">Example Post</p>
									<p className="subtitle">This is how you promo posts will look like</p>
									{/* <Cards type="posts" data={[ posts[0] ]} /> */}
									<Featured post={posts[0]} />
								</article>
							)}
						</div>
						<div className="tile is-parent">
							<article className="tile is-child notification is-light">
								<div className="content">
									<p className="title">Top Promoters</p>
									<p className="subtitle">Customers with the most posts</p>
									<div className="content">
										<TopPromoters consumers={consumers} />
									</div>
								</div>
							</article>
						</div>
					</div>
					{posts.length > 0 && (
						<div className="tile is-parent">
							<article className="tile is-child notification is-light">
								<p className="title">Waiting for Review</p>
								<p className="subtitle">Please review these posts</p>
								<PendingPosts />
							</article>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function PendingPosts() {
	const { headers } = useContext(UserContext);
	const { data, loading, error } = useQuery(POSTS, {
		variables: { limit: 10, status: 'pending' },
		context: { headers }
	});

	if (loading) return <Spinner />;
	if (error) return <Error error={error} />;

	if (!data.posts || data.posts.length < 1)
		return (
			<Notification color="light">
				<strong>{`All cought up! Please check back later.`}</strong>
			</Notification>
		);

	return (
		<div className="columns is-multiline is-mobile">
			{data.posts.map((item) => (
				<figure className="image is-100x100" key={item.id}>
					<img src={`${CLOUDINARY}/c_scale,w_100/posts/${item.uri}`} alt="Post" />
				</figure>
			))}
		</div>
	);
}

const Featured = ({ post }) => (
	<figure className="image is-square">
		{post && post.uri ? (
			<img src={`${CLOUDINARY}/c_scale,w_300/posts/${post.uri}`} alt="Post" />
		) : (
			<img alt="" src="https://bulma.io/images/placeholders/256x256.png" />
		)}
	</figure>
);

const TopPromoters = ({ consumers }) => (
	<table className="table is-hoverable">
		<tbody>
			{consumers.map((consumer) => {
				return (
					<tr key={consumer.id}>
						{/* <th>{i++}</th> */}
						<td>{consumer.displayName}</td>
						<td>{consumer.postCount}</td>
					</tr>
				);
			})}
		</tbody>
	</table>
);

const ACCOUNT = gql`
	query Account {
		account {
			id
			campaigns {
				id
			}
			posts {
				id
				date
				status
				uri
			}
			consumers {
				id
				displayName
				postCount
			}
		}
	}
`;

const POSTS = gql`
	query Posts($limit: Int, $status: PostStatus) {
		posts(limit: $limit, status: $status) {
			id
			date
			status
			uri
			location {
				id
			}
			ad {
				id
				creativeURI
			}
			campaign {
				id
				logoURI
			}
			consumer {
				id
				avatar
				displayName
			}
		}
	}
`;
