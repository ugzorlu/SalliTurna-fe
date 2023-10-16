const RegisterFormValidators = {
	username: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Kullanıcı adı boş bırakılamaz.',
			},
			{
				test: /^[A-Za-z0-9 _\u00E7\u011F\u0131\u015F\u00F6\u00FC\u00C7\u011E\u0130\u015E\u00D6\u00DC]+$/,
				message: 'Kullanıcı adı yalnızca harf, rakam, boşluk veya "_" karakterlerinden oluşabilir.',
			},
			{
				test: (value) => {
					return value.length <= 20;
				},
				message: 'Kullanıcı adı 20 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	},
	email: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'E-posta adresi boş bırakılamaz.',
			},
			{
				test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: 'Lütfen geçerli bir e-posta adresi giriniz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	},
	password: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Şifre boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length >= 4;
				},
				message: 'Şifre 4 karakterden az olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: ''
	},
	password_repeat: {
		rules: [
			{
				test: (value, compareValue) => {
					return value === compareValue;
				},
				message: 'Şifrelerin eşleşmesi gerekmekte.',
			}
		],
		errors: [],
		valid: false,
		state: ''
	},
	termsandconditions: {
		rules: [
			{
				test: (value) => {
					return value === true;
				},
				message: 'Kullanıcı sözleşmesini onaylamalısınız.',
			}
		],
		errors: [],
		valid: false,
		state: ''
	}
}

const LoginFormValidators = {
	nameoremail: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Kullanıcı adı ya da e-posta boş bırakılamaz.',
			},
			{
				test: /^[A-Za-z@\.0-9 _\u00E7\u011F\u0131\u015F\u00F6\u00FC\u00C7\u011E\u0130\u015E\u00D6\u00DC]+$/,
				message: 'Kullanıcı adı yalnızca harf, rakam, boşluk veya "_" karakterlerinden oluşabilir.',
			},
			{
				test: (value) => {
					return value.length <= 50;
				},
				message: 'Kullanıcı adı ya da e-posta 50 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	},
	password: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Şifre boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length >= 4;
				},
				message: 'Şifre 4 karakterden az olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: ''
	}
}

const SendPasswordTokenValidators = {
	email: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'E-posta adresi boş bırakılamaz.',
			},
			{
				test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: 'Lütfen geçerli bir e-posta adresi giriniz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	}
}

const NewPasswordFormValidators = {
	newpassword: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Yeni şifre boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length >= 4;
				},
				message: 'Yeni şifre 4 karakterden az olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: ''
	}
}

const PostFormValidators = {
	posttextarea: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Gönderi boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length <= 10000;
				},
				message: 'Gönderi 10000 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	}
}

const TopicFormValidators = {
	categoryId: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Kategori seçmelisiniz.',
			}
		],
		errors: [],
		valid: false,
		state: '',
	},
	startDate: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Etkinlik için başlangıç tarihi seçmelisiniz.',
			}
		],
		errors: [],
		valid: false,
		state: '',
	},
	startTime: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Etkinlik için başlangıç saati seçmelisiniz.',
			}
		],
		errors: [],
		valid: false,
		state: '',
	},
	cityId: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Etkinlik için şehir seçmelisiniz.',
			}
		],
		errors: [],
		valid: false,
		state: '',
	},
	post: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Gönderi boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length <= 10000;
				},
				message: 'Gönderi 10000 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	},
	title: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Başlık boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length <= 75;
				},
				message: 'Başlık 75 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	}
}

const SendFeedbackValidators = {
	email: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'E-posta adresi boş bırakılamaz.',
			},
			{
				test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: 'Lütfen geçerli bir e-posta adresi giriniz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	},
	title: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Konu boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length <= 500;
				},
				message: 'Konu 500 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	},
	feedback: {
		rules: [
			{
				test: (value) => {
					return value.length > 0;
				},
				message: 'Mesaj boş bırakılamaz.',
			},
			{
				test: (value) => {
					return value.length <= 10000;
				},
				message: 'Mesaj 10000 karakterden fazla olamaz.',
			},
		],
		errors: [],
		valid: false,
		state: '',
	}
}

export { RegisterFormValidators, LoginFormValidators, SendPasswordTokenValidators, NewPasswordFormValidators, PostFormValidators, TopicFormValidators, SendFeedbackValidators }
