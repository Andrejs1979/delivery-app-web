import React, { useEffect, useState } from 'react';
import Overlay from 'react-image-overlay';
import Toolbar from 'components/ui/Toolbar';
import example from 'assets/images/example.jpeg';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;

const [ FRAME_W, FRAME_H ] = [ 400, 400 ];
const AD_RATIO = 1.5;
const MIN_SIZE = 50;
const INIT_SIZE_RATIO = 2;

const getCreativeLimits = (size, aspectRatio) => {
	const [ width, height ] = size;

	if (width > height) {
		const widthLimit = Math.round(FRAME_W / AD_RATIO);
		const heightLimit = Math.round(widthLimit / aspectRatio);
		return [ widthLimit, heightLimit ];
	} else {
		const heightLimit = Math.round(FRAME_H / AD_RATIO);
		const widthLimit = Math.round(heightLimit * aspectRatio);
		return [ widthLimit, heightLimit ];
	}
};

const fitCreative = (size, aspectRatio) => {
	let newWidth, newHeight;
	const [ width, height ] = size;
	const [ widthLimit, heightLimit ] = getCreativeLimits(size, aspectRatio);

	if (width > widthLimit) {
		newWidth = Math.round(widthLimit / INIT_SIZE_RATIO);
		newHeight = Math.round(newWidth / aspectRatio);
		return [ widthLimit, heightLimit ];
	} else if (height > heightLimit) {
		newHeight = Math.round(heightLimit / INIT_SIZE_RATIO);
		newWidth = Math.round(newHeight / aspectRatio);
		return [ widthLimit, heightLimit ];
	} else if (width < MIN_SIZE) {
		newWidth = Math.round(MIN_SIZE * INIT_SIZE_RATIO);
		newHeight = Math.round(newWidth / aspectRatio);
		return [ widthLimit, heightLimit ];
	} else if (height < MIN_SIZE) {
		newHeight = Math.round(MIN_SIZE * INIT_SIZE_RATIO);
		newWidth = Math.round(newHeight / aspectRatio);
		return [ widthLimit, heightLimit ];
	} else {
		return size;
	}
};

export default function AdEditor({
	creative: { uri, size, aspectRatio, position, background },
	actions: { setUri, setSecureURL, setSize, setPosition, setBackground }
}) {
	const [ width, height ] = size;
	const [ widthLimit, heightLimit ] = getCreativeLimits(size, aspectRatio);

	const [ horizontal, setHorizontal ] = useState('Left');
	const [ vertical, setVertical ] = useState('bottom');

	// TODO Incorrect aspect ratio when changing picture

	useEffect(
		() => {
			setSize(fitCreative(size, aspectRatio));
		},
		[ aspectRatio, height, heightLimit, setSize, size, width, widthLimit ]
	);

	useEffect(() => {
		setPosition(`${vertical}${horizontal}`);
	});

	const scale = (increment) => {
		const newWidth = width + increment;
		const newHeight = Math.round(newWidth / aspectRatio);

		if (increment > 0) {
			if (newWidth < widthLimit && newHeight < heightLimit) setSize([ newWidth, newHeight ]);
		}

		if (increment < 0) {
			if (newWidth > MIN_SIZE && newHeight > MIN_SIZE) setSize([ newWidth, newHeight ]);
		}
	};

	const toggleBackground = () => {
		setBackground(!background);
	};

	const buttons = [
		{
			icon: 'arrow-alt-circle-up',
			text: 'move up',
			action: setVertical,
			args: 'top',
			color: 'white',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-down',
			text: 'move down',
			action: setVertical,
			args: 'bottom',
			color: 'white',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-left',
			text: 'move left',
			action: setHorizontal,
			args: 'Left',
			color: 'white',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-right',
			text: 'move right',
			action: setHorizontal,
			args: 'Right',
			color: 'white',
			type: 'button'
		},
		{ icon: 'search-plus', text: 'larger', action: scale, args: 10, color: 'white', type: 'button' },
		{ icon: 'search-minus', text: 'smaller', action: scale, args: -10, color: 'white', type: 'button' },
		{ icon: 'tint-slash', text: 'remove background', action: toggleBackground, color: 'white', type: 'button' }
	];

	return (
		<div>
			<Overlay
				url={example}
				overlayUrl={`${CLOUDINARY}/c_scale,${!background
					? 'e_bgremoval,'
					: ''}h_${height},w_${width}/creative/${uri}`}
				imageHeight={FRAME_H}
				imageWidth={FRAME_W}
				position={position}
				overlayWidth={width}
				overlayHeight={height}
				overlayPadding={10}
				watermark={false}
			/>
			<Toolbar buttons={buttons} color="primary" />
		</div>
	);
}
