import React, { useEffect } from 'react';
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

	// TODO Incorrect aspect ratio when changing picture

	useEffect(
		() => {
			const newSize = fitCreative(size, aspectRatio);
			setSize(newSize);
		},
		[ aspectRatio, height, heightLimit, setSize, size, width, widthLimit ]
	);

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
		{ icon: 'chevron-up', action: scale, args: 10 },
		{ icon: 'chevron-down', action: scale, args: -10 },
		{ icon: 'arrow-alt-circle-left', action: setPosition, args: 'bottomLeft' },
		{ icon: 'arrow-alt-circle-up', action: setPosition, args: 'topLeft' },
		{ icon: 'arrow-alt-circle-down', action: setPosition, args: 'bottomRight' },
		{ icon: 'arrow-alt-circle-right', action: setPosition, args: 'topRight' },
		{ icon: 'cut', action: toggleBackground }
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
