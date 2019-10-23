import React, { useCallback, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';

import { Progress } from 'components/ui/bulma/elements';

const CLOUDINARY_UPLOAD = process.env.REACT_APP_CLOUDINARY_UPLOAD_URI;
export default function Upload({
	field,
	form: { touched, errors },
	name,
	label,
	placeholder,
	help,
	icon,
	size,
	// creative: { uri, size, aspectRatio, position, background },
	actions: { setUri, setSecureURL, setSize, setAspectRatio, setPosition, setBackground }
}) {
	const [ uploadProgress, setUploadProgress ] = useState(0);
	const [ selectedFile, setSelectedFile ] = useState();

	const onDrop = useCallback(
		(acceptedFiles) => {
			setSelectedFile(acceptedFiles[0].name);

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
					setAspectRatio(width / height);
					setSize([ width, height ]);
				})
				.catch((err) => console.error('err', err));
		},
		[ setAspectRatio, setSecureURL, setSize, setUri ]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="field">
			<label className={`label is-${size}`}>{label}</label>
			<div
				className={`file is-medium is-boxed is-fullwidth is-${touched[field.name] &&
					errors[field.name] &&
					'danger'}`}
				{...getRootProps()}
			>
				<div className="file-label">
					<input className="file-input" type="file" name="creative" {...getInputProps()} />
					<span className="file-cta">
						<span className="file-icon">
							<i className={`fas fa-${icon} fa-lg`} />
						</span>
						<span className="file-label">
							<strong>
								<p className="title is-4 has-text-centered">
									{selectedFile ? selectedFile : placeholder}
								</p>
							</strong>

							{selectedFile &&
							(uploadProgress && uploadProgress !== 100) && (
								<Progress value={uploadProgress} color="primary" size="small" />
							)}
						</span>
					</span>
				</div>
			</div>
			{touched[field.name] && errors[field.name] ? (
				<p className="help is-danger">{errors[field.name].uri}</p>
			) : (
				<p className="help">{help}</p>
			)}
		</div>
	);
}
