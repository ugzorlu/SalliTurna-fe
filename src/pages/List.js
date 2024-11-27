import React, { Component } from 'react'

/* External Libraries */
import { Helmet } from 'react-helmet-async'
// import AdSense from 'react-adsense'

import Movie1 from '../assets/movies/3idiots-min.jpg'
import Movie2 from '../assets/movies/imjuli-min.jpeg'
import Movie3 from '../assets/movies/cinemaparadiso-min.jpeg'
import Movie4 from '../assets/movies/yesman-min.jpg'
import Movie5 from '../assets/movies/groundhogday-min.jpg'
import Movie6 from '../assets/movies/acrosstheuniverse-min.jpg'
import Movie7 from '../assets/movies/limonata-min.jpg'
import Movie8 from '../assets/movies/myneighbortotoro-min.jpg'
import Movie9 from '../assets/movies/darjeeling-min.jpg'
import Movie10 from '../assets/movies/soundofnoise-min.jpg'
import Movie11 from '../assets/movies/littlemisssunshine-min.jpeg'
import Movie12 from '../assets/movies/korkuyorumanne-min.jpg'

import Museum1 from '../assets/museums/arkassanat-min.jpeg'
import Museum2 from '../assets/museums/oyuncakmuzesi-min.jpg'
import Museum3 from '../assets/museums/ayasofya-min.jpg'
import Museum4 from '../assets/museums/gobeklitepe-min.jpg'
import Museum5 from '../assets/museums/efes-min.png'
import Museum6 from '../assets/museums/anadolumedeniyetleri-min.jpg'
import Museum7 from '../assets/museums/troya-min.png'
import Museum8 from '../assets/museums/hatayarkeoloji-min.png'
import Museum9 from '../assets/museums/cumhuriyetmuzesi-min.jpg'
import Museum10 from '../assets/museums/izmirkentveulasim-min.jpg'
import '../styles/List.scss'

