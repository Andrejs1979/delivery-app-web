import React from 'react';
import { Box,Icon } from 'components/ui/bulma/elements';
export default function Modal({ children, icon, title, subtitle, narrow, onClose }) {
	return (
		<div className="columns is-centered">
			<div className={`column ${!narrow||'is-narrow'}`}>
				<Box>
					<span className="delete is-large is-pulled-right" aria-label="close" onClick={onClose} />
					
					<h1 className="title is-4">
						{/* <Icon name={icon} size="" container="large" color="dark" /> */}
						{title}</h1>
					{subtitle && <h2 className="subtitle">{subtitle}</h2>}
					<div className="tile is-ancestor">
						<div className="tile is-parent">
							<div className="tile is-child box">{children} </div>
						</div>
					</div>
				</Box>
			</div>
		</div>
	);
}
