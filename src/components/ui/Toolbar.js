import React from 'react';
import { navigate } from '@reach/router';

import { Button, ButtonGroup } from 'components/ui/bulma';
export default function Toolbar({ itemID, buttons, size, color }) {
	return (
		<ButtonGroup>
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

					case 'medium':
						return (
							<div key={icon}>
								{/* MOBILE */}
								<span className="has-text-centered is-hidden-desktop">
									<span
										className={`button is-large is-${color} ${!loading || 'is-loading'}`}
										onClick={onClick}
										aria-label="reply"
										disabled={disabled}
									>
										<span className="has-text-centered">
											<span className="icon">
												<i className={`fas fa-${icon}`} aria-hidden="true" />
											</span>
										</span>
									</span>
								</span>

								{/* DESKTOP */}
								<span className="has-text-centered is-hidden-mobile">
									<Button type={type} icon={icon} color={color} size="small" action={onClick}>
										<p className="is-size-7 has-text-weight-semibold">{text}</p>
									</Button>
								</span>
							</div>
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