class MuseumList extends Component {
    render() {
        return (
            <div className="museumlist-container">
                <div className="museum-container">
                    <h1 className="museum-title">Arkas Sanat Merkezi</h1>
                    <img src={Museum1} />
                    <div className="museum-text">
                        Arkas Sanat Merkezi, Arkas Holding Yönetim Kurulu
                        Başkanı Lucien Arkas’ın kişişel ilgisi ve profesyonel
                        yaklaşımı ile oluşan Arkas Koleksiyonu’nu sanatseverler
                        ile paylaşmak isteği doğrultusunda kuruldu.
                        <br></br>
                        <br></br>
                        İzmir’de döneminin en güzel yapılarından biri olarak
                        1875 yılından beri hizmet veren Fransız Fahri
                        Konsolosluk binasının denize bakan bölümü, Fransız
                        Hükümeti tarafından 20 yıllığına, kültür ve sanat amaçlı
                        kullanım için Arkas Holding’e tahsis edildi. Bir yıl
                        süren restorasyon çalışmalarının ardından bina Kasım
                        2011’de Arkas Sanat Merkezi adıyla açıldı.
                        <br></br>
                        <br></br>
                        Çağdaş donanımlı bir sanat merkezine dönüştürülen iki
                        katlı tarihi binada, 9 adet sergi odası ve 1 atölye
                        bulunuyor. Arkas Sanat Merkezi, İzmir’e kazandırılmış
                        tarihi bir bina olmasının yanında, birçok uluslararası
                        ressamın eserlerinin sergilendiği ilk sanat merkezi olma
                        özelliği de taşıyor.
                    </div>
                </div>
                <a
                    className="museum-link"
                    href="https://arkassanatmerkezi.com/sanal-gezinti/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">İstanbul Oyuncak Müzesi</h1>
                    <img src={Museum2} />
                    <div className="museum-text">
                        İstanbul Oyuncak Müzesi 23 Nisan 2005 yılında şair/yazar
                        Sunay Akın tarafından kurulmuştur. 1700’lü yıllardan
                        günümüze oyuncak tarihinin en gözde örneklerinin
                        sergilendiği müze tarihi bir köşkte konumlanmıştır.
                    </div>
                </div>
                <a
                    href="https://istanbuloyuncakmuzesi.com/pages/360-tur"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
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

                <div className="museum-container">
                    <h1 className="museum-title">Ayasofya Müzesi</h1>
                    <img src={Museum3} />
                    <div className="museum-text">
                        Ayasofya, dünya mimarlık tarihinin günümüze kadar ayakta
                        kalmış en önemli yapıları arasında yer alıyor. Ayasofya
                        916 yıl kilise, 481 yıl cami, 1935 yılından bu yana da
                        müze olarak kullanılıyor.
                    </div>
                </div>
                <a
                    href="http://www.3dmekanlar.com/tr/ayasofya.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">Göbeklitepe Örenyeri</h1>
                    <img src={Museum4} />
                    <div className="museum-text">
                        Yerleşim yeri olarak kullanılmadığı bilinen ve tapınmaya
                        hizmet eden Göbeklitepe, şaşırtıcı anıtsal mimarisiyle
                        2018 yılında UNESCO Dünya Mirası Listesi'ne girdi.
                        Türkiye'de de’’ 2019 Göbeklitepe Yılı” ilan edildi.
                        Henüz küçük bir bölümü çıkarılan Göbeklitepe, yaklaşık
                        12 bin yıllık geçmişiyle insanlık tarihini değiştirdi.
                        Dünyanın bilinen en eski ve en büyük tapınma (kült)
                        merkezi sayılan Göbeklitepe ile dinsel inanışın yerleşik
                        yaşama geçişteki etkisi kanıtlandı.
                        <br></br>
                        <br></br>
                        Harran Ovası'na hakim bu tarih öncesi yerleşimin sınırlı
                        bir bölümü kazılsa da, sıra dışı bulguları Neolitik
                        Çağ'la ilgili pek çok bilgiyi altüst etti. Şanlıurfa'nın
                        Örencik Köyü yakınlarındaki Göbeklitepe kazılarını
                        1995'te Alman arkeolog Prof. Dr. Klaus Schmidt başlattı
                        ve 2014'deki ölümüne dek 20 yıl sürdürdü.
                        <br></br>
                        <br></br>
                        Göbeklitepe; avcı-toplayıcı yaşamı, tarım ve
                        hayvancılığa geçişi, tapmak mimarisi ve sanatın doğuşunu
                        anlamamıza önemli katkılar sağladı. Varlığını M.Ö. 8 bin
                        dolaylarına kadar sürdürdükten sonra terk edildi. Başka
                        ya da benzer amaçlarla kullanılmadı.
                        <br></br>
                        <br></br>
                    </div>
                </div>
                <a
                    href="https://sanalmuze.gov.tr/TR-292217/sanliurfa-gobeklitepe-orenyeri.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">Efes Müzesi</h1>
                    <img src={Museum5} />
                    <div className="museum-text">
                        Efes Müzesi T.C. Kültür Bakanlığı adına Efes'teki
                        arkeolojik araştırmalardan, düzenleme, kontrol ve koruma
                        çalışmalarından sorumlu olan Efes Müzesi, Efes ve yakın
                        çevresinde bulunan Miken, Arkaik, Klasik, Hellenistik,
                        Roma, Bizans, Selçuklu ve Osmanlı devirlerine ait önemli
                        eserlerin yanı sıra kültürel faaliyetleri ve ziyaretçi
                        kapasitesi ile de Türkiye'nin en önemli müzelerinden
                        biridir.
                        <br></br>
                        <br></br>
                        Efes'teki ilk arkeolojik kazılardan sonra 1929 yılında
                        depo işlevinde kurulmuş, 1964 yılında yeni bölümün
                        inşası ile genişleyen Efes Müzesi sonraki yıllarda sergi
                        değişiklikleri ve yeni ekler ile sürekli gelişmiştir.
                        Efes Müzesi'nin ağırlıklı olarak bir antik kentin
                        eserlerini sergileyen müze olması nedeniyle kronolojik
                        ve tipolojik bir sergileme yerine eserlerin buluntu
                        yerlerine göre sergilenmeleri tercih edilmiştir. Buna
                        göre salonlar Yamaç Evler ve Ev Buluntuları Salonu,
                        Sikke ve Hazine Bölümü, Mezar Buluntuları Salonu, Efes
                        Artemisi Salonu, İmparator Kültleri Salonu olarak
                        düzenlenmiştir.
                        <br></br>
                        <br></br>
                        Bu salonların yanı sıra müze iç ve orta bahçelerinde
                        çeşitli mimari ve heykeltraşlık eserleri bahçe dekoru
                        içinde ve uyumlu olarak sergilenmektedir. İki büyük
                        Artemis heykeli, Eros başı, Yunuslu Eros heykelciği,
                        Sokrates başı, Efes Müzesi'nin dünyaca tanınmış ünlü
                        eserlerinden bazılarıdır. Efes Müzesi koleksiyonlarında
                        halen yaklaşık 50.000 eser bulunmaktadır. Bu sayı her
                        yıl sürdürülen arkeolojik kazılar sonucu ortaya
                        çıkarılan veya çevre halkının bağış yoluyla getirdiği
                        eserler ile artmakta, müze koleksiyonları
                        zenginleşmektedir.
                        <br></br>
                        <br></br>
                        Bu eserlerin kısa süre içinde bilim dünyasının ve
                        insanlığın hizmetine sunulması düşüncesiyle Efes
                        Müzesi'nde "Yeni Buluntular Salonu" oluşturulmuştur.
                        Ancak, bu salon her zaman yeterli gelmemekte, diğer
                        salonlardaki sergilemelerin de yeni buluntular ışığında
                        ve çağdaş müzecilik anlayışına uygun olarak yenilenmesi
                        gerekmektedir. Bu anlayışa uygun olarak Yamaç Evler ve
                        Ev Buluntuları Salonunda yapılan yeni düzenlemede
                        buluntu gruplarını birarada sergileyerek konu bütünlüğü
                        oluşturulması amaçlanmıştır.
                    </div>
                </div>
                <a
                    href="https://sanalmuze.gov.tr/TR-259959/efes-muzesi---izmir.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">
                        Anadolu Medeniyetleri Müzesi
                    </h1>
                    <img src={Museum6} />
                    <div className="museum-text">
                        Paleolitik Çağ’dan itibaren Anadolu topraklarının özgün
                        eserlerine ev sahipliği yapan Anadolu Medeniyetleri
                        Müzesi, iki tarihi binadan oluşmaktadır. Bunlar Osmanlı
                        Dönemi yapıları olan Mahmutpaşa Bedesteni ve Kurşunlu
                        Han’dır. 2014’te restore edilerek yenilenen bu müzede
                        sanal turlar, canlandırmalar ve Göbeklitepe’deki T
                        biçimli dikme replikalar ve eserlerle birlikte tarihe
                        bir yolculuk yapmanızı sağlamaktadır.
                    </div>
                </div>
                <a
                    href="https://sanalmuze.gov.tr/TR-296818/ankara-anadolu-medeniyetleri-muzesi.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
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

                <div className="museum-container">
                    <h1 className="museum-title">Troya Müzesi</h1>
                    <img src={Museum7} />
                    <div className="museum-text">
                        Troya Müzesi, Çanakkale İli, Merkez İlçesi’ne bağlı
                        Tevfikiye Köyü sınırları içinde yer alan, UNESCO’nun
                        1998 yılında Dünya Kültür Mirası Listesi’ne aldığı,
                        Troya Antik Kenti girişinde yer almaktadır. 3.000 m2
                        sergi salonu, 11.200 m2 kapalı alana sahiptir. İnşasına
                        2013 yılında başlanılmış, 2015 yılında duran çalışmalara
                        2017 yılından bu yana devam edilmiş ve 2018 yılı Ekim
                        ayında açılmıştır.
                        <br></br>
                        <br></br>
                        Müze ziyareti rampadan inerken başlamaktadır. Rampanın
                        duvarlarında bulunan nişlerde Troya’nın farklı
                        katmanları; mezar taşları, büyük boy heykeller, sahne
                        canlandırmaları ve büyük boy fotoğraflarla
                        anlatılmaktadır. Müzenin giriş alanı olan, Troas ve
                        çevresini konu alan sirkülasyon bandında ise devam eden
                        sergi katları öncesinde ziyaretçiye bir oryantasyon
                        sağlamak amacıyla arkeoloji bilimi; arkeolojik ve
                        arkeometrik tarihleme yöntemleri, “neolitik, kalkolitik,
                        tunç çağı, demir çağı, höyük, restorasyon, konservasyon”
                        gibi terimler şemalar, çizimler, metinler ve interaktif
                        yöntemlerle aktarılmaktadır.
                        <br></br>
                        <br></br>
                        Eserler taş (mermer), heykel, lahit, yazıt, sunak, mil
                        taşı, paleolitik balta ve kesiciler vb., pişmiş toprak
                        seramikler, metal kaplar; altınlar, silahlar, sikkeler,
                        kemik obje ve aletler, cam bilezikler, süs eşyaları,
                        bardak, koku şişeleri, gözyaşı şişelerinden vb.
                        oluşmaktadır. Müze bahçesinde, peyzaj ile birlikte taş
                        eserler de, lahit, sütun, steller, sütun başlıkları vb.
                        bütünlük oluşturacak şekilde sergilenmektedir.
                        <br></br>
                        <br></br>
                        Müzede ayrıca görsel grafik tasarımlarla birlikte
                        diorama (anın veya hikâyenin ışık oyunlarının da
                        yardımıyla üç boyutlu olarak modellenmesi) dokunmatik
                        ekran ve animasyonlarla sergi ile anlatımları
                        yapılmaktadır
                    </div>
                </div>
                <a
                    href="https://sanalmuze.gov.tr/muzeler/canakkale-troya-muzesi/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">Hatay Arkeoloji Müzesi</h1>
                    <img src={Museum8} />
                    <div className="museum-text">
                        MÖ 4 binli yıllardan başlayan tarihi geçmişi ile Hatay,
                        birçok dönemin ve medeniyetin kültür ve tarihi
                        vesikalarını bünyesinde toplayan bir şehirdir. Hatay’da
                        kazı çalışmaları 1932 yılında başlamıştır. 1933–1938
                        yılları arasında Amik Ovası'nda Cüdeyde, Dehep,
                        Çatalhöyük ve Tainat'ta, Chicago Üniversitesi Chicago
                        OrientalInstitute tarafından kazı çalışmaları
                        yapılmıştır. 1936 yılında, British Museum adına Sir
                        Leonard Wolley, Samandağı El-Mina Mevkii'nde, 1937'den
                        1948 senesine kadar da aralıklarla, Açana Höyüğü'nde
                        hafriyat ve kazı çalışmaları yürütülmüştür.
                        <br></br>
                        <br></br>
                        1932-1939 yıllarında Princeton Üniversitesi’nin yaptığı
                        araştırmalarla müzenin esas zenginliğini oluşturan
                        mozaikler ortaya çıkartılmıştır. Bu zenginlikler,
                        merkezi Antakya’da olmak üzere Harbiye, Narlıca,
                        Güzelburç, Samandağ ve çevresinde yapılan kazılar sonucu
                        çıkartılan ve koleksiyonu tamamlayan mozaiklerdir.
                        <br></br>
                        <br></br>
                        Antakya’da yürütülen 1932-1939 yılı kazı çalışmalarında
                        çoğu Roma Dönemi'ne tarihlendirilen mimari ve diğer
                        buluntular kentin zenginliğini ve ihtişamını ortaya
                        sermiştir. The Committeeforthe Excavationandits Vicinity
                        adlı komitenin yaptığı kazı çalışmaları başta Antakya,
                        Harbiye olmak üzere Samandağ’da Seleuceia Pieria'da
                        sürdürülmüş ve kazılarda ortaya çıkan zengin mozaik eser
                        koleksiyonu bugün dünyanın yaklaşık 20 müzesine ve özel
                        koleksiyonlarına dağılmış durumdadır. Antiokheia kökenli
                        birçok eser bugün Hatay Arkeoloji Müzesi’ nin yanı sıra
                        Princeton Universitesi Sanat Müzesi (ABD), Worcester
                        Müzesi (ABD), Louvre (Fransa) gibi müzelerde saklanmakta
                        veya sergilenmektedir. Kazılarda çıkan eserlerin tek
                        yerde toplanması için başlayan çalışmanın ardından 1939
                        yılında tamamlanan Hatay Arkeoloji Müzesi, 23 Temmuz
                        1948 yılında Hatay’ın Anavatana katılışının 10’uncu
                        yılında ziyaretçilere açılmıştır. Müzenin sekiz sergi
                        salonundan biri olan Lahit Salonu 2000 yılında
                        tamamlanarak teşhire sunulmuştur. Müzede yer alan sergi
                        salonlarına ek olarak müze bahçesinde de eserler yer
                        almaktadır. Beş deposu bulunan müzenin 1140 metrekarelik
                        bir oturma alanı mevcuttur. Eserler 984 metrekarelik bir
                        alanda sergilenmektedir.
                        <br></br>
                        <br></br>
                        1939 yılında açılan ve dönemin koşullarında ve mevcut
                        eserlere göre yapılan müze binasının artık günün
                        koşullarına uymaması, modern müzeciliğin ihtiyaçlarına
                        cevap vermemesi nedeniyle yeni müze yapılması
                        çalışmalarına başlanmıştır. Bakanlığımız Kültür
                        Varlıkları ve Müzeler Genel Müdürlüğü ve Hatay Valiliği
                        koordinesinde yürütülen projede 26 Mayıs 2011 yılında
                        temeli atılan müze binası açılışı 28 Aralık 2014
                        tarihinde yapılmıştır. Dünyanın ikinci büyük mozaik
                        koleksiyonu olarak değerlendirilen eserler 3 bin
                        metrekare alanda sergilenmektedir.
                        <br></br>
                        <br></br>
                        Yeni Müze binasında Prehistorik, Paleolitik Kültür
                        (Üçağızlı Mağarası Canlandırması), Amuk Kültürü (Amik
                        Ovası Höyük Eserleri), Helenistik Dönem (Antakya'nın
                        Kuruluşu), Roma Dönemi (Mozaikler), Nekropol Kültürü
                        (Lahitler), Bizans Dönemi (Mozaikler), Hatay Orta Çağ
                        Dönemi ve Dinler, Hatay Arkeolojisi tarihi, Güncel
                        kazılar/sergiler olmak üzere dokuz farklı temada 10 bin
                        700 metrekarelik sergileme alanına sahiptir.
                    </div>
                </div>
                <a
                    href="https://sanalmuze.gov.tr/TR-261188/hatay-arkeoloji-muzesi.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">Cumhuriyet Müzesi</h1>
                    <img src={Museum9} />
                    <div className="museum-text">
                        Türkiye Cumhuriyeti’nin kuruluşunda 2. Türkiye Büyük
                        Millet Meclisi binası olarak hizmet veren müze; Atatürk
                        ilke ve devrimlerinin doğuşuna ve çok partili sisteme
                        tanıklık edişiyle cumhuriyet gençliğine adandı.
                        <br></br>
                        <br></br>
                        Bina, “Birinci Ulusal Mimarlık Akımı” öncülerinden mimar
                        Vedat Tek tarafından, 1923’te Cumhuriyet Halk Partisi
                        binası olarak inşa edildi. İlk Türkiye Büyük Millet
                        Meclisi binasının meclise yetersiz gelmesi nedeniyle
                        Atatürk’ün talimatıyla meclis binası olarak düzenlendi.
                        18 Ekim 1924’ten itibaren de meclis binası olarak hizmet
                        vermeye başladı. Selçuklu ve Osmanlı bezeme motiflerinin
                        yer aldığı tavan süslemeleri; kemer, saçak ve
                        çinileriyle cumhuriyet dönemi mimarisini yansıtan bu
                        yapı, işlevini 1960 yılında kadar sürdürdü.
                        <br></br>
                        <br></br>
                        Bu dönemde cumhuriyetin gelişimine, çağdaş yasaların
                        çıkarılmasına, uluslararası antlaşma ve çok partili
                        sisteme geçiş sürecine tanıklık etti. 1981 yılından
                        itibaren Cumhuriyet Müzesi olarak hizmet veren binada;
                        ilk üç cumhurbaşkanı dönemini yansıtan olaylar,
                        fotoğraflar, cumhurbaşkanlarının özel eşyalarıyla ve
                        dönemin meclisinde alınan karar ve kanunlar
                        sergileniyor.
                        <br></br>
                        <br></br>
                        Bu eserler arasında Atatürk’ün 10. Yıl Nutku’nu okuduğu
                        mikrofon da yer alıyor. Türkiye’nin ilk Çocuk Dostu
                        Müzesi olan Cumhuriyet Müzesi’nde çocuklar için özel bir
                        anlatım üslubu tercih edildi.
                    </div>
                </div>
                <a
                    href="https://sanalmuze.gov.tr/TR-296703/ankara-cumhuriyet-muzesi.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>

                <div className="museum-container">
                    <h1 className="museum-title">
                        İzmir Kent ve Ulaşım Sergisi
                    </h1>
                    <img src={Museum10} />
                    <div className="museum-text">
                        Kent tarihi ve kültürü açısından önemli çalışmalar
                        gerçekleştiren İzmir Büyükşehir Belediyesi Ahmet
                        Piriştina Kent Arşivi ve Müzesi, şimdi de İzmir'deki
                        ulaşım tarihi ile ilgili önemli bir sergiye imza attı.
                        İzmir'in ulaşım tarihi, “Günlük Yaşam”, “Demiryolu”,
                        “Deniz”, “Hava” ve “Kara” ulaşımı olmak üzere beş ayrı
                        bölümde anlatılacak.
                        <br></br>
                        <br></br>
                        Sergide eski otobüs maketleri, 1974 yılında açılan
                        Teleferik'in 1 numaralı vagonu, 1960 model Anadol, 1957
                        model BMW motosiklet, 1939 Model Chrysler makam aracı,
                        1940 yılında Aysel Hitay tarafından kullanılan bir
                        bisiklet, Gölcük ve Yalova vapurlarının çan, bröve ve
                        pusulalı gemi dümeni, 1910 ve 1920'li yıllara ait kentin
                        cadde ve ulaşım araçlarını gösteren fotoğraflar yer
                        alıyor.
                        <br></br>
                        <br></br>
                        Sergide ayrıca Steoskop ile 19. yüzyıldan kalma tren
                        istasyonlarının görülebileceği bir bölüm yer alıyor.
                    </div>
                </div>
                <a
                    href="https://www.apikam.org.tr/tr/Sergiler/kent-ve-ulasim/3/117?tab=70"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="topic-source-link">
                        <div className="topic-source-link-text">
                            Tıkla ve Müzeyi Gez
                        </div>
                    </div>
                </a>
            </div>
        )
    }
}

