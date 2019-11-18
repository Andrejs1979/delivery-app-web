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

						component={Input}
						placeholder="Reward"
						help="You can start as low as $1 per post"
					/>
					<br />
					<FastField
						type="number"
						name="limit"
						label="Campaign limit"
						icon="hand-paper"

						component={Input}
						placeholder="Limit"
						help="Optional. If you want to stop campaign automatically"
					/>
				</Box>
			</Column>
			<Column>
				<Box>
					<article className="message is-small">
						<div className="message-body">
							<p className="title is-5">Cash reward per post</p>
							<p className="subtitle is-6">
								Amount you pay for each promo post made by your visitors on Instagram.
							</p>
							<small> </small>
							<p className="title is-5">Campaign limit</p>
							<p className="subtitle is-6">
								Total budget for this campaign. Once it's reached, the campaign automatically stops.
							</p>
							<p className="subtitle is-6">If you don't set it, the campaign will run continuously.</p>
						</div>
					</article>
				</Box>
			</Column>
		</Columns>
	);
}
