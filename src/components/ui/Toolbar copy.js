import React from 'react';
import { navigate } from '@reach/router';

export default function Toolbar({ itemID, buttons, size, color }) {
	return (
		<nav className="level is-mobile">
			<div className="level-left">
				{buttons.map(({ action, args, icon, text, color, link, loading, disabled }) => {
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
								<a
									className={`level-item button is-${size} is-white has-text-centered`}
									onClick={onClick}
									key={icon}
									aria-label="reply"
									disabled={disabled}
								>
									<span className="icon">
										<i className={`fas fa-${icon} has-text-${color}`} aria-hidden="true" />
									</span>
									<p className="is-size-7 is-capitalized has-text-weight-semibold">{text}</p>
								</a>
							);
					}
				})}
			</div>
		</nav>
	);
}
