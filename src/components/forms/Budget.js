import React from 'react';

import { FastField } from 'formik';

import { Box } from 'components/ui/bulma/elements';
import { Columns, Column } from 'components/ui/bulma/layout';
import { Input } from 'components/ui/bulma/form';

export default function Budget() {
	return (
		<Columns>
			<Column>
				<Box>
					<FastField
						type="number"
						name="rate"
						label="Reward per post"
						icon="dollar-sign"
						size="large"
						component={Input}
						placeholder="Reward per post"
						help="You can start as low as $1 per post"
					/>
					<br />
					<FastField
						type="number"
						name="limit"
						label="Spending limit (optional)"
						icon="hand-paper"
						size="large"
						component={Input}
						placeholder="Spending limit"
						help="Your campaign will automatically pause when this limit is reached"
					/>
				</Box>
			</Column>
			<Column>
				<Box>
					<article className="message">
						<div className="message-body">
							<p className="title is-5">Cash reward per post</p>
							<p className="subtitle is-5">
								Amount you pay for each promo post made by your visitors on Instagram.
							</p>
							<small> </small>
							<p className="title is-5">Campaign spending limit</p>
							<p className="subtitle is-5">
								Total budget for this promo campaign. Once it's reached, the campaign automatically
								stops.
							</p>
						</div>
					</article>
				</Box>
			</Column>
		</Columns>
	);
}
