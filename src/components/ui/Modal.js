import React from 'react';
import { Box } from 'components/ui/bulma';
export default function Modal({ children, icon, title, subtitle, narrow, onClose }) {
	return (
		<div className="modal is-active">
			<div className="modal-background" />
			<div className="modal-content">
				<div className="columns is-centered">
					<div className={`column ${!narrow || 'is-narrow'}`}>
						<Box>
							<span className="delete is-large is-pulled-right" aria-label="close" onClick={onClose} />

							{/* <h1 className="title is-4">
								<Icon name={icon} size="" container="large" color="dark" />
								{title}
							</h1> */}
							{subtitle && <h2 className="subtitle">{subtitle}</h2>}
							<div className="tile is-ancestor">
								<div className="tile is-parent">
									<div className="tile is-child">{children} </div>
								</div>
							</div>
						</Box>
					</div>
				</div>
			</div>
		</div>
	);
}
