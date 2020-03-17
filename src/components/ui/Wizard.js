import React from 'react';

import { Progress } from 'components/ui/bulma';

export default function Wizard({ steps, currentStep, stepProps }) {
	return (
		<div>
			<nav className="breadcrumb is-hidden-mobile has-succeeds-separator" aria-label="breadcrumbs">
				<ul>
					{steps.map((step) => (
						<li
							key={step}
							className={
								stepProps[steps.indexOf(step)].id === stepProps[steps.indexOf(currentStep)].id ? (
									'is-active has-text-width-bold'
								) : (
									''
								)
							}
						>
							<a href="#">
								<span className="icon is-small">
									<i className={`fa fa-${stepProps[steps.indexOf(step)].icon}`} aria-hidden="true" />
								</span>
								<span>{`${stepProps[steps.indexOf(step)].name}`}</span>
							</a>
						</li>
					))}
				</ul>
			</nav>
			<Progress value={(steps.indexOf(currentStep) + 1) / steps.length * 100} color="primary" size="small" />
			<h1 className="title">{`${stepProps[steps.indexOf(currentStep)].title}`}</h1>
			<h2 className="subtitle is-size-6 is-hidden-mobile">{stepProps[steps.indexOf(currentStep)].subtitle}</h2>
		</div>
	);
}
