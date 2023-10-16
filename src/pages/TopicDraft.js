import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr';
registerLocale('tr', tr);
setDefaultLocale('tr');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCamera,
	faCaretDown,
	faCalendarAlt,
	faClock,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import queryString from 'query-string';

import Spinner from '../components/Spinner';
import { TopicFormValidators } from '../components/FormValidators.js';
import { API_DIRECTORY } from '../utils/constants.js';
import '../styles/TopicDraft.scss';
import '../styles/App.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

class TopicForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirected: '',
			title: '',
			categoryId: '',
			cityId: '',
			venueId: '',
			VenueList: [],
			isEvent: '0',
			post: '',
			startDate: '',
			startTime: '',
			endDate: '',
			endTime: '',
			isFree: 0,
			link: '',
			hashtag: '',
			uploading: false,
		};
		if (this.props.location.search) {
			const url = this.props.location.search;
			const params = queryString.parse(url);
			this.state = {
				...this.state,
				title: params.title,
				redirected: params.redirected,
			};
		}
		this.validators = TopicFormValidators;
		this.resetValidators();
		this.validators['cityId'].valid = true;
		this.validators['startDate'].valid = true;
		this.validators['startTime'].valid = true;
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateValidators = this.updateValidators.bind(this);
		this.resetValidators = this.resetValidators.bind(this);
	}

	handleInputChange = (e, inputPropName) => {
		const newState = Object.assign({}, this.state);
		newState[inputPropName] = e.target.value;
		this.setState(newState);
		this.updateValidators(inputPropName, e.target.value);
		if (!this.validators[inputPropName].valid) {
			e.target.setCustomValidity(this.validators[inputPropName].errors[0]);
		} else {
			e.target.setCustomValidity('');
		}
	};
	// This function updates the state of the validator for the specified validator
	updateValidators(fieldName, value) {
		this.validators[fieldName].errors = [];
		this.validators[fieldName].state = value;
		this.validators[fieldName].valid = true;
		this.validators[fieldName].rules.forEach((rule) => {
			if (rule.test instanceof RegExp) {
				if (!rule.test.test(value)) {
					this.validators[fieldName].errors.push(rule.message);
					this.validators[fieldName].valid = false;
				}
			} else if (typeof rule.test === 'function') {
				if (!rule.test(value)) {
					this.validators[fieldName].errors.push(rule.message);
					this.validators[fieldName].valid = false;
				}
			}
		});
	}
	// This function resets all validators for this form to the default state
	resetValidators() {
		Object.keys(this.validators).forEach((fieldName) => {
			this.validators[fieldName].errors = [];
			this.validators[fieldName].state = '';
			this.validators[fieldName].valid = false;
		});
	}
	// This method checks to see if the validity of all validators are true
	isFormValid() {
		let status = true;
		Object.keys(this.validators).forEach((field) => {
			if (!this.validators[field].valid) {
				status = false;
			}
		});
		return status;
	}

	getVenues(cityid) {
		fetch(API_DIRECTORY + '/getVenues/' + cityid)
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseVenues) => {
				if (responseVenues.status === 'success') {
					this.setState({ VenueList: responseVenues.VenueList[0] });
				} else {
					this.props.openDialog(responseVenues.status, responseVenues.message);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	}

	handleOpenPhotoList = () => {
		document.getElementById('topicdraftform-uploadphoto').click();
	};

	handleSelectPhoto = () => {
		let fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

		function validFileType(file) {
			for (let i = 0; i < fileTypes.length; i++) {
				if (file.type === fileTypes[i]) {
					return true;
				}
			}
			return false;
		}
		function returnFileSize(number) {
			if (number < 1024) {
				return number + 'byte';
			} else if (number >= 1024 && number < 1048576) {
				return (number / 1024).toFixed(1) + 'KB';
			} else if (number >= 1048576) {
				return (number / 1048576).toFixed(1) + 'MB';
			}
		}

		let input = document.querySelector('.topicdraftform-uploadphoto');
		let previewWrapper = document.querySelector(
			'.topicdraftform-uploadphoto-preview-wrapper'
		);
		let preview = document.querySelector('.topicdraftform-uploadphoto-preview');
		let buttonInfoWrapper = document.querySelector(
			'.topicdraftform-button-info-wrapper'
		);
		// let button = document.querySelector('.topicdraftform-uploadphoto-button-wrapper')

		while (preview.firstChild) {
			preview.removeChild(preview.firstChild);
		}
		let curFiles = input.files;
		if (curFiles.length === 0) {
			let photoInfo = document.createElement('span');
			photoInfo.classList.add('topicdraftform-uploadphoto-info');
			photoInfo.textContent = 'Seçili fotoğraf yok';
			preview.appendChild(photoInfo);
			buttonInfoWrapper.style.display = 'none';
		} else {
			for (let i = 0; i < curFiles.length; i++) {
				let photoPreviewWrapper = document.createElement('div');
				photoPreviewWrapper.classList.add(
					'topicdraftform-uploadphoto-photopreview-wrapper'
				);
				let photoInfo = document.createElement('p');
				photoInfo.classList.add('topicdraftform-uploadphoto-info');
				if (validFileType(curFiles[i])) {
					if (curFiles[i].size > 10 * 1048576) {
						photoInfo.textContent = "Seçili fotoğrafın boyutu 10 MB'ı aşamaz.";
						preview.appendChild(photoInfo);
						return;
					}
					photoInfo.textContent =
						curFiles[i].name + ', ' + returnFileSize(curFiles[i].size) + '.';
					let image = document.createElement('img');
					image.classList.add('topicdraftform-uploadphoto-photopreview');
					image.src = window.URL.createObjectURL(curFiles[i]);
					buttonInfoWrapper.style.display = 'block';

					photoPreviewWrapper.appendChild(image);
				} else {
					photoInfo.textContent =
						curFiles[i].name +
						': Geçerli dosya tipi değil. Lütfen seçiminizi değiştirin.';
					photoInfo.classList.add('topicdraftform-uploadphoto-info');
				}

				preview.appendChild(photoPreviewWrapper);
				preview.appendChild(photoInfo);
				preview.style.display = 'inline-block';
			}
		}
	};

	insertTopic = (e) => {
		e.preventDefault();
		if (this.props.User.id === 0) {
			this.props.openDialog(
				'info',
				'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
			);
			return;
		}
		if (this.isFormValid()) {
			let topicdraftform = document.getElementById('topicdraftform-form');
			let form_data = new FormData(topicdraftform);
			form_data.append('is_event', this.state.isEvent);
			form_data.append('start_date', this.state.startTime);
			form_data.append('end_date', this.state.endTime);
			this.setState({ uploading: true });

			fetch(API_DIRECTORY + '/insertTopic', {
				method: 'post',
				body: form_data,
				credentials: 'include',
			})
				.then((res) => {
					if (res.status === 200) return res.json();
					else return { error: 'there was an error with response' };
				})
				.then((responseInsertTopic) => {
					//TODO Dialog çalışmıyor
					this.setState({ uploading: false });
					this.props.openDialog(
						responseInsertTopic.status,
						responseInsertTopic.message
					);
					if (responseInsertTopic.status === 'success') {
						this.setState({
							title: '',
							categoryId: '',
							cityId: '',
							isEvent: '0',
							post: '',
							startDate: '',
							startTime: '',
							endDate: '',
							endTime: '',
							isFree: 0,
							link: '',
							hashtag: '',
						});
						this.props.updateLeftFrame();
						this.props.redirectToTopic(responseInsertTopic.topicid);
					}
				})
				.catch((err) => {
					this.props.openDialog(
						'error',
						'Bilinmeyen bir hatayla karşılaşıldı.'
					);
					throw new Error(err);
				});
		}
	};

	handleCategoryChangeOrInvalid = (e) => {
		const isEvent =
			e.currentTarget.options[e.currentTarget.selectedIndex].dataset.isevent;
		this.handleInputChange(e, 'categoryId');
		this.setState({
			isEvent: isEvent,
		});
		this.validators['cityId'].valid = isEvent === '1' ? false : true;
		this.validators['startDate'].valid = isEvent === '1' ? false : true;
		this.validators['startTime'].valid = isEvent === '1' ? false : true;
	};
	handleCityChangeOrInvalid = (e) => {
		this.getVenues(e.target.value);
		this.handleInputChange(e, 'cityId');
	};
	handleStartDateChange = (date) => {
		this.setState({
			startDate: date,
			startTime: date,
			// title: (this.state.endDate ? moment(date).format('Do') + ('-') + moment(this.state.endDate).format('Do MMMM YYYY') + ' ' : moment(date).format('Do MMMM YYYY dddd') + ' ')
		});
		// this.validators["startTime"].valid = true
		// this.validators["startTime"].state = date
		// this.validators["startTime"].errors = []
		this.updateValidators('startDate', date.toString());
		let inputStartDate = document.querySelector(
			'.topicdraftform-startdate-input'
		);
		if (!this.validators['startDate'].valid) {
			inputStartDate.setCustomValidity(this.validators['startDate'].errors[0]);
		} else {
			inputStartDate.setCustomValidity('');
		}

		this.updateValidators('startTime', date.toString());
		let inputStartTime = document.querySelector(
			'.topicdraftform-starttime-input'
		);
		if (!this.validators['startTime'].valid) {
			inputStartTime.setCustomValidity(this.validators['startTime'].errors[0]);
		} else {
			inputStartTime.setCustomValidity('');
		}
	};
	handleStartTimeChange = (time) => {
		this.setState({
			startTime: time,
		});
		// this.validators["startTime"].valid = true
		// this.validators["startTime"].state = time
		// this.validators["startTime"].errors = []
		this.updateValidators('startTime', time.toString());
		let inputStartTime = document.querySelector(
			'.topicdraftform-starttime-input'
		);
		if (!this.validators['startTime'].valid) {
			inputStartTime.setCustomValidity(this.validators['startTime'].errors[0]);
		} else {
			inputStartTime.setCustomValidity('');
		}
	};
	handleStartDateInvalid = (e) => {
		if (!this.state.startDate) {
			this.handleInputChange(e, 'startDate');
		}
	};
	handleStartTimeInvalid = (e) => {
		// let inputStartTime = document.querySelector(".topicdraftform-starttime-input")
		// if(!this.state.startTime){
		//   this.handleInputChange(e, 'startTime')
		// }
	};
	handleEndDateChange = (date) => {
		this.setState({
			endDate: date,
			endTime: date,
			// title: moment(this.state.startDate).format('Do') + ('-') + moment(date).format('Do MMMM YYYY') + ' '
		});
	};
	handleEndTimeChange = (time) => {
		this.setState({
			endTime: time,
		});
	};
	handleTitleChangeOrInvalid = (e) => {
		this.handleInputChange(e, 'title');
	};
	handlePostChangeOrInvalid = (e) => {
		this.handleInputChange(e, 'post');
	};

	handleAddSpoiler = () => {
		let textArea = document.getElementById('topicdraftform-post-textarea');
		let wholeText = textArea.value;
		let selectedText = wholeText.slice(
			textArea.selectionStart,
			textArea.selectionEnd
		);
		let newText =
			wholeText.slice(0, textArea.selectionStart) +
			'—Spoiler—\n\n' +
			selectedText +
			'\n\n—Spoiler—' +
			wholeText.slice(textArea.selectionEnd);
		this.setState({
			post: newText,
		});
		//TODO cursor spoilerın ortasına gelsin
		// textArea.setSelectionRange(1, 3)
	};

	render() {
		const CategoryList = this.props.CategoryList;
		const VenueList = this.state.VenueList;
		const spinner = this.state.uploading ? (
			<div className='topicdraftform-spinner'>
				<Spinner />
			</div>
		) : null;

		//Mobilde keyboard saklamak için eklenti
		const DatepickerInput = ({ ...props }) => (
			<input type='text' {...props} readOnly />
		);

		const redirectedInfoArea =
			this.state.redirected === 'true' ? (
				<div className='topicdraftform-redirectedinfo'>
					Bu isimde etkinlik veya konu bulunumadı. Siz eklemek ister misiniz?
				</div>
			) : null;

		return (
			<>
				<Helmet>
					<title>Konu Ekle | Şallı Turna</title>
				</Helmet>
				{redirectedInfoArea}
				<form
					id='topicdraftform-form'
					className='topicdraftform-form'
					onSubmit={this.insertTopic}
					autoComplete='off'
				>
					{spinner}
					<div className='topicdraftform-container'>
						<div className='topicdraftform-category-wrapper'>
							<select
								className='topicdraftform-category-dropdown'
								name='category_id'
								onInvalid={this.handleCategoryChangeOrInvalid}
								onChange={this.handleCategoryChangeOrInvalid}
								defaultValue=''
								required
							>
								<option value='' hidden>
									Kategori seçin
								</option>
								{this.props.User.id == 1 && (
									<option value='' disabled>
										-ETKİNLİKLER-
									</option>
								)}
								{CategoryList.EventCategoryList !== null &&
									this.props.User.id == 1 &&
									CategoryList.EventCategoryList.map((EventCategory) => {
										return (
											<option
												key={EventCategory.category_id}
												value={EventCategory.category_id}
												data-isevent={EventCategory.isEvent}
											>
												{EventCategory.category_name}
											</option>
										);
									})}
								<option value='' disabled>
									-KONULAR-
								</option>
								{CategoryList.TopicCategoryList !== null &&
									CategoryList.TopicCategoryList.map((TopicCategory) => {
										return (
											<option
												key={TopicCategory.category_id}
												value={TopicCategory.category_id}
												data-isevent={TopicCategory.isEvent}
											>
												{TopicCategory.category_name}
											</option>
										);
									})}
							</select>
							<div className='topicdraftform-category-icon-container'>
								<div className='topicdraftform-category-icon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-city-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'block'
										: 'none',
							}}
						>
							<select
								className='topicdraftform-city-dropdown'
								name='city_id'
								onInvalid={this.handleCityChangeOrInvalid}
								onChange={this.handleCityChangeOrInvalid}
								defaultValue=''
								required={
									this.state.isEvent && this.state.isEvent !== '0'
										? true
										: false
								}
							>
								<option value='' hidden>
									Şehir seçin
								</option>
								<option value='82'>Online</option>
								<option value='34'>İstanbul</option>
								<option value='35'>İzmir</option>
								<option value='6'>Ankara</option>
							</select>
							<div className='topicdraftform-city-icon-container'>
								<div className='topicdraftform-city-icon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-venue-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'block'
										: 'none',
							}}
						>
							<select
								className='topicdraftform-venue-dropdown'
								name='venue_id'
								onInvalid={this.handleVenueChangeOrInvalid}
								onChange={this.handleVenueChangeOrInvalid}
								defaultValue=''
							>
								<option value='' hidden>
									(Opsiyonel) Mekan seçin
								</option>
								{VenueList !== null &&
									VenueList.map((Venue) => {
										return (
											<option key={Venue.venue_id} value={Venue.venue_id}>
												{Venue.venue_title}
											</option>
										);
									})}
							</select>
							<div className='topicdraftform-venue-icon-container'>
								<div className='topicdraftform-venue-icon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-startdate-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'inline-block'
										: 'none',
							}}
						>
							<div
								className='topicdraftform-startdate-datepicker'
								onInvalid={this.handleStartDateInvalid}
							>
								<DatePicker
									placeholderText='Başlangıç tarihi seçin.'
									popperClassName='topicdraftform-datepicker-popper'
									// calendarClassName="topicdraftform-datepicker"
									className='topicdraftform-startdate-input'
									name='startDate'
									required={
										this.state.isEvent && this.state.isEvent !== '0'
											? true
											: false
									}
									selected={this.state.startDate}
									clearButtonClassName='topicdraftform-startdate-close-icon'
									// selectsStart
									// showTimeSelect
									// timeFormat="HH:mm"
									// timeIntervals={30}
									// timeCaption="Saat"
									dateFormat='d MMMM yyyy'
									minDate={new Date()}
									onChange={this.handleStartDateChange}
									customInput={<DatepickerInput />}
								/>
							</div>
							<div className='topicdraftform-startdate-icon-container'>
								<div className='topicdraftform-startdate-icon'>
									<FontAwesomeIcon icon={faCalendarAlt} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-starttime-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'inline-block'
										: 'none',
							}}
						>
							<div
								className='topicdraftform-starttime-datepicker'
								onInvalid={this.handleStartTimeInvalid}
							>
								<DatePicker
									placeholderText='Başlangıç saati seçin.'
									// calendarClassName="topicdraftform-datepicker"
									name='startTime'
									className='topicdraftform-starttime-input'
									required={
										this.state.isEvent && this.state.isEvent !== '0'
											? true
											: false
									}
									selected={this.state.startTime}
									// selectsStart
									showTimeSelect
									// showTimeSelectOnly
									dateFormat='HH:mm'
									timeIntervals={30}
									timeCaption='Saat'
									minDate={this.state.startDate}
									onChange={this.handleStartTimeChange}
									// dateFormat="d MMMM yyyy HH:mm"
									// minDate={new Date()}
									customInput={<DatepickerInput />}
								/>
							</div>
							<div className='topicdraftform-starttime-icon-container'>
								<div className='topicdraftform-starttime-icon'>
									<FontAwesomeIcon icon={faClock} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-enddate-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'inline-block'
										: 'none',
							}}
						>
							<div className='topicdraftform-enddate-datepicker'>
								<DatePicker
									placeholderText='(Opsiyonel) Bitiş tarihi seçin.'
									popperClassName='topicdraftform-datepicker-popper'
									// calendarClassName="topicdraftform-datepicker"
									name='endDate'
									selected={this.state.endDate}
									// showTimeSelect
									// selectsEnd
									// timeFormat="HH:mm"
									// timeIntervals={30}
									// timeCaption="Saat"
									dateFormat='d MMMM yyyy'
									// isClearable
									minDate={this.state.startDate}
									onChange={this.handleEndDateChange}
									customInput={<DatepickerInput />}
								/>
								{/*
          >
          <div style={{ position: "relative", color: "red", left: "1rem" }}>
            Bitiş saatini seçmeyi unutmayın.
          </div>
          </DatePicker>
          */}
							</div>
							<div className='topicdraftform-enddate-icon-container'>
								<div className='topicdraftform-enddate-icon'>
									<FontAwesomeIcon icon={faCalendarAlt} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-endtime-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'inline-block'
										: 'none',
							}}
						>
							<div className='topicdraftform-endtime-datepicker'>
								<DatePicker
									placeholderText='(Opsiyonel) Bitiş saati seçin.'
									// calendarClassName="topicdraftform-datepicker"
									name='endTime'
									selected={this.state.endTime}
									// selectsStart
									showTimeSelect
									// showTimeSelectOnly
									dateFormat='HH:mm'
									timeIntervals={30}
									timeCaption='Saat'
									minDate={this.state.endDate}
									// dateFormat="d MMMM yyyy HH:mm"
									// minDate={new Date()}
									onChange={this.handleEndTimeChange}
									customInput={<DatepickerInput />}
								/>
							</div>
							<div className='topicdraftform-endtime-icon-container'>
								<div className='topicdraftform-endtime-icon'>
									<FontAwesomeIcon icon={faClock} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div
							className='topicdraftform-free-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'block'
										: 'none',
							}}
						>
							<input
								type='checkbox'
								className='topicdraftform-free-icon'
								name='is_free'
							/>
							<span className='checkbox-label'>Ücretsiz</span>
						</div>
						<div className='topicdraftform-title-wrapper'>
							<textarea
								className='topicdraftform-title-textarea'
								name='title'
								value={this.state.title}
								placeholder='Başlık girin.'
								rows='1'
								onInvalid={this.handleTitleChangeOrInvalid}
								onChange={this.handleTitleChangeOrInvalid}
								tabIndex='1'
								required
							/>
						</div>
						<div className='topicdraftform-post-textarea-wrapper'>
							<textarea
								className='topicdraftform-post-textarea'
								id='topicdraftform-post-textarea'
								name='post_text'
								value={this.state.post}
								placeholder={
									(this.state.title ? this.state.title : 'Bu konu') +
									' hakkında yazın.'
								}
								rows='10'
								onInvalid={this.handlePostChangeOrInvalid}
								onChange={this.handlePostChangeOrInvalid}
								tabIndex='2'
								required
							/>
						</div>
						<div
							className='topicdraftform-link-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'block'
										: 'none',
							}}
						>
							<textarea
								className='topicdraftform-link-textarea'
								name='link'
								placeholder='Kaynak link ekleyin.'
								rows='1'
								tabIndex='3'
							/>
						</div>
						<div
							className='topicdraftform-hashtag-wrapper'
							style={{
								display:
									this.state.isEvent && this.state.isEvent !== '0'
										? 'block'
										: 'none',
							}}
						>
							<textarea
								className='topicdraftform-hashtag-textarea'
								name='hashtag'
								placeholder='Etiket ekleyin. (Etiketler arasına virgül koyun.)'
								rows='1'
								tabIndex='4'
							/>
						</div>
						<div className='topicdraftform-bottom-container'>
							<div
								className='topicdraftform-uploadphoto-button-wrapper'
								onClick={this.handleOpenPhotoList}
							>
								<FontAwesomeIcon icon={faCamera} color='#2F2F3C' size='lg' />
							</div>
							<input
								type='file'
								id='topicdraftform-uploadphoto'
								className='topicdraftform-uploadphoto'
								name='post_photo'
								onChange={this.handleSelectPhoto}
								accept='image/*'
							/>
							<div className='topicdraftform-addspoiler-button-wrapper'>
								<input
									id='topic-addspoiler-button'
									className='topic-addspoiler-button'
									type='button'
									value='+ Spoiler'
									onClick={this.handleAddSpoiler}
								/>
							</div>
							<div className='topicdraftform-uploadphoto-preview-wrapper'>
								<div className='topicdraftform-button-info-wrapper'>
									<p>Seçiminizi değiştirmek için tekrar tıklayın.</p>
								</div>
								<div className='topicdraftform-uploadphoto-preview'>
									<p>Seçili fotoğraf yok</p>
								</div>
							</div>
							<div className='topicdraftform-button-send-wrapper'>
								<input
									id='topicdraftform-button-send'
									className='topicdraftform-button-send'
									type='submit'
									value='Gönder'
								/>
							</div>
						</div>
					</div>
				</form>
			</>
		);
	}
}

class TopicDraft extends Component {
	constructor(props) {
		super(props);
		this.state = {
			CategoryList: {},
		};
	}

	componentDidMount() {
		if (this.props.User.id !== null) {
			this.getCategories();
		}
		// document.getElementById('date-picker-input').setAttribute('readonly', 'readonly')
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.getCategories();
			window.scrollTo(0, 0);
		}
	}

	redirectToTopic = (topicid) => {
		this.props.history.push('/topic/' + topicid);
	};

	getCategories() {
		fetch(API_DIRECTORY + '/getCategories')
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseCategories) => {
				if (responseCategories.status === 'success') {
					this.setState({ CategoryList: responseCategories.CategoryList });
				} else {
					this.props.openDialog(
						responseCategories.status,
						responseCategories.message
					);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	}

	render() {
		const CategoryList = this.state.CategoryList;
		if (!Object.keys(CategoryList).length) {
			return null;
		}

		return (
			<div className='topicdraft-container'>
				<TopicForm
					{...this.props}
					CategoryList={CategoryList}
					redirectToTopic={this.redirectToTopic}
					openDialog={this.props.openDialog}
					updateLeftFrame={this.props.updateLeftFrame}
				/>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps)(TopicDraft));
