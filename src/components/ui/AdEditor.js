import React, { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Image, Transformation } from 'cloudinary-react';

import Toolbar from 'components/ui/Toolbar';
import { Progress } from 'components/ui/bulma';

const CLOUDINARY_UPLOAD = process.env.REACT_APP_CLOUDINARY_UPLOAD_URI;

export default function AdEditor({
	field,
	form: { touched, errors },
	creative: { uri, size, position, background },
	actions: { setUri, setSecureURL, setSize, setPosition, setBackground, setOriginalFileName }
}) {
	const [ horizontal, setHorizontal ] = useState('west');
	const [ vertical, setVertical ] = useState('south');
	const [ uploadProgress, setUploadProgress ] = useState(0);

	useEffect(
		() => {
			setPosition(`${vertical}_${horizontal}`);
		},
		[ horizontal, setPosition, vertical ]
	);

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

					setUri(uri[1]);
					setSecureURL(secure_url);
					setOriginalFileName(acceptedFiles[0].name);
				})
				.catch((err) => console.error('err', err));
		},
		[ setOriginalFileName, setSecureURL, setUri ]
	);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	// const scale = (increment) => {
	// 	const newWidth = width + increment;
	// 	const newHeight = Math.round(newWidth / aspectRatio);

	// 	if (increment > 0) {
	// 		if (newWidth < widthLimit && newHeight < heightLimit) setSize([ newWidth, newHeight ]);
	// 	}

	// 	if (increment < 0) {
	// 		if (newWidth > MIN_SIZE && newHeight > MIN_SIZE) setSize([ newWidth, newHeight ]);
	// 	}
	// };

	// const toggleBackground = () => {
	// 	setBackground(!background);
	// };

	const buttons = [
		{
			icon: 'arrow-alt-circle-up',
			text: 'move up',
			action: setVertical,
			args: 'north',
			color: 'light',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-down',
			text: 'move down',
			action: setVertical,
			args: 'south',
			color: 'light',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-left',
			text: 'move left',
			action: setHorizontal,
			args: 'west',
			color: 'light',
			type: 'button'
		},
		{
			icon: 'arrow-alt-circle-right',
			text: 'move right',
			action: setHorizontal,
			args: 'east',
			color: 'light',
			type: 'button'
		}
		// { icon: 'search-plus', text: 'larger', action: scale, args: 10, color: 'light', type: 'button' },
		// { icon: 'search-minus', text: 'smaller', action: scale, args: -10, color: 'light', type: 'button' }
		// { icon: 'tint-slash', text: 'background', action: toggleBackground, color: 'light', type: 'button' }
	];

	const help = 'Click on the picture to upload your logo';

	return (
		<div>
			<div
				className={`file is-white is-boxed is-${touched[field.name] && errors[field.name] && 'danger'}`}
				{...getRootProps()}
			>
				<input type="file" name="creative" {...getInputProps()} />
				<figure className="image">
					<Image publicId="assets/example.jpg" dpr="auto" responsive width="auto" crop="fit">
						<Transformation quality="auto" />
						<Transformation
							overlay={`creative:${uri}`}
							gravity={position}
							x="10"
							y="10"
							width={size}
							flags="relative"
							// effect="screen"
						/>
					</Image>
				</figure>
			</div>

			<span>
				{uploadProgress !== 0 && uploadProgress !== 100 ? (
					<Progress value={uploadProgress} color="primary" size="small" />
				) : (
					<p className="title is-7">{field.value.originalFileName ? field.value.originalFileName : help}</p>
				)}
			</span>
			<br />
			<Toolbar buttons={buttons} color="primary" size="medium" />
		</div>
	);
}