class MovieList extends Component {
    render() {
        return (
            <>
                <Helmet>
                    <title>Kendini İyi Hisset Filmleri | Şallı Turna</title>
                    <meta
                        name="description"
                        content="Büyük meseleleri bir süreliğine kenara bıraktırıp hayata daha olumlu baktıran, iyi hissettiren filmleri derledik."
                    />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@salliturna" />
                    <meta name="twitter:creator" content="@salliturna" />
                    <meta name="twitter:title" content="Şallı Turna" />
                    <meta
                        name="twitter:description"
                        content="Büyük meseleleri bir süreliğine kenara bıraktırıp hayata daha olumlu baktıran, iyi hissettiren filmleri derledik."
                    />
                    <meta
                        name="twitter:image"
                        content="https://salliturna.com.tr/assets/movies/kendiniiyihissetfilmleri.jpg"
                    />
                    <meta
                        property="og:title"
                        content="Kendini İyi Hisset Filmleri | Şallı Turna"
                    />
                    <meta property="og:type" content="article" />
                    <meta
                        property="og:image"
                        content="https://salliturna.com.tr/assets/movies/kendiniiyihissetfilmleri.jpg"
                    />
                    <meta
                        property="og:url"
                        content="https://salliturna.com.tr/iyi-hisset-filmleri"
                    />
                    <meta
                        property="og:description"
                        content="Büyük meseleleri bir süreliğine kenara bıraktırıp hayata daha olumlu baktıran, iyi hissettiren filmleri derledik."
                    />
                </Helmet>
                <div className="movielist-container">
                    <h1 className="movielist-title">
                        Kendini İyi Hisset Filmleri
                    </h1>
                    <div className="movie-container">
                        <h1 className="movie-title">3 idiots</h1>
                        <img src={Movie1} />
                        <div className="movie-tag">
                            Süre: 2 saat 50 dk.
                            <br></br>
                            Dil: Hintçe
                            <br></br>
                            Yıl: 2009
                            <br></br>
                            Yönetmen: Rajkumar Hirani
                            <br></br>
                            Oyuncular: Aamir Khan, Boman Irani, Kareena Kapoor,
                            Madhavan, Sharman Joshi
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Hindistan'ın en önemli bir okulunda mühendislik
                            okuyan ve okulun yurdunda aynı odada kalan üç
                            öğrenci ve profesörleri arasında yaşananlar, dostluk
                            kavramını beyaz perdeye yansıtırken eğitim sistemini
                            de eğlenceli bir şekilde eleştirir niteliktedir.
                            <br></br>
                            <br></br>
                            Pek de yabancısı olmadığımız yarışa dayalı eğitim
                            sistemini eğlenceli bir şekilde eleştiren
                            senaryosuyla Aamir Khan, haklarını arayabilen
                            bireylerin değişim ve gelişim için ne dönemli önemli
                            olduğunu hatırlatıyor.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">Im Juli.</h1>
                        <img src={Movie2} />
                        <div className="movie-tag">
                            Süre: 1 saat 39 dk.
                            <br></br>
                            Dil: Almanca
                            <br></br>
                            Yıl: 2000
                            <br></br>
                            Yönetmen: Fatih Akın
                            <br></br>
                            Oyuncular: Moritz Bleibtreu, Christiane Paul, Mehmet
                            Kurtuluş, İdil Üner
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Daniel, öğrencileriyle yakın ilişki kurma konusunda
                            isteksiz davranan, kendi dünyasına gömülü genç bir
                            öğretmendir. Juli ile tanıştıktan sonra yaşamının
                            yeni bir yön alabileceğine inanmaya başlar. Çünkü
                            kadın, Daniel'in falına bakmış ve hayatının aşkını
                            pek yakında bulacağı konusunda onu ikna etmiştir.
                            Bir süre sonra adam, bir Türk kızı olan Melek'e
                            tutulur ve peşinden Türkiye'ye gitmeye karar verir.
                            Juli ise Daniel'in peşindedir ve birlikte bir dolu
                            süpriz ve tesadüflerle dolu keyifli bir yolculuğa
                            başlarlar.
                            <br></br>
                            <br></br>
                            Fatih Akın’ın Im Juli.'si macera dolu bir yolculuk
                            sosuyla eğlence, heyecan, aşk ve metafor dolu bir
                            sunum hazırlıyor izleyicilerine.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">Cinema Paradiso</h1>
                        <img src={Movie3} />
                        <div className="movie-tag">
                            Süre: 1 saat 26 dk.
                            <br></br>
                            Dil: İtalyanca
                            <br></br>
                            Yıl: 1988
                            <br></br>
                            Yönetmen: Giuseppe Tornatore
                            <br></br>
                            Oyuncular: Salvatore Cascio, Philippe Noiret, Marco
                            Leonardi, Jacques Perrin, Agnese Nano
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Artık ünlü bir yönetmen olmuş Salvatore, 30 yıl
                            sonra bir arkadaşının öldüğü haberi üzerine doğduğu
                            kasabaya geri döner. Kasabaya geldiğinde eski
                            anıları canlanan Salvatore, Cinema Paradiso isimli
                            sinemada projeksiyoncu olarak çalışan Alfred ile
                            ilişkilerini hatırlar. Küçük bir çocuk olan
                            Salvatore, günlerini Alfred’in yanında geçirmekte,
                            filmlerle ilgili konuşmakta ve Alfred’in sinema
                            konusunda deneyim ve bilgilerinden yararlanmaktadır.
                            Babacan tavırlarıyla Salvatore’nin hayatında önemli
                            bir yere sahip olacak Alfred sayesinde sinemaya olan
                            aşkını ve tutkusu keşfedecektir.
                            <br></br>
                            <br></br>
                            Cinema Paradiso, ilk sahnesinden sonuna, bizlere
                            sinemanın ne kadar vazgeçilmez bir eğlence kaynağı
                            olduğunu gençliği ve nostaljiyi harika anlatarak
                            gösteriyor.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">Yes Man</h1>
                        <img src={Movie4} />
                        <div className="movie-tag">
                            Süre: 1 saat 44 dk.
                            <br></br>
                            Dil: İngilizce
                            <br></br>
                            Yıl: 2008
                            <br></br>
                            Yönetmen: Peyton Reed
                            <br></br>
                            Oyuncular: Jim Carrey, Zooey Deschanel, Bradley
                            Cooper, Terence Stamp
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Kendi kendine yardım programına yazılan Carl Allen
                            adlı bir adamın serüvenini takip ediyoruz. Söz
                            konusu program tek ve basit bir ilkeye
                            dayanmaktadır: Her şeye “evet” demek. İlk başta,
                            evet gücünü açığa çıkarmak Carl’ın hayatını
                            inanılmaz ve beklenmedik biçimlerde değiştirir, ama
                            çok geçmeden anlar ki hayatını sonsuz olasılıklara
                            açmanın bazı olumsuzlukları da olabilmektedir.
                            <br></br>
                            <br></br>
                            Listemizin en hafif yapımlarından biri olan Yes
                            Man'de Jim Carrey'i, hayatta her şeye evet diyerek
                            içinde bulunduğu depresif durumdan kurtulan ve
                            sonrasında nelere evet demesi gerektiğini yavaş
                            yavaş öğrenen bir adam rolünde izliyoruz.
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

                    <div className="movie-container">
                        <h1 className="movie-title">Groundhog Day</h1>
                        <img src={Movie5} />
                        <div className="movie-tag">
                            Süre: 1 saat 42 dk.
                            <br></br>
                            Dil: İngilizce
                            <br></br>
                            Yıl: 1993
                            <br></br>
                            Yönetmen: Harold Ramis
                            <br></br>
                            Oyuncular: Bill Murray, Andie MacDowell, Stephen
                            Tobolowsky
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Ekranların sevilen spikeri Phil Connors(Bill Murray)
                            kameraların dışında oldukça kibirli ve kendini
                            beğenmiş biridir. Hiç sevmediği kırsal kasabaların
                            birine haber icabı gitmektedir. Bir günlüğüne
                            kalacaktır ancak bir kar fırtınası bulundukları
                            yerde kalmalarına sebep olur. Takılı kaldıkları tek
                            şey mekan değildir, zamanda da takılı kalmışlardır.
                            <br></br>
                            <br></br>
                            Evlere sıkışıp kaldığımız, birbirine benzeyerek
                            geçip giden şu salgın günlerinde hayatlarımızla
                            benzerlikler bulabileceğimiz bir kurgu-zaman filmi
                            Groundhog Day. Daha önce izlemiş olanların dahi
                            tekrar izlemesi ve keyiflenmeleri için bundan daha
                            uygun bir dönem olmadığını düşünüyoruz.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">Across The Universe</h1>
                        <img src={Movie6} />
                        <div className="movie-tag">
                            Süre: 2 saat 13 dk.
                            <br></br>
                            Dil: İngilizce
                            <br></br>
                            Yıl: 2007
                            <br></br>
                            Yönetmen: Julie Taymor
                            <br></br>
                            Oyuncular: Evan Rachel Wood, Jim Sturgess, Joe
                            Anderson (VI), Dana Fuchs
                            <br></br>
                        </div>
                        <div className="movie-text">
                            1960'ların savaş karşıtı gösteriler ve rock n roll
                            ile geçen fırtınalı atmosferinde Liverpool’dan yola
                            çıkıp New York’a giden Jude'un yolu Lucy ile
                            kesişir. Arkadaş grubu ve çevrelerindeki
                            müzisyenlerle beraber savaş karşıtı gösterilerin bir
                            parçası olurlar. Çiftimizi dış koşullar ayrı düşürse
                            de bir araya gelebilmeni yollarını arar dururlar.
                            <br></br>
                            <br></br>
                            Beatles’ın 33 şarkısının hikayeleri birleştirilerek
                            yazılan senaryosu ve müzikalitesiyle tam bir saygı
                            duruşu. Klişe sayılabilecek konusunu farklı bir
                            atmosferde anlatmayı başarabilen ender filmlerden.
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

                    <div className="movie-container">
                        <h1 className="movie-title">Limonata</h1>
                        <img src={Movie7} />
                        <div className="movie-tag">
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
                        <div className="movie-text">
                            Makedonya'da yaşayan Suat eski bir tır şoförüdür ve
                            ölümcül bir hastalık nedeniyle yatağa düşer. Oğlu
                            Sakip'i yanına çağırır ve ölmeden önceki tek
                            arzusunu açıklar. Ölmeden önce tek dileği Selim
                            adındaki ikinci çocuğunu bulup ondan helallik
                            istemektir. Buna göre oğlu Sakip'ten İstanbul'a
                            gidip kardeşini bulmasını ister. Sakip babasının
                            emektar arabasına atlayıp elinde yalnızca kardeşinin
                            adı ve eski bir adresle İstanbul yollarına düşer.
                            <br></br>
                            <br></br>
                            Ali Atay ilk yönetmenlik denemesinde insanın en
                            insan hallerini en doğal şekilde işlemeyi başarıyor
                            ve bize sıcacık detaylarla bezeli bir yol filmi
                            armağan ediyor.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">My Neighbor Totoro</h1>
                        <img src={Movie8} />
                        <div className="movie-tag">
                            Süre: 1 saat 28 dk.
                            <br></br>
                            Dil: Japonca
                            <br></br>
                            Yıl: 1988
                            <br></br>
                            Yönetmen: Hayao Miyazaki
                            <br></br>
                            Seslendirenler: Shigesato Itoi, Noriko Hidaka, Chika
                            Sakamoto, Pat Carroll
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Bir üniversite profesörü olan babalarıyla Mei ve
                            Satsuki, bir hastanede tedavi gören annelerine daha
                            yakın olmak için bir köye taşınırlar. Çok geçmeden
                            küçük kardeş Mei orman ruhlarını görmeye başlar ve
                            en sonunda Totoro ile tanışır. İki kız kardeş,
                            annelerinin hastalığı, günlük olaylar Totoro ve
                            çeşitli orman ruhuyla birlikte değişik bir hal
                            almaya başlar.
                            <br></br>
                            <br></br>
                            Hayao Miyazaki’nin başyapıtı My Neighbor Totoro;
                            büyük özen ile hazırlanmış, sayılamayacak kadar çok
                            ayrıntısıyla bizi masalsı bir dünyaya götürüyor.
                            Çocukluk hislerinin evrensel olduğunu tekrar
                            hatırlatan bu animasyon, izleyene yaşama sevinci
                            aşılaması sebebiyle listemizde.
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

                    <div className="movie-container">
                        <h1 className="movie-title">The Darjeeling Limited</h1>
                        <img src={Movie9} />
                        <div className="movie-tag">
                            Süre: 1 saat 31 dk.
                            <br></br>
                            Dil: İngilizce
                            <br></br>
                            Yıl: 2007
                            <br></br>
                            Yönetmen: Wes Anderson
                            <br></br>
                            Oyuncular: Adrien Brody, Owen Wilson, Jason
                            Schwartzman, Amara Karan
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Wes Anderson kendine has dokunuşunu Hindistan'a
                            taşıyor ve birbirine yabancılaşmış Amerikalı üç
                            kardeşin ruhani arayışlarını sürdürdüğü tren
                            yolculuğuna bizi de dahil ediyor.
                            <br></br>
                            <br></br>
                            Hint tanrılarının renkli tablolarını andıran
                            kareleri, zekice hazırlanmış komik diyalogları ve
                            ünlü oyuncu kadrosuyla The Darjeeling Limited bizi
                            bulunduğunuz yerden alıp başka diyarlara götürmeyi
                            vaadediyor.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">Sound of Noise</h1>
                        <img src={Movie10} />
                        <div className="movie-tag">
                            Süre: 1 saat 42 dk.
                            <br></br>
                            Dil: İsveççe
                            <br></br>
                            Yıl: 2012
                            <br></br>
                            Yönetmenler: Ola Simonsson, Johannes Stjaerne
                            Nilsson
                            <br></br>
                            Oyuncular: Bengt Nilsson, Sanna Persson, Magnus
                            Börjeson, Fredrik Myhr, Johannes Björk, Marcus
                            Haraldson Boij, Anders Vestergard
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Amadeus isimli polis memuru adından da tahmin
                            edilebileceği gibi müzisyen bir aileye doğmuştur
                            ancak kendisi ironik şekilde müzikten nefret eder.
                            Bu sırada şehri bir müzik aleti gibi kullanıp kaos
                            çıkaran ilginç bir anarşist grupla yolları kesişir.
                            <br></br>
                            <br></br>
                            İsveç - Fransa ortak yapımı bu özgün
                            komedi-polisiye, müziğin ve sanatın farklı yolları
                            olabileceğini oldukça eğlenceli şekilde bizlere
                            gösteriyor.
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

                    <div className="movie-container">
                        <h1 className="movie-title">Little Miss Sunshine</h1>
                        <img src={Movie11} />
                        <div className="movie-tag">
                            Süre: 1 saat 50 dk.
                            <br></br>
                            Dil: İngilizce
                            <br></br>
                            Yıl: 2006
                            <br></br>
                            Yönetmenler: Jonathan Dayton, Valerie Faris
                            <br></br>
                            Oyuncular: Abigail Breslin, Paul Dano, Alan Arkin,
                            Toni Collette, Steve Carell, Greg Kinnear
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Birbirleriyle bağları ve iletişimi zayıf bir ailenin
                            en küçük ve sevimli üyesi ülkenin diğer ucundaki bir
                            güzellik yarışmasına katılmak isterse ne olur?
                            Bağların kuvvetlendiği, ailenin öneminin anlaşıldığı
                            bir yolculuk olur.
                            <br></br>
                            <br></br>
                            Bağımsız sinemanın bu ikonik örneği bize içimizi
                            ısıtacak bir yol hikayesi sunuyor. Hala
                            izlemediyseniz mutlaka tavsiye ediyoruz.
                        </div>
                    </div>

                    <div className="movie-container">
                        <h1 className="movie-title">Korkuyorum Anne</h1>
                        <img src={Movie12} />
                        <div className="movie-tag">
                            Süre: 2 saat 10 dk.
                            <br></br>
                            Dil: Türkçe
                            <br></br>
                            Yıl: 2004
                            <br></br>
                            Yönetmen: Reha Erdem
                            <br></br>
                            Oyuncular: Ali Düşenkalkar, Işıl Yücesoy, Köksal
                            Engür, Mahmut Gökgöz, Erdem Akakçe
                            <br></br>
                        </div>
                        <div className="movie-text">
                            Hafızasını yitiren bir adamın karakterini geri
                            getirmeye çalışan yakın çevresi kendi
                            karakterlerinde de bir dönüşüm başlatır. Hayattaki
                            korkularıyla en saf, en naif şekilde yüzleşirler.
                            <br></br>
                            <br></br>
                            Sinemamızın özgün yönetmenlerinden Reha Erdem; yine
                            zamandan bağımsız, insanı odak noktasına alarak
                            yarattığı evrene bizi de davet ediyor. İnsan olma
                            yolculuğumuzda dinlenecek hoş bir seda bırakıyor.
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export { MuseumList, MovieList }
