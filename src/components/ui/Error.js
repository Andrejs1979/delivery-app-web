import React from 'react';
import { Notification } from 'components/ui/bulma';

export default function Error({ error }) {
	return (
		<Notification color="danger">
			<strong>Something went wrong. Please refresh your browser!</strong>
		</Notification>
	);
}
