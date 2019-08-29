import React, { PureComponent } from 'react';

import { Switch, Route } from 'react-router-dom';
import { Container, Col, Row } from 'reactstrap';

import { hotjar } from 'react-hotjar';
// import Drift from 'react-driftjs';

import Navpanel from './ui/screen/Navpanel';

import Dashboard from './pages/Dashboard';
import Payments from './pages/payments/Payments';
import Invoices from './pages/invoices/Invoices';
import Subscriptions from './pages/subscriptions/Subscriptions';
import Customers from './pages/customers/Customers';
import Integration from './pages/Integration';
import Developers from './pages/Developers';
import Settings from './pages/Settings';
import Partner from './pages/Partner';

import UserContext from 'context/UserContext';
export default class App extends PureComponent {
	static contextType = UserContext;

	state = { auth: null };

	renderTags() {
		hotjar.initialize(947531, 6);
	}

	renderApp = () => (
		<Container fluid>
			<Row>
				<Navpanel />
				<Col md={11} lg={11} xl={11} sm={10} xs={10}>
					<Switch>
						<Route exact path="/welcome" component={Dashboard} />
						<Route exact path="/payments" component={Payments} />
						<Route exact path="/payments/:id" component={Payments} />
						<Route exact path="/invoices" component={Invoices} />
						<Route exact path="/invoices/:id" component={Invoices} />
						<Route exact path="/subscriptions" component={Subscriptions} />
						<Route exact path="/subscriptions/:id" component={Subscriptions} />
						<Route exact path="/customers" component={Customers} />
						<Route exact path="/customers/:id" component={Customers} />
						<Route exact path="/integration" component={Integration} />
						<Route exact path="/developers" component={Developers} />
						<Route exact path="/settings" component={Settings} />
						<Route exact path="/partner" component={Partner} />
						<Route component={Dashboard} />
					</Switch>
				</Col>
			</Row>
			{/* <Drift appId="1034943" userId="1234" attributes={{ email: 'user@example.com', company: 'Acme Inc' }} /> */}
			{process.env.NODE_ENV === 'production' && this.renderTags()}
		</Container>
	);

	render() {
		return this.renderApp();
	}
}
