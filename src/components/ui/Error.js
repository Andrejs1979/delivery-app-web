import React from 'react';
import { Notification } from 'components/ui/bulma/elements';

export default function Error({ error }) {
	return (
		<Notification color="danger">
			<strong>Something went wrong. Please refresh your browser!</strong>
		</Notification>
	);
}
