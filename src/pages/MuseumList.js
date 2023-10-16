import React, { Component } from 'react';
// import AdSense from 'react-adsense'

import '../styles/App.scss';
import '../styles/MuseumList.scss';

class MuseumList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<div className='museumlist-container'>
				<div className='museum-container'>
					<h1 className='museum-title'>İstanbul Oyuncak Müzesi</h1>
					<img src='https://cdn.shopify.com/s/files/1/0012/8532/4852/t/5/assets/gem20180523May051527111437muzeodatren_111.jpg?6830586522782345706' />
					<div className='museum-text'>
						İstanbul Oyuncak Müzesi 23 Nisan 2005 yılında şair/yazar Sunay Akın
						tarafından kurulmuştur. 1700’lü yıllardan günümüze oyuncak tarihinin
						en gözde örneklerinin sergilendiği müze tarihi bir köşkte
						konumlanmıştır.
					</div>
				</div>
				<a
					href='https://istanbuloyuncakmuzesi.com/pages/360-tur'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>Arkas Sanat Merkezi</h1>
					<img src='https://www.izmirdergisi.com/templates/yootheme/cache/arkas-sanat-1-c1df20c9.jpeg' />
					<div className='museum-text'>
						Arkas Sanat Merkezi, Arkas Holding Yönetim Kurulu Başkanı Lucien
						Arkas’ın kişişel ilgisi ve profesyonel yaklaşımı ile oluşan Arkas
						Koleksiyonu’nu sanatseverler ile paylaşmak isteği doğrultusunda
						kuruldu.
						<br></br>
						<br></br>
						İzmir’de döneminin en güzel yapılarından biri olarak 1875 yılından
						beri hizmet veren Fransız Fahri Konsolosluk binasının denize bakan
						bölümü, Fransız Hükümeti tarafından 20 yıllığına, kültür ve sanat
						amaçlı kullanım için Arkas Holding’e tahsis edildi. Bir yıl süren
						restorasyon çalışmalarının ardından bina Kasım 2011’de Arkas Sanat
						Merkezi adıyla açıldı.
						<br></br>
						<br></br>
						Çağdaş donanımlı bir sanat merkezine dönüştürülen iki katlı tarihi
						binada, 9 adet sergi odası ve 1 atölye bulunuyor. Arkas Sanat
						Merkezi, İzmir’e kazandırılmış tarihi bir bina olmasının yanında,
						birçok uluslararası ressamın eserlerinin sergilendiği ilk sanat
						merkezi olma özelliği de taşıyor.
					</div>
				</div>
				<a
					className='museum-link'
					href='http://www.arkassanatmerkezi.com/article.aspx?pageID=11'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>
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

				<div className='museum-container'>
					<h1 className='museum-title'>Ayasofya Müzesi</h1>
					<img src='https://i.ytimg.com/vi/9sq0VlGnFGA/maxresdefault.jpg' />
					<div className='museum-text'>
						Ayasofya, dünya mimarlık tarihinin günümüze kadar ayakta kalmış en
						önemli yapıları arasında yer alıyor. Ayasofya 916 yıl kilise, 481
						yıl cami, 1935 yılından bu yana da müze olarak kullanılıyor.
					</div>
				</div>
				<a
					href='http://www.3dmekanlar.com/tr/ayasofya.html'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>Göbeklitepe Örenyeri</h1>
					<img src='https://sanalmuze.gov.tr/Resim/335406,gobeklitepemuzejpgjpg.png' />
					<div className='museum-text'>
						Yerleşim yeri olarak kullanılmadığı bilinen ve tapınmaya hizmet eden
						Göbeklitepe, şaşırtıcı anıtsal mimarisiyle 2018 yılında UNESCO Dünya
						Mirası Listesi'ne girdi. Türkiye'de de’’ 2019 Göbeklitepe Yılı” ilan
						edildi. Henüz küçük bir bölümü çıkarılan Göbeklitepe, yaklaşık 12
						bin yıllık geçmişiyle insanlık tarihini değiştirdi. Dünyanın bilinen
						en eski ve en büyük tapınma (kült) merkezi sayılan Göbeklitepe ile
						dinsel inanışın yerleşik yaşama geçişteki etkisi kanıtlandı.
						<br></br>
						<br></br>
						Harran Ovası'na hakim bu tarih öncesi yerleşimin sınırlı bir bölümü
						kazılsa da, sıra dışı bulguları Neolitik Çağ'la ilgili pek çok
						bilgiyi altüst etti. Şanlıurfa'nın Örencik Köyü yakınlarındaki
						Göbeklitepe kazılarını 1995'te Alman arkeolog Prof. Dr. Klaus
						Schmidt başlattı ve 2014'deki ölümüne dek 20 yıl sürdürdü.
						<br></br>
						<br></br>
						Göbeklitepe; avcı-toplayıcı yaşamı, tarım ve hayvancılığa geçişi,
						tapmak mimarisi ve sanatın doğuşunu anlamamıza önemli katkılar
						sağladı. Varlığını M.Ö. 8 bin dolaylarına kadar sürdürdükten sonra
						terk edildi. Başka ya da benzer amaçlarla kullanılmadı.
						<br></br>
						<br></br>
					</div>
				</div>
				<a
					href='https://sanalmuze.gov.tr/TR-259963/gobeklitepe-orenyeri---sanliurfa.html'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>Efes Müzesi</h1>
					<img src='https://sanalmuze.gov.tr/Resim/335419,efesmuzejpg.png' />
					<div className='museum-text'>
						Efes Müzesi T.C. Kültür Bakanlığı adına Efes'teki arkeolojik
						araştırmalardan, düzenleme, kontrol ve koruma çalışmalarından
						sorumlu olan Efes Müzesi, Efes ve yakın çevresinde bulunan Miken,
						Arkaik, Klasik, Hellenistik, Roma, Bizans, Selçuklu ve Osmanlı
						devirlerine ait önemli eserlerin yanı sıra kültürel faaliyetleri ve
						ziyaretçi kapasitesi ile de Türkiye'nin en önemli müzelerinden
						biridir.
						<br></br>
						<br></br>
						Efes'teki ilk arkeolojik kazılardan sonra 1929 yılında depo
						işlevinde kurulmuş, 1964 yılında yeni bölümün inşası ile genişleyen
						Efes Müzesi sonraki yıllarda sergi değişiklikleri ve yeni ekler ile
						sürekli gelişmiştir. Efes Müzesi'nin ağırlıklı olarak bir antik
						kentin eserlerini sergileyen müze olması nedeniyle kronolojik ve
						tipolojik bir sergileme yerine eserlerin buluntu yerlerine göre
						sergilenmeleri tercih edilmiştir. Buna göre salonlar Yamaç Evler ve
						Ev Buluntuları Salonu, Sikke ve Hazine Bölümü, Mezar Buluntuları
						Salonu, Efes Artemisi Salonu, İmparator Kültleri Salonu olarak
						düzenlenmiştir.
						<br></br>
						<br></br>
						Bu salonların yanı sıra müze iç ve orta bahçelerinde çeşitli mimari
						ve heykeltraşlık eserleri bahçe dekoru içinde ve uyumlu olarak
						sergilenmektedir. İki büyük Artemis heykeli, Eros başı, Yunuslu Eros
						heykelciği, Sokrates başı, Efes Müzesi'nin dünyaca tanınmış ünlü
						eserlerinden bazılarıdır. Efes Müzesi koleksiyonlarında halen
						yaklaşık 50.000 eser bulunmaktadır. Bu sayı her yıl sürdürülen
						arkeolojik kazılar sonucu ortaya çıkarılan veya çevre halkının bağış
						yoluyla getirdiği eserler ile artmakta, müze koleksiyonları
						zenginleşmektedir.
						<br></br>
						<br></br>
						Bu eserlerin kısa süre içinde bilim dünyasının ve insanlığın
						hizmetine sunulması düşüncesiyle Efes Müzesi'nde "Yeni Buluntular
						Salonu" oluşturulmuştur. Ancak, bu salon her zaman yeterli
						gelmemekte, diğer salonlardaki sergilemelerin de yeni buluntular
						ışığında ve çağdaş müzecilik anlayışına uygun olarak yenilenmesi
						gerekmektedir. Bu anlayışa uygun olarak Yamaç Evler ve Ev
						Buluntuları Salonunda yapılan yeni düzenlemede buluntu gruplarını
						birarada sergileyerek konu bütünlüğü oluşturulması amaçlanmıştır.
					</div>
				</div>
				<a
					href='https://www.mekan360.com/sanaltur_efes-muzesi-ephesus-museum_693.html'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>Anadolu Medeniyetleri Müzesi</h1>
					<img src='https://sanalmuze.gov.tr/Resim/335403,anadolumedeniyetmuzejpgjpg.png' />
					<div className='museum-text'>
						Paleolitik Çağ’dan itibaren Anadolu topraklarının özgün eserlerine
						ev sahipliği yapan Anadolu Medeniyetleri Müzesi, iki tarihi binadan
						oluşmaktadır. Bunlar Osmanlı Dönemi yapıları olan Mahmutpaşa
						Bedesteni ve Kurşunlu Han’dır. 2014’te restore edilerek yenilenen bu
						müzede sanal turlar, canlandırmalar ve Göbeklitepe’deki T biçimli
						dikme replikalar ve eserlerle birlikte tarihe bir yolculuk yapmanızı
						sağlamaktadır.
					</div>
				</div>
				<a
					href='https://sanalmuze.gov.tr/TR-259961/anadolu-medeniyetleri-muzesi---ankara.html'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				{/* <div className="rekl-container">
					<AdSense.Google
						className="adsbygoogle"
						client='ca-pub-5093736351800898'
						slot='5013158262'
						layout='in-article'
						format='fluid'
					/>
				</div> */}

				<div className='museum-container'>
					<h1 className='museum-title'>Troya Müzesi</h1>
					<img src='https://sanalmuze.gov.tr/Resim/335420,troyamuzejpg.png' />
					<div className='museum-text'>
						Troya Müzesi, Çanakkale İli, Merkez İlçesi’ne bağlı Tevfikiye Köyü
						sınırları içinde yer alan, UNESCO’nun 1998 yılında Dünya Kültür
						Mirası Listesi’ne aldığı, Troya Antik Kenti girişinde yer
						almaktadır. 3.000 m2 sergi salonu, 11.200 m2 kapalı alana sahiptir.
						İnşasına 2013 yılında başlanılmış, 2015 yılında duran çalışmalara
						2017 yılından bu yana devam edilmiş ve 2018 yılı Ekim ayında
						açılmıştır.
						<br></br>
						<br></br>
						Müze ziyareti rampadan inerken başlamaktadır. Rampanın duvarlarında
						bulunan nişlerde Troya’nın farklı katmanları; mezar taşları, büyük
						boy heykeller, sahne canlandırmaları ve büyük boy fotoğraflarla
						anlatılmaktadır. Müzenin giriş alanı olan, Troas ve çevresini konu
						alan sirkülasyon bandında ise devam eden sergi katları öncesinde
						ziyaretçiye bir oryantasyon sağlamak amacıyla arkeoloji bilimi;
						arkeolojik ve arkeometrik tarihleme yöntemleri, “neolitik,
						kalkolitik, tunç çağı, demir çağı, höyük, restorasyon, konservasyon”
						gibi terimler şemalar, çizimler, metinler ve interaktif yöntemlerle
						aktarılmaktadır.
						<br></br>
						<br></br>
						Eserler taş (mermer), heykel, lahit, yazıt, sunak, mil taşı,
						paleolitik balta ve kesiciler vb., pişmiş toprak seramikler, metal
						kaplar; altınlar, silahlar, sikkeler, kemik obje ve aletler, cam
						bilezikler, süs eşyaları, bardak, koku şişeleri, gözyaşı
						şişelerinden vb. oluşmaktadır. Müze bahçesinde, peyzaj ile birlikte
						taş eserler de, lahit, sütun, steller, sütun başlıkları vb. bütünlük
						oluşturacak şekilde sergilenmektedir.
						<br></br>
						<br></br>
						Müzede ayrıca görsel grafik tasarımlarla birlikte diorama (anın veya
						hikâyenin ışık oyunlarının da yardımıyla üç boyutlu olarak
						modellenmesi) dokunmatik ekran ve animasyonlarla sergi ile
						anlatımları yapılmaktadır
					</div>
				</div>
				<a
					href='https://sanalmuze.gov.tr/TR-259960/troya-muzesi---canakkale.html'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>Hatay Arkeoloji Müzesi</h1>
					<img src='https://sanalmuze.gov.tr/Resim/335664,hatayarkeolojimuzesijpg.png' />
					<div className='museum-text'>
						MÖ 4 binli yıllardan başlayan tarihi geçmişi ile Hatay, birçok
						dönemin ve medeniyetin kültür ve tarihi vesikalarını bünyesinde
						toplayan bir şehirdir. Hatay’da kazı çalışmaları 1932 yılında
						başlamıştır. 1933–1938 yılları arasında Amik Ovası'nda Cüdeyde,
						Dehep, Çatalhöyük ve Tainat'ta, Chicago Üniversitesi Chicago
						OrientalInstitute tarafından kazı çalışmaları yapılmıştır. 1936
						yılında, British Museum adına Sir Leonard Wolley, Samandağı El-Mina
						Mevkii'nde, 1937'den 1948 senesine kadar da aralıklarla, Açana
						Höyüğü'nde hafriyat ve kazı çalışmaları yürütülmüştür.
						<br></br>
						<br></br>
						1932-1939 yıllarında Princeton Üniversitesi’nin yaptığı
						araştırmalarla müzenin esas zenginliğini oluşturan mozaikler ortaya
						çıkartılmıştır. Bu zenginlikler, merkezi Antakya’da olmak üzere
						Harbiye, Narlıca, Güzelburç, Samandağ ve çevresinde yapılan kazılar
						sonucu çıkartılan ve koleksiyonu tamamlayan mozaiklerdir.
						<br></br>
						<br></br>
						Antakya’da yürütülen 1932-1939 yılı kazı çalışmalarında çoğu Roma
						Dönemi'ne tarihlendirilen mimari ve diğer buluntular kentin
						zenginliğini ve ihtişamını ortaya sermiştir. The Committeeforthe
						Excavationandits Vicinity adlı komitenin yaptığı kazı çalışmaları
						başta Antakya, Harbiye olmak üzere Samandağ’da Seleuceia Pieria'da
						sürdürülmüş ve kazılarda ortaya çıkan zengin mozaik eser koleksiyonu
						bugün dünyanın yaklaşık 20 müzesine ve özel koleksiyonlarına
						dağılmış durumdadır. Antiokheia kökenli birçok eser bugün Hatay
						Arkeoloji Müzesi’ nin yanı sıra Princeton Universitesi Sanat Müzesi
						(ABD), Worcester Müzesi (ABD), Louvre (Fransa) gibi müzelerde
						saklanmakta veya sergilenmektedir. Kazılarda çıkan eserlerin tek
						yerde toplanması için başlayan çalışmanın ardından 1939 yılında
						tamamlanan Hatay Arkeoloji Müzesi, 23 Temmuz 1948 yılında Hatay’ın
						Anavatana katılışının 10’uncu yılında ziyaretçilere açılmıştır.
						Müzenin sekiz sergi salonundan biri olan Lahit Salonu 2000 yılında
						tamamlanarak teşhire sunulmuştur. Müzede yer alan sergi salonlarına
						ek olarak müze bahçesinde de eserler yer almaktadır. Beş deposu
						bulunan müzenin 1140 metrekarelik bir oturma alanı mevcuttur.
						Eserler 984 metrekarelik bir alanda sergilenmektedir.
						<br></br>
						<br></br>
						1939 yılında açılan ve dönemin koşullarında ve mevcut eserlere göre
						yapılan müze binasının artık günün koşullarına uymaması, modern
						müzeciliğin ihtiyaçlarına cevap vermemesi nedeniyle yeni müze
						yapılması çalışmalarına başlanmıştır. Bakanlığımız Kültür Varlıkları
						ve Müzeler Genel Müdürlüğü ve Hatay Valiliği koordinesinde yürütülen
						projede 26 Mayıs 2011 yılında temeli atılan müze binası açılışı 28
						Aralık 2014 tarihinde yapılmıştır. Dünyanın ikinci büyük mozaik
						koleksiyonu olarak değerlendirilen eserler 3 bin metrekare alanda
						sergilenmektedir.
						<br></br>
						<br></br>
						Yeni Müze binasında Prehistorik, Paleolitik Kültür (Üçağızlı
						Mağarası Canlandırması), Amuk Kültürü (Amik Ovası Höyük Eserleri),
						Helenistik Dönem (Antakya'nın Kuruluşu), Roma Dönemi (Mozaikler),
						Nekropol Kültürü (Lahitler), Bizans Dönemi (Mozaikler), Hatay Orta
						Çağ Dönemi ve Dinler, Hatay Arkeolojisi tarihi, Güncel
						kazılar/sergiler olmak üzere dokuz farklı temada 10 bin 700
						metrekarelik sergileme alanına sahiptir.
					</div>
				</div>
				<a
					href='https://sanalmuze.gov.tr/muzeler/HATAY_ARKEOLOJI_MUZESI/'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>Cumhuriyet Müzesi</h1>
					<img src='https://sanalmuze.gov.tr/Resim/335420,troyamuzejpg.png' />
					<div className='museum-text'>
						Türkiye Cumhuriyeti’nin kuruluşunda 2. Türkiye Büyük Millet Meclisi
						binası olarak hizmet veren müze; Atatürk ilke ve devrimlerinin
						doğuşuna ve çok partili sisteme tanıklık edişiyle cumhuriyet
						gençliğine adandı.
						<br></br>
						<br></br>
						Bina, “Birinci Ulusal Mimarlık Akımı” öncülerinden mimar Vedat Tek
						tarafından, 1923’te Cumhuriyet Halk Partisi binası olarak inşa
						edildi. İlk Türkiye Büyük Millet Meclisi binasının meclise yetersiz
						gelmesi nedeniyle Atatürk’ün talimatıyla meclis binası olarak
						düzenlendi. 18 Ekim 1924’ten itibaren de meclis binası olarak hizmet
						vermeye başladı. Selçuklu ve Osmanlı bezeme motiflerinin yer aldığı
						tavan süslemeleri; kemer, saçak ve çinileriyle cumhuriyet dönemi
						mimarisini yansıtan bu yapı, işlevini 1960 yılında kadar sürdürdü.
						<br></br>
						<br></br>
						Bu dönemde cumhuriyetin gelişimine, çağdaş yasaların çıkarılmasına,
						uluslararası antlaşma ve çok partili sisteme geçiş sürecine tanıklık
						etti. 1981 yılından itibaren Cumhuriyet Müzesi olarak hizmet veren
						binada; ilk üç cumhurbaşkanı dönemini yansıtan olaylar, fotoğraflar,
						cumhurbaşkanlarının özel eşyalarıyla ve dönemin meclisinde alınan
						karar ve kanunlar sergileniyor.
						<br></br>
						<br></br>
						Bu eserler arasında Atatürk’ün 10. Yıl Nutku’nu okuduğu mikrofon da
						yer alıyor. Türkiye’nin ilk Çocuk Dostu Müzesi olan Cumhuriyet
						Müzesi’nde çocuklar için özel bir anlatım üslubu tercih edildi.
					</div>
				</div>
				<a
					href='https://sanalmuze.gov.tr/Resim/335412,cumhuriyetmuzejpgjpg.png'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>

				<div className='museum-container'>
					<h1 className='museum-title'>İzmir Kent ve Ulaşım Sergisi</h1>
					<img src='http://www.gunaydinaliaga.com/d/news/26155.jpg' />
					<div className='museum-text'>
						Kent tarihi ve kültürü açısından önemli çalışmalar gerçekleştiren
						İzmir Büyükşehir Belediyesi Ahmet Piriştina Kent Arşivi ve Müzesi,
						şimdi de İzmir'deki ulaşım tarihi ile ilgili önemli bir sergiye imza
						attı. İzmir'in ulaşım tarihi, “Günlük Yaşam”, “Demiryolu”, “Deniz”,
						“Hava” ve “Kara” ulaşımı olmak üzere beş ayrı bölümde anlatılacak.
						<br></br>
						<br></br>
						Sergide eski otobüs maketleri, 1974 yılında açılan Teleferik'in 1
						numaralı vagonu, 1960 model Anadol, 1957 model BMW motosiklet, 1939
						Model Chrysler makam aracı, 1940 yılında Aysel Hitay tarafından
						kullanılan bir bisiklet, Gölcük ve Yalova vapurlarının çan, bröve ve
						pusulalı gemi dümeni, 1910 ve 1920'li yıllara ait kentin cadde ve
						ulaşım araçlarını gösteren fotoğraflar yer alıyor.
						<br></br>
						<br></br>
						Sergide ayrıca Steoskop ile 19. yüzyıldan kalma tren istasyonlarının
						görülebileceği bir bölüm yer alıyor.
					</div>
				</div>
				<a
					href='https://www.apikam.org.tr/tr/Apikam-Arsiv/1/53'
					target='_blank'
					rel='noreferrer'
				>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>Tıkla ve Müzeyi Gez</div>
					</div>
				</a>
			</div>
		);
	}
}

export default MuseumList;
