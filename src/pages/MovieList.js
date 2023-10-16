import React, { Component } from 'react';
// import AdSense from 'react-adsense'
import { Helmet } from 'react-helmet';

import '../styles/App.scss';
import '../styles/MovieList.scss';

import Movie1 from '../img/movies/3idiots-min.jpg';
import Movie2 from '../img/movies/imjuli-min.jpeg';
import Movie3 from '../img/movies/cinemaparadiso-min.jpeg';
import Movie4 from '../img/movies/yesman-min.jpg';
import Movie5 from '../img/movies/groundhogday-min.jpg';
import Movie6 from '../img/movies/acrosstheuniverse-min.jpg';
import Movie7 from '../img/movies/limonata-min.jpg';
import Movie8 from '../img/movies/myneighbortotoro-min.jpg';
import Movie9 from '../img/movies/darjeeling-min.jpg';
import Movie10 from '../img/movies/soundofnoise-min.jpeg';
import Movie11 from '../img/movies/littlemisssunshine-min.jpeg';
import Movie12 from '../img/movies/korkuyorumanne-min.jpeg';

class MovieList extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<>
				<Helmet>
					<title>Kendini İyi Hisset Filmleri | Şallı Turna</title>
					<meta
						name='description'
						content='Büyük meseleleri bir süreliğine kenara bıraktırıp hayata daha olumlu baktıran, iyi hissettiren filmleri derledik.'
					/>
					<meta name='twitter:card' content='summary' />
					<meta name='twitter:site' content='@salliturna' />
					<meta name='twitter:creator' content='@salliturna' />
					<meta name='twitter:title' content='Şallı Turna' />
					<meta
						name='twitter:description'
						content='Büyük meseleleri bir süreliğine kenara bıraktırıp hayata daha olumlu baktıran, iyi hissettiren filmleri derledik.'
					/>
					<meta
						name='twitter:image'
						content='https://salliturna.com.tr/img/movies/kendiniiyihissetfilmleri.jpg'
					/>
					<meta
						property='og:title'
						content='Kendini İyi Hisset Filmleri | Şallı Turna'
					/>
					<meta property='og:type' content='article' />
					<meta
						property='og:image'
						content='https://salliturna.com.tr/img/movies/kendiniiyihissetfilmleri.jpg'
					/>
					<meta
						property='og:url'
						content='https://salliturna.com.tr.tr/kendini-iyi-hisset-filmleri'
					/>
					<meta
						property='og:description'
						content='Büyük meseleleri bir süreliğine kenara bıraktırıp hayata daha olumlu baktıran, iyi hissettiren filmleri derledik.'
					/>
				</Helmet>
				<div className='movielist-container'>
					<h1 className='movielist-title'>Kendini İyi Hisset Filmleri</h1>
					<div className='movie-container'>
						<h1 className='movie-title'>3 idiots</h1>
						<img src={Movie1} />
						<div className='movie-tag'>
							Süre: 2 saat 50 dk.
							<br></br>
							Dil: Hintçe
							<br></br>
							Yıl: 2009
							<br></br>
							Yönetmen: Rajkumar Hirani
							<br></br>
							Oyuncular: Aamir Khan, Boman Irani, Kareena Kapoor, Madhavan,
							Sharman Joshi
							<br></br>
						</div>
						<div className='movie-text'>
							Hindistan'ın en önemli bir okulunda mühendislik okuyan ve okulun
							yurdunda aynı odada kalan üç öğrenci ve profesörleri arasında
							yaşananlar, dostluk kavramını beyaz perdeye yansıtırken eğitim
							sistemini de eğlenceli bir şekilde eleştirir niteliktedir.
							<br></br>
							<br></br>
							Pek de yabancısı olmadığımız yarışa dayalı eğitim sistemini
							eğlenceli bir şekilde eleştiren senaryosuyla Aamir Khan, haklarını
							arayabilen bireylerin değişim ve gelişim için ne dönemli önemli
							olduğunu hatırlatıyor.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>Im Juli.</h1>
						<img src={Movie2} />
						<div className='movie-tag'>
							Süre: 1 saat 39 dk.
							<br></br>
							Dil: Almanca
							<br></br>
							Yıl: 2000
							<br></br>
							Yönetmen: Fatih Akın
							<br></br>
							Oyuncular: Moritz Bleibtreu, Christiane Paul, Mehmet Kurtuluş,
							İdil Üner
							<br></br>
						</div>
						<div className='movie-text'>
							Daniel, öğrencileriyle yakın ilişki kurma konusunda isteksiz
							davranan, kendi dünyasına gömülü genç bir öğretmendir. Juli ile
							tanıştıktan sonra yaşamının yeni bir yön alabileceğine inanmaya
							başlar. Çünkü kadın, Daniel'in falına bakmış ve hayatının aşkını
							pek yakında bulacağı konusunda onu ikna etmiştir. Bir süre sonra
							adam, bir Türk kızı olan Melek'e tutulur ve peşinden Türkiye'ye
							gitmeye karar verir. Juli ise Daniel'in peşindedir ve birlikte bir
							dolu süpriz ve tesadüflerle dolu keyifli bir yolculuğa başlarlar.
							<br></br>
							<br></br>
							Fatih Akın’ın Im Juli.'si macera dolu bir yolculuk sosuyla
							eğlence, heyecan, aşk ve metafor dolu bir sunum hazırlıyor
							izleyicilerine.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>Cinema Paradiso</h1>
						<img src={Movie3} />
						<div className='movie-tag'>
							Süre: 1 saat 26 dk.
							<br></br>
							Dil: İtalyanca
							<br></br>
							Yıl: 1988
							<br></br>
							Yönetmen: Giuseppe Tornatore
							<br></br>
							Oyuncular: Salvatore Cascio, Philippe Noiret, Marco Leonardi,
							Jacques Perrin, Agnese Nano
							<br></br>
						</div>
						<div className='movie-text'>
							Artık ünlü bir yönetmen olmuş Salvatore, 30 yıl sonra bir
							arkadaşının öldüğü haberi üzerine doğduğu kasabaya geri döner.
							Kasabaya geldiğinde eski anıları canlanan Salvatore, Cinema
							Paradiso isimli sinemada projeksiyoncu olarak çalışan Alfred ile
							ilişkilerini hatırlar. Küçük bir çocuk olan Salvatore, günlerini
							Alfred’in yanında geçirmekte, filmlerle ilgili konuşmakta ve
							Alfred’in sinema konusunda deneyim ve bilgilerinden
							yararlanmaktadır. Babacan tavırlarıyla Salvatore’nin hayatında
							önemli bir yere sahip olacak Alfred sayesinde sinemaya olan aşkını
							ve tutkusu keşfedecektir.
							<br></br>
							<br></br>
							Cinema Paradiso, ilk sahnesinden sonuna, bizlere sinemanın ne
							kadar vazgeçilmez bir eğlence kaynağı olduğunu gençliği ve
							nostaljiyi harika anlatarak gösteriyor.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>Yes Man</h1>
						<img src={Movie4} />
						<div className='movie-tag'>
							Süre: 1 saat 44 dk.
							<br></br>
							Dil: İngilizce
							<br></br>
							Yıl: 2008
							<br></br>
							Yönetmen: Peyton Reed
							<br></br>
							Oyuncular: Jim Carrey, Zooey Deschanel, Bradley Cooper, Terence
							Stamp
							<br></br>
						</div>
						<div className='movie-text'>
							Kendi kendine yardım programına yazılan Carl Allen adlı bir adamın
							serüvenini takip ediyoruz. Söz konusu program tek ve basit bir
							ilkeye dayanmaktadır: Her şeye “evet” demek. İlk başta, evet
							gücünü açığa çıkarmak Carl’ın hayatını inanılmaz ve beklenmedik
							biçimlerde değiştirir, ama çok geçmeden anlar ki hayatını sonsuz
							olasılıklara açmanın bazı olumsuzlukları da olabilmektedir.
							<br></br>
							<br></br>
							Listemizin en hafif yapımlarından biri olan Yes Man'de Jim
							Carrey'i, hayatta her şeye evet diyerek içinde bulunduğu depresif
							durumdan kurtulan ve sonrasında nelere evet demesi gerektiğini
							yavaş yavaş öğrenen bir adam rolünde izliyoruz.
						</div>
					</div>
					{/* 
			<div className="rekl-container">
				<AdSense.Google
					className="adsbygoogle"
					client='ca-pub-5093736351800898'
					slot='5013158262'
					layout='in-article'
					format='fluid'
				/>
			</div> */}

					<div className='movie-container'>
						<h1 className='movie-title'>Groundhog Day</h1>
						<img src={Movie5} />
						<div className='movie-tag'>
							Süre: 1 saat 42 dk.
							<br></br>
							Dil: İngilizce
							<br></br>
							Yıl: 1993
							<br></br>
							Yönetmen: Harold Ramis
							<br></br>
							Oyuncular: Bill Murray, Andie MacDowell, Stephen Tobolowsky
							<br></br>
						</div>
						<div className='movie-text'>
							Ekranların sevilen spikeri Phil Connors(Bill Murray) kameraların
							dışında oldukça kibirli ve kendini beğenmiş biridir. Hiç sevmediği
							kırsal kasabaların birine haber icabı gitmektedir. Bir günlüğüne
							kalacaktır ancak bir kar fırtınası bulundukları yerde kalmalarına
							sebep olur. Takılı kaldıkları tek şey mekan değildir, zamanda da
							takılı kalmışlardır.
							<br></br>
							<br></br>
							Evlere sıkışıp kaldığımız, birbirine benzeyerek geçip giden şu
							salgın günlerinde hayatlarımızla benzerlikler bulabileceğimiz bir
							kurgu-zaman filmi Groundhog Day. Daha önce izlemiş olanların dahi
							tekrar izlemesi ve keyiflenmeleri için bundan daha uygun bir dönem
							olmadığını düşünüyoruz.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>Across The Universe</h1>
						<img src={Movie6} />
						<div className='movie-tag'>
							Süre: 2 saat 13 dk.
							<br></br>
							Dil: İngilizce
							<br></br>
							Yıl: 2007
							<br></br>
							Yönetmen: Julie Taymor
							<br></br>
							Oyuncular: Evan Rachel Wood, Jim Sturgess, Joe Anderson (VI), Dana
							Fuchs
							<br></br>
						</div>
						<div className='movie-text'>
							1960'ların savaş karşıtı gösteriler ve rock n roll ile geçen
							fırtınalı atmosferinde Liverpool’dan yola çıkıp New York’a giden
							Jude'un yolu Lucy ile kesişir. Arkadaş grubu ve çevrelerindeki
							müzisyenlerle beraber savaş karşıtı gösterilerin bir parçası
							olurlar. Çiftimizi dış koşullar ayrı düşürse de bir araya
							gelebilmeni yollarını arar dururlar.
							<br></br>
							<br></br>
							Beatles’ın 33 şarkısının hikayeleri birleştirilerek yazılan
							senaryosu ve müzikalitesiyle tam bir saygı duruşu. Klişe
							sayılabilecek konusunu farklı bir atmosferde anlatmayı başarabilen
							ender filmlerden.
						</div>
					</div>

					{/* <div className="rekl-container">
				<AdSense.Google
					className="adsbygoogle"
					client='ca-pub-5093736351800898'
					slot='5013158262'
					layout='in-article'
					format='fluid'
				/>
			</div> */}

					<div className='movie-container'>
						<h1 className='movie-title'>Limonata</h1>
						<img src={Movie7} />
						<div className='movie-tag'>
							Süre: 1 saat 41 dk.
							<br></br>
							Dil: Türkçe
							<br></br>
							Yıl: 2015
							<br></br>
							Yönetmen: Ali Atay
							<br></br>
							Oyuncular: Ertan Saban, Serkan Keskin, Funda Eryiğit
							<br></br>
						</div>
						<div className='movie-text'>
							Makedonya'da yaşayan Suat eski bir tır şoförüdür ve ölümcül bir
							hastalık nedeniyle yatağa düşer. Oğlu Sakip'i yanına çağırır ve
							ölmeden önceki tek arzusunu açıklar. Ölmeden önce tek dileği Selim
							adındaki ikinci çocuğunu bulup ondan helallik istemektir. Buna
							göre oğlu Sakip'ten İstanbul'a gidip kardeşini bulmasını ister.
							Sakip babasının emektar arabasına atlayıp elinde yalnızca
							kardeşinin adı ve eski bir adresle İstanbul yollarına düşer.
							<br></br>
							<br></br>
							Ali Atay ilk yönetmenlik denemesinde insanın en insan hallerini en
							doğal şekilde işlemeyi başarıyor ve bize sıcacık detaylarla bezeli
							bir yol filmi armağan ediyor.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>My Neighbor Totoro</h1>
						<img src={Movie8} />
						<div className='movie-tag'>
							Süre: 1 saat 28 dk.
							<br></br>
							Dil: Japonca
							<br></br>
							Yıl: 1988
							<br></br>
							Yönetmen: Hayao Miyazaki
							<br></br>
							Seslendirenler: Shigesato Itoi, Noriko Hidaka, Chika Sakamoto, Pat
							Carroll
							<br></br>
						</div>
						<div className='movie-text'>
							Bir üniversite profesörü olan babalarıyla Mei ve Satsuki, bir
							hastanede tedavi gören annelerine daha yakın olmak için bir köye
							taşınırlar. Çok geçmeden küçük kardeş Mei orman ruhlarını görmeye
							başlar ve en sonunda Totoro ile tanışır. İki kız kardeş,
							annelerinin hastalığı, günlük olaylar Totoro ve çeşitli orman
							ruhuyla birlikte değişik bir hal almaya başlar.
							<br></br>
							<br></br>
							Hayao Miyazaki’nin başyapıtı My Neighbor Totoro; büyük özen ile
							hazırlanmış, sayılamayacak kadar çok ayrıntısıyla bizi masalsı bir
							dünyaya götürüyor. Çocukluk hislerinin evrensel olduğunu tekrar
							hatırlatan bu animasyon, izleyene yaşama sevinci aşılaması
							sebebiyle listemizde.
						</div>
					</div>

					{/* <div className="rekl-container">
				<AdSense.Google
					className="adsbygoogle"
					client='ca-pub-5093736351800898'
					slot='5013158262'
					layout='in-article'
					format='fluid'
				/>
			</div> */}

					<div className='movie-container'>
						<h1 className='movie-title'>The Darjeeling Limited</h1>
						<img src={Movie9} />
						<div className='movie-tag'>
							Süre: 1 saat 31 dk.
							<br></br>
							Dil: İngilizce
							<br></br>
							Yıl: 2007
							<br></br>
							Yönetmen: Wes Anderson
							<br></br>
							Oyuncular: Adrien Brody, Owen Wilson, Jason Schwartzman, Amara
							Karan
							<br></br>
						</div>
						<div className='movie-text'>
							Wes Anderson kendine has dokunuşunu Hindistan'a taşıyor ve
							birbirine yabancılaşmış Amerikalı üç kardeşin ruhani arayışlarını
							sürdürdüğü tren yolculuğuna bizi de dahil ediyor.
							<br></br>
							<br></br>
							Hint tanrılarının renkli tablolarını andıran kareleri, zekice
							hazırlanmış komik diyalogları ve ünlü oyuncu kadrosuyla The
							Darjeeling Limited bizi bulunduğunuz yerden alıp başka diyarlara
							götürmeyi vaadediyor.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>Sound of Noise</h1>
						<img src={Movie10} />
						<div className='movie-tag'>
							Süre: 1 saat 42 dk.
							<br></br>
							Dil: İsveççe
							<br></br>
							Yıl: 2012
							<br></br>
							Yönetmenler: Ola Simonsson, Johannes Stjaerne Nilsson
							<br></br>
							Oyuncular: Bengt Nilsson, Sanna Persson, Magnus Börjeson, Fredrik
							Myhr, Johannes Björk, Marcus Haraldson Boij, Anders Vestergard
							<br></br>
						</div>
						<div className='movie-text'>
							Amadeus isimli polis memuru adından da tahmin edilebileceği gibi
							müzisyen bir aileye doğmuştur ancak kendisi ironik şekilde
							müzikten nefret eder. Bu sırada şehri bir müzik aleti gibi
							kullanıp kaos çıkaran ilginç bir anarşist grupla yolları kesişir.
							<br></br>
							<br></br>
							İsveç - Fransa ortak yapımı bu özgün komedi-polisiye, müziğin ve
							sanatın farklı yolları olabileceğini oldukça eğlenceli şekilde
							bizlere gösteriyor.
						</div>
					</div>
					{/* 
			<div className="rekl-container">
				<AdSense.Google
					className="adsbygoogle"
					client='ca-pub-5093736351800898'
					slot='5013158262'
					layout='in-article'
					format='fluid'
				/>
			</div> */}

					<div className='movie-container'>
						<h1 className='movie-title'>Little Miss Sunshine</h1>
						<img src={Movie11} />
						<div className='movie-tag'>
							Süre: 1 saat 50 dk.
							<br></br>
							Dil: İngilizce
							<br></br>
							Yıl: 2006
							<br></br>
							Yönetmenler: Jonathan Dayton, Valerie Faris
							<br></br>
							Oyuncular: Abigail Breslin, Paul Dano, Alan Arkin, Toni Collette,
							Steve Carell, Greg Kinnear
							<br></br>
						</div>
						<div className='movie-text'>
							Birbirleriyle bağları ve iletişimi zayıf bir ailenin en küçük ve
							sevimli üyesi ülkenin diğer ucundaki bir güzellik yarışmasına
							katılmak isterse ne olur? Bağların kuvvetlendiği, ailenin öneminin
							anlaşıldığı bir yolculuk olur.
							<br></br>
							<br></br>
							Bağımsız sinemanın bu ikonik örneği bize içimizi ısıtacak bir yol
							hikayesi sunuyor. Hala izlemediyseniz mutlaka tavsiye ediyoruz.
						</div>
					</div>

					<div className='movie-container'>
						<h1 className='movie-title'>Korkuyorum Anne</h1>
						<img src={Movie12} />
						<div className='movie-tag'>
							Süre: 2 saat 10 dk.
							<br></br>
							Dil: Türkçe
							<br></br>
							Yıl: 2004
							<br></br>
							Yönetmen: Reha Erdem
							<br></br>
							Oyuncular: Ali Düşenkalkar, Işıl Yücesoy, Köksal Engür, Mahmut
							Gökgöz, Erdem Akakçe
							<br></br>
						</div>
						<div className='movie-text'>
							Hafızasını yitiren bir adamın karakterini geri getirmeye çalışan
							yakın çevresi kendi karakterlerinde de bir dönüşüm başlatır.
							Hayattaki korkularıyla en saf, en naif şekilde yüzleşirler.
							<br></br>
							<br></br>
							Sinemamızın özgün yönetmenlerinden Reha Erdem; yine zamandan
							bağımsız, insanı odak noktasına alarak yarattığı evrene bizi de
							davet ediyor. İnsan olma yolculuğumuzda dinlenecek hoş bir seda
							bırakıyor.
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default MovieList;
