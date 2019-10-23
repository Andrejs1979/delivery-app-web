import React, { useState } from 'react';

import SquarePaymentForm, {
	CreditCardNumberInput,
	CreditCardExpirationDateInput,
	CreditCardPostalCodeInput,
	CreditCardCVVInput,
	CreditCardSubmitButton
} from 'react-square-payment-form';

import 'react-square-payment-form/lib/default.css';

const SANDBOX_APPLICATION_ID = 'sandbox-sq0idb-PzMkZ0XAcwXeoqFNRX3s2Q';

export default function Billing() {
	const [ errorMessages, setErrorMessages ] = useState([]);

	const cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
		setErrorMessages(errors);
		console.log('nonce created: ' + nonce + ', buyerVerificationToken: ' + buyerVerificationToken);
	};

	return (
		<div>
			<SquarePaymentForm
				sandbox={true}
				applicationId={SANDBOX_APPLICATION_ID}
				locationId="7K06ZFKQPVVS6"
				cardNonceResponseReceived={cardNonceResponseReceived}
				createVerificationDetails={createVerificationDetails}
				inputStyles={[
					{
						fontSize: '16px',
						fontFamily: 'Helvetica Neue',
						padding: '16px',
						color: '#373F4A',
						backgroundColor: 'transparent',
						lineHeight: '24px',
						placeholderColor: '#CCC',
						_webkitFontSmoothing: 'antialiased',
						_mozOsxFontSmoothing: 'grayscale'
					}
				]}
			>
				<fieldset className="sq-fieldset">
					<CreditCardNumberInput />
					<div className="sq-form-third">
						<CreditCardExpirationDateInput />
					</div>

					<div className="sq-form-third">
						<CreditCardPostalCodeInput />
					</div>

					<div className="sq-form-third">
						<CreditCardCVVInput />
					</div>
				</fieldset>

				<CreditCardSubmitButton>Pay $1.00</CreditCardSubmitButton>
			</SquarePaymentForm>

			<div className="sq-error-message">
				{errorMessages.length > 0 &&
					errorMessages.map((errorMessage) => <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>)}
			</div>
		</div>
	);
}

const createVerificationDetails = () => {
	return {
		amount: '100.00',
		currencyCode: 'USD',
		intent: 'CHARGE',
		billingContact: {
			familyName: 'Smith',
			givenName: 'John',
			email: 'jsmith@example.com',
			country: 'GB',
			city: 'London',
			addressLines: [ "1235 Emperor's Gate" ],
			postalCode: 'SW7 4JA',
			phone: '020 7946 0532'
		}
	};
};
