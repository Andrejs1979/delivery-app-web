import React, { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';

import { Image, Transformation } from 'cloudinary-react';
import Overlay from 'react-image-overlay';

import Toolbar from 'components/ui/Toolbar';
import { Level, Left, Right, Item } from 'components/ui/bulma';
import { Progress, Box } from 'components/ui/bulma';

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY_URI;
const CLOUDINARY_UPLOAD = process.env.REACT_APP_CLOUDINARY_UPLOAD_URI;

const [ FRAME_W, FRAME_H ] = [ 550, 550 ];
const [ MOBILE_FRAME_W, MOBILE_FRAME_H ] = [ 300, 300 ];
const AD_RATIO = 0.35;
const MIN_SIZE = 100;
const INIT_SIZE_RATIO = 0.75;
const MOBILE_RATIO = Math.round(FRAME_W / MOBILE_FRAME_W);

const example = 'https://res.cloudinary.com/hqsczucpx/image/upload/assets/example.jpg';

export default function AdEditor({
	field,
	form: { touched, errors },
	creative: { uri, size, aspectRatio, position, background },
	actions: { setUri, setSecureURL, setSize, setAspectRatio, setPosition, setBackground, setOriginalFileName }
}) {
	const [ width, height ] = size;
	const [ widthLimit, heightLimit ] = getCreativeLimits(size, aspectRatio);

	const [ horizontal, setHorizontal ] = useState('Left');
	const [ vertical, setVertical ] = useState('bottom');
	const [ uploadProgress, setUploadProgress ] = useState(0);

	// useEffect(
	// 	() => {
	// 		const newSize = fitCreative(size, aspectRatio);
	// 		setSize(newSize);
	// 	},
	// 	[ uri, aspectRatio, height, heightLimit, setSize, size, width, widthLimit ]
	// );

	useEffect(() => {
		setPosition(`${vertical}${horizontal}`);
	});

	const onDrop = useCallback(
		(acceptedFiles) => {
			setOriginalFileName(acceptedFiles[0].name);
			const fd = new FormData();
			fd.append('upload_preset', 'creative');
			fd.append('tags', [ 'browser_upload', 'creative' ]);
			fd.append('file', acceptedFiles[0]);

			const config = {
				headers: { 'X-Requested-With': 'XMLHttpRequest' },
				onUploadProgress: (progressEvent) => {
					const progress = Math.round(progressEvent.loaded * 100.0 / progressEvent.total);
					setUploadProgress(progress);
				}
			};
			axios
				.post(CLOUDINARY_UPLOAD, fd, config)
				.then(({ data: { url, secure_url, public_id, height, width, format } }) => {
					const uri = public_id.split('/');

					setSize([ width, height ]);
					setAspectRatio(width / height);
					setUri(uri[1]);
					setSecureURL(secure_url);
					setOriginalFileName(acceptedFiles[0].name);
				})
				.catch((err) => console.error('err', err));
		},
		[ setAspectRatio, setOriginalFileName, setSecureURL, setSize, setUri ]
	);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
			text: 'up',
			action: setVertical,
			args: 'top',
			color: 'light',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-down',
			text: 'down',
			action: setVertical,
			args: 'bottom',
			color: 'light',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-left',
			text: 'left',
			action: setHorizontal,
			args: 'Left',
			color: 'light',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-right',
			text: 'right',
			action: setHorizontal,
			args: 'Right',
			color: 'light',
			type: 'button'
		},
		{ icon: 'search-plus', text: 'larger', action: scale, args: 10, color: 'light', type: 'button' },
		{ icon: 'search-minus', text: 'smaller', action: scale, args: -10, color: 'light', type: 'button' },
		{ icon: 'tint-slash', text: 'background', action: toggleBackground, color: 'light', type: 'button' }
	];

	const help = 'Click on the picture to upload your logo';

	return (
		<div>
			<div
				className={`file is-white is-boxed is-${touched[field.name] && errors[field.name] && 'danger'}`}
				{...getRootProps()}
			>
				<input type="file" name="creative" {...getInputProps()} />
				{/* <div className="is-hidden-mobile">
					<Box>
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
					</Box>
				</div>
				<div className="is-hidden-desktop">
					<Overlay
						url={example}
						overlayUrl={`${CLOUDINARY}/c_scale,${!background
							? 'e_bgremoval,'
							: ''}h_${height},w_${width}/creative/${uri}`}
						imageHeight={MOBILE_FRAME_H}
						imageWidth={MOBILE_FRAME_W}
						position={position}
						overlayWidth={width / 2}
						overlayHeight={height / 2}
						overlayPadding={10}
						watermark={false}
					/>
				</div> */}

				<Image publicId="assets/example.jpg" dpr="auto" responsive width="auto" crop="scale">
					{/* <Transformation overlay={`creative/${uri}`} width="1.3" height="1.3" crop="crop" /> */}
					<Transformation quality="auto" />
					<Transformation
						overlay={`creative:${uri}`}
						gravity="north_east"
						x="10"
						y="10"
						width="0.25"
						flags="relative"
						effect="screen"
					/>
				</Image>
			</div>
			<br />
			<span>
				{uploadProgress !== 0 && uploadProgress !== 100 ? (
					<Progress value={uploadProgress} color="primary" size="small" />
				) : (
					<p className="title is-7">{field.value.originalFileName ? field.value.originalFileName : help}</p>
				)}
			</span>

			<Toolbar buttons={buttons} color="primary" size="medium" />
		</div>
	);
}

const getCreativeLimits = (size, aspectRatio) => {
	const [ width, height ] = size;
	let maxW, maxH;

	if (width > height) {
		maxW = Math.round(FRAME_W * AD_RATIO);
		maxH = Math.round(maxW / aspectRatio);
	} else {
		maxH = Math.round(FRAME_H * AD_RATIO);
		maxW = Math.round(maxH * aspectRatio);
	}

	return [ maxW, maxH ];
};

const fitCreative = (size, aspectRatio) => {
	const [ width, height ] = size;
	const [ maxW, maxH ] = getCreativeLimits(size, aspectRatio);

	if (width >= height) {
		if (width > maxW) {
			console.log(maxW, Math.round(maxW / aspectRatio));

			return [ maxW, Math.round(maxW / aspectRatio) ];
		}
	} else if (width < height) {
		if (height > maxH) {
			console.log(Math.round(maxH * aspectRatio), maxH);
			return [ Math.round(maxH / aspectRatio), maxH ];
		}
	} else {
		if (width > maxW && height > maxH) {
			console.log(Math.round(maxH * aspectRatio), maxH);
			return [ Math.round(maxH / aspectRatio), maxH ];
		}
	}

	return size;
};
