import React from 'react';

import { Link } from '@reach/router';
import UserAvatar from 'react-user-avatar';
import numeral from 'numeral';

import Toolbar from 'components/ui/Toolbar';
import { Box } from 'components/ui/bulma';
import { Level, Left, Right, Item } from 'components/ui/bulma';

import formatDate from 'utils/formatDate';
import customerName from 'utils/customerName';

export default function Customer({ data, view, actions }) {
	switch (view) {
		case 'large':
			return <Large data={data} actions={actions} />;

		case 'grid':
			return <Grid data={data} actions={actions} />;

		case 'table':
			return <Table data={data} actions={actions} />;

		default:
			return null;
	}
}

const Large = ({
	data: customer,
	data: { id, avatar, email, displayName, transactions, avgTransaction, totalVolume },
	actions: [ setItem ]
}) => {
	const buttons = [ { link: 'customers', icon: 'search-plus' } ];
	return (
		<Box color="white">
			<article className={`message`}>
				<div className="message-body">
					<Level>
						<Left>
							<Item>
								<Link to={`/customers/${id}`}>
									<UserAvatar
										size="64"
										name={displayName ? displayName : 'user'}
										src={avatar}
										colors={[ '#ccc', '#aaa', '#ddd' ]}
									/>
								</Link>
							</Item>
							<Item>
								<Link to={`/customers/${id}`}>
									<p className="title is-4">{displayName ? displayName : email}</p>
									{/* <p className="subtitle is-6">{customer.email}</p> */}
								</Link>
							</Item>
						</Left>
						{/* <Right>
              <Item>
                <div className="has-text-centered">
                  <p className="heading">posts</p>
                  <p className="title">{transactions}</p>
                </div>
              </Item>
              <Item />
              <Item>
                <div className="has-text-centered">
                  <p className="heading">earnings</p>
                  <p className="title">
                    {totalVolume ? (
                      <span>
                        <small>$</small>
                        {numeral(totalVolume).format("0,0")}
                      </span>
                    ) : (
                      "0"
                    )}
                  </p>
                </div>
              </Item>
              <Item />
              <Item>
                <div className="has-text-centered">
                  <p className="heading">Locations</p>
                  <p className="title">
                    {avgTransaction ? (
                      <span>
                        <small>$</small>
                        {numeral(avgTransaction).format("0,0")}
                      </span>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              </Item>
            </Right> */}
					</Level>
				</div>
			</article>
			{/* <Toolbar itemID={id} buttons={buttons} color="primary" /> */}
		</Box>
	);
};

const Grid = ({ data, actions }) => {
	const [ setItem ] = actions;
	const buttons = [ { link: 'customers', icon: 'search-plus' } ];

	return (
		<div className="column is-narrow">
			<Box color="white-bis">
				<article className="media">
					<div className="media-left">
						<figure className="image is-64x64">
							<UserAvatar
								size="64"
								name={data.displayName ? data.displayName : 'user'}
								src={data.avatar}
								colors={[ '#ccc', '#aaa', '#ddd' ]}
							/>
						</figure>
					</div>
					<div className="media-content">
						<div className="content">
							<p className="title is-5">{data.displayName ? data.displayName : data.email}</p>
							<p className="subtitle is-6">{data.email}</p>
						</div>
						<Toolbar itemID={data.id} buttons={buttons} color="primary" size="small" />
					</div>
				</article>
			</Box>
		</div>
	);
};

const Table = ({ data, actions: [ setItem ] }) => {
	const buttons = [ { link: 'customers', icon: 'search-plus' } ];
	return (
		<tr>
			<td>
				<UserAvatar
					size="48"
					name={data.displayName ? data.displayName : 'user'}
					src={data.avatar}
					colors={[ '#ccc', '#aaa', '#ddd' ]}
				/>
			</td>
			<td>
				<p className="title is-5">{data.displayName ? data.displayName : data.email}</p>
				<p className="subtitle is-6">{data.email}</p>
			</td>

			<td>{data.phone}</td>
			<td>{data.transactions}</td>
			<td>${Number(data.totalVolume).toFixed()}</td>
			<td>${Number(data.avgTransaction).toFixed()}</td>
			<td>{formatDate(data.latestTransaction, 'date')}</td>
			<td>
				<Toolbar itemID={data.id} buttons={buttons} color="primary" />
			</td>
		</tr>
	);
};
