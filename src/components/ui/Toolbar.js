import React from 'react';
import { navigate } from '@reach/router';

import { Button, ButtonGroup } from 'components/ui/bulma/elements';
export default function Toolbar({ itemID, buttons, size, color }) {
	return (
		<ButtonGroup attached>
			{buttons.map(({ type, action, args, icon, text, color, link, loading, disabled }) => {
				let onClick;
				if (!action && !link) {
					onClick = '';
				} else if (action && args) {
					onClick = link ? () => navigate(`/${link}/${args}`) : () => action(args);
				} else {
					onClick = link ? () => navigate(`/${link}/${itemID}`) : () => action(itemID);
				}

				switch (size) {
					case 'large':
						return (
							<a
								className={`level-item button is-medium is-${color} ${!loading || 'is-loading'}`}
								onClick={onClick}
								key={icon}
								aria-label="reply"
								disabled={disabled}
							>
								<span className="is-capitalized has-text-weight-semibold">{text}</span>
								<span className="icon">
									<i className={`fas fa-${icon}`} aria-hidden="true" />
								</span>
							</a>
						);

					default:
						return (
							<Button type={type} icon={icon} color={color} key={icon} size="small" action={onClick}>
								<p className="is-size-7 is-capitalized has-text-weight-semibold">{text}</p>
							</Button>
						);
				}
			})}
		</ButtonGroup>
	);
}
