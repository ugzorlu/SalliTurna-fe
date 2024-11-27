import React, { Component } from 'react'

/* External Libraries */
import { Helmet } from 'react-helmet-async'

/* Constants and Helpers */
import { combineClassnames } from '../utils/commons'

/* Styling */
import '../styles/Info.scss'

class Info extends Component {
    constructor(props) {
        super(props)

        const { hash } = this.props.location
        let activeSection = 'faq'

        if (hash === '#contract') activeSection = 'contract'
        else if (hash === '#privacy') activeSection = 'privacy'

        this.state = { activeSection }
    }

    setActiveSection = (section) => {
        this.setState({ activeSection: section })
    }

    render() {
        const { activeSection } = this.state

        const sectionClasses = (section) => ({
            itemClass: combineClassnames(
                'info-item',
                'info-item-active',
                activeSection === section
            ),
            textClass: combineClassnames(
                `info-${section} info-text`,
                'info-text-active',
                activeSection === section
            ),
        })

        const faqClasses = sectionClasses('faq')
        const contractClasses = sectionClasses('contract')
        const privacyClasses = sectionClasses('privacy')

        return (
            <div className="info-container">
                <Helmet>
                    <title>Bilgi | Şallı Turna</title>
                </Helmet>
                <div className="info-topbar">
                    <div className="info-items-wrapper">
                        <div
                            className={faqClasses.itemClass}
                            // onClick={this.handleChangeItemToFaq}
                            onClick={() => this.setActiveSection('faq')}
                        >
                            Sıkça Sorulan Sorular
                        </div>
                        <div
                            className={contractClasses.itemClass}
                            // onClick={this.handleChangeItemToContract}
                            onClick={() => this.setActiveSection('contract')}
                        >
                            Kullanıcı Sözleşmesi
                        </div>
                        <div
                            className={privacyClasses.itemClass}
                            onClick={() => this.setActiveSection('privacy')}
                            // onClick={this.handleChangeItemToPrivacy}
                        >
                            Gizlilik Politikası
                        </div>
                    </div>
                </div>
                <div className={faqClasses.textClass}>
                    <h6 className="info-title"> Şallı Turna nedir? </h6>
                    <p>
                        Şallı Turna; kullanıcılarının etrafındaki etkinliklerden
                        haberdar olmasını ve etkinlikler/eserler/sanatçılar
                        hakkında bilgi, yorum alışverişi yapabilmesini sağlayan
                        interaktif bir kültür-sanat portalıdır.
                    </p>
                    <br />
                    <h6 className="info-title"> Şallı Turna nasıl çalışır? </h6>
                    <p>
                        Kullanıcı olarak kayıt olduktan sonra etkinlik ilanı
                        verebilir, mevcut etkinlikler/eserler/sanatçılar
                        hakkında bilgi, yorum veya oylama içeren paylaşımlarda
                        bulunabilirsiniz.
                    </p>
                    <br />
                    <h6 className="info-title">Şallı Turna ücretsiz midir?</h6>
                    <p>
                        Şallı Turna'a kayıt olmak, etkinlik ilanı vermek,
                        etkinlikler hakkında paylaşımda bulunmak tamamen
                        <u>ÜCRETSİZDİR</u>.
                    </p>
                </div>
                <div className={contractClasses.textClass}>
                    <h6 className="info-title"> 1. Kullanım Koşulları </h6>
                    <p>
                        1.1. Bu sayfa www.salliturna.com.tr (bundan sonra kısaca
                        “ŞALLI TURNA” olarak anılacaktır) adlı web sitesi
                        kullanımını düzenleyen şartlar ve koşullar hakkında size
                        bilgi vermek amacıyla hazırlanmıştır.
                    </p>
                    <p>
                        1.2. Kullanıcılar, www.salliturna.com.tr Kullanıcı
                        Sözleşmesi’nin (bundan sonra kısaca “SÖZLEŞME” olarak
                        anılacaktır) kendileri tarafından onaylanması ile
                        yürürlüğe gireceğini ve bu koşullara uygun davranmakla
                        yükümlü olduklarını bilmektedirler.
                    </p>
                    <br />
                    <h6 className="info-title"> 2. Tanımlar </h6>
                    <p>
                        2.1. WEB SİTESİ: ŞALLI TURNA tarafından belirlenen
                        çerçeve içersinde çeşitli hizmetlerin ve içeriklerin
                        sunulduğu çevrimiçi (online) ortamdan erişimi mümkün
                        olan web sitesidir ve www.salliturna.com.tr adresi
                        üzerinden hizmet vermektedir.
                    </p>
                    <p>
                        2.2. KULLANICI: ŞALLI TURNA'nın herhangi bir surette
                        sağladığı hizmetlerden faydalanmak isteyen, seçmiş
                        olduğu üyelik formunu eksiksiz dolduran, ŞALLI TURNA
                        tarafından üyelikleri onaylanıp kabul edilen gerçek veya
                        tüzel kişidir. "Kullanıcı adı" üyeye özeldir ve aynı
                        "Kullanıcı adı" iki farklı KULLANICI’ya verilmez. ŞALLI
                        TURNA üyeliği 18 yaşından büyük tüm internet
                        kullanıcılarına açıktır. üyelik kişiye özeldir ve
                        başkasına devredilemez.
                    </p>
                    <br />
                    <h6 className="info-title">
                        3. SÖZLEŞME’nin Konusu ve Kapsamı
                    </h6>
                    <p>
                        3.1. ŞALLI TURNA, WEB SİTESİ üzerinde sunduğu hizmet
                        KULLANICILARIn işbu sözleşmedeki kriterlere uygun
                        gönderiler ve mesajlar üzerinden iletişim yapısı
                        sağlamaktadır.
                    </p>
                    <p>
                        3.2. ŞALLI TURNA, herhangi bir sebepten veya herhangi
                        bir sebep olmaksızın, kullanıcılara bildirerek veya
                        bildirmeyerek, kullanıcılara karşı herhangi bir
                        sorumluluğu olmaksızın, bu hizmetlerin tamamı veya bir
                        kısmı ile ilgili değişiklik yapma, bu hizmetlerin
                        tamamını veya bir kısmını durdurma hakkını saklı tutar.
                        ŞALLI TURNA, WEB SİTESİ üzerinden sunacağı hizmetlerin
                        kapsamını ve niteliğini belirlemekte tamamen serbest
                        olup, hizmetlere ilişkin olarak yapacağı değişiklikleri
                        WEB SİTESİ'nde yayınlamasıyla yürürlüğe koymuş ve
                        KULLANICI tarafından da kabul edilmiş addedilir.
                    </p>
                    <p>
                        3.3. İşbu sözleşmenin kapsamı ise, şart ve koşulların
                        belirlenmesi olup WEB SİTESİ’nde ŞALLI TURNA tarafından
                        yapılan kullanıma, içeriklere, uygulamalara ve
                        kullanıcılara yönelik her türlü beyan işbu sözleşmenin
                        ayrılmaz parçası olarak kabul edilecektir. İşbu
                        sözleşmenin KULLANICI tarafından kabulü ile, KULLANICI W
                        EB SİTESİ’nde yer alan ve yer alacak olan ŞALLI TURNA
                        tarafından yapılan kullanıma, içeriklere, uygulamalara
                        ve Kullanıcı’lara yönelik her türlü beyanı da kabul
                        etmiş olduğunu kabul, beyan ve taahhüt eder.
                    </p>
                    <br />
                    <h6 className="info-title"> 4. Genel Hükümler </h6>
                    <p>
                        4.1. ŞALLI TURNA, işbu WEB SİTESİ'nde mevcut her tür
                        hizmet, ürün, kampanya vs. bilgiler ve WEB SİTESİ
                        kullanma koşulları ile WEB SİTESİ'nde sunulan bilgileri
                        önceden bir ihtara gerek olmaksızın değiştirme, WEB
                        SİTESİ'sini ve içeriğini yeniden düzenleme, yayını
                        durdurma ve/veya duraklatma hakkını saklı tutar.
                        Değişiklikler, WEB SİTESİ’nde yayınlanmalarıyla
                        yürürlüğe girerler. SİTE’nin kullanımı ya da WEB
                        SİTESİ’ne giriş ile bu değişiklikler de kabul edilmiş
                        sayılır. Bu koşullar link verilen diğer web sayfaları
                        için de geçerlidir.
                    </p>
                    <p>
                        4.2. ŞALLI TURNA, tamamen kendi iradesi doğrultusunda ve
                        herhangi bir sebebe dayanmadan üyelik başvurularını
                        reddedebilir veya KULLANICI başvurusunun kabul
                        edilmesini ek şart ve koşullara bağlayabilir. ŞALLI
                        TURNA işbu SÖZLEŞME ve WEB SİTESİ’nde belirtilen kural
                        ve koşullara aykırılık, KULLANICI başvurusu sırasında
                        verilen bilgilerin yeterli, doğru veya güncel
                        olmadığının tespit edilmesi, KULLANICI başvurusunda
                        bulunan kişinin başvurusunun daha önce reddedilmiş
                        olması, KULLANICI hakkında şikayetler alınması veya
                        olumsuz yorumlar alınması ve bu durumun ŞALLI TURNA
                        tarafından risk olarak değerlendirilmesi ve benzeri
                        sebepler de dahil olmak üzere, haklı bir sebebe
                        dayanarak veya herhangi bir sebebe dayanmadan ve
                        herhangi bir bildirimde bulunmadan, her zaman herhangi
                        bir tazminat yükümlülüğü altında bulunmaksızın işbu
                        sözleşmeyi feshederek Kullanıcı statüsüne son verebilir.
                    </p>
                    <p>
                        4.3. KULLANICI, WEB SİTESİ’nin kullanımına imkan veren
                        hesaplar, kullanıcı adı ve şifre de dahil olmak üzere
                        tüm bilgilerin kullanım ve yönetiminden bizzat
                        sorumludur. KULLANICI’ya ait hesap, kullanıcı adı ve
                        şifre ile gerçekleştirilen her işlem bizzat KULLANICI
                        tarafından gerçekleştirilmiş addedilecek ve bu
                        bilgilerinin Kullanıcı dışında bir kişi tarafından
                        kullanılması, kaybolması veya el değiştirmesi nedeniyle
                        Kullanıcı ve/veya üçüncü kişilerin uğradığı zararlardan
                        münhasıran KULLANICI sorumlu olacaktır.
                    </p>
                    <p>
                        4.4. KULLANICI, WEB SİTESİ’nde gerçekleştireceği tüm
                        işlemlerde işbu SÖZLEŞME ile WEB SİTESİ’nde zaman zaman
                        yayınlanabilecek koşullara, kanuna, ahlaka ve adaba,
                        dürüstlük ilkelerine uyacak, herhangi bir yöntem ile
                        Site’nin işleyişini engelleyebilecek davranışlarda,
                        üçüncü kişilerin haklarına tecavüz eden veya etme
                        tehlikesi bulunan fiillerde bulunmayacaktır.
                    </p>
                    <p>
                        4.5. KULLANICI, hesabında yer alan veya WEB SİTESİ’ne
                        kendisi tarafından yüklenen bilgi ve içeriklerin tam,
                        doğru ve hukuka uygun olduğunu, yanıltıcı olmadığını,
                        karalama, kötüleme, itibar zedeleyici beyan, hakaret,
                        iftira, tehdit veya taciz gibi hukuka veya ahlaka aykırı
                        nitelik taşımayacağını, bu bilgi ve içeriklerin üçüncü
                        kişilerin fikri mülkiyet hakları ve kişilik hakları da
                        dahil olmak üzere herhangi bir hak ihlaline sebep
                        olmayacağını kabul ve taahhüt etmektedir. Bu madde başta
                        olmak üzere KULLANICI tarafından WEB SİTESİ'ne yüklenen
                        ve işbu SÖZLEŞME ile WEB SİTESİ'nde yer alan diğer koşul
                        ve şartlara aykırı bilgi ve içerikler WEB SİTESİ’nden
                        kaldırılabilecek, bu tür içerikler nedeniyle
                        KULLANICI'nın WEB SİTESİ’nden faydalanma imkanı kısmen
                        veya tamamen askıya alınabilecektir.
                    </p>
                    <p>
                        4.6. WEB SİTESİ’nin kullanımından kaynaklanan her türlü
                        yasal, idari ve cezai sorumluluk KULLANICI’ya aittir.
                        ŞALLI TURNA, KULLANICI’nın WEB SİTESİ üzerinde
                        gerçekleştirdiği faaliyetler ve/veya işbu SÖZLEŞME ve
                        yasaya aykırı eylemleri neticesinde üçüncü kişilerin
                        uğradıkları veya uğrayabilecekleri zararlardan doğrudan
                        ve/veya dolaylı olarak hiçbir şekilde sorumlu tutulamaz.
                        Üçüncü kişilerden bu kapsamda gelecek her türlü talep
                        ile KULLANICI’nın işbu sözleşmede belirtilen
                        yükümlülüklerini yerine getirmemesinden kaynaklanan
                        ŞALLI TURNA’nın uğrayacağı zararlar KULLANICI’ya rücu
                        edilecektir.
                    </p>
                    <p>
                        4.7. KULLANICI, WEB SİTESİ’ne yüklediği içeriklerin
                        virüs, casus yazılım, kötü niyetli yazılım, truva atı,
                        vs. zararlı materyaller içermeyeceğini, WEB SİTESİ’ni
                        veri madenciliği gibi amaçlarla kullanılmayacağını beyan
                        eder.
                    </p>
                    <br />
                    <h6 className="info-title">
                        5. Hukuka Aykırı İçerik ve Şİkayet
                    </h6>
                    <p>
                        5.1. ŞALLI TURNA'da KULLANICIlar tarafından oluşturulan
                        içerikler herhangi bir ön incelemeye tabi olmaksızın ve
                        doğrudan KULLANICIlar tarafından yayına alınmaktadır.
                        Tarafımıza başvurulmadığı müddetçe, yayınlanan içeriğin
                        hukuka uygunluğunu denetleme yükümlülüğümüz
                        bulunmamaktadır. Ancak, ŞALLI TURNA yer sağladığı
                        içeriğin hukuka uygunluğunu sağlamaya özen göstermekte,
                        bu nedenle yapılan her başvuruyu dikkatle
                        değerlendirmektedir.
                    </p>
                    <p>
                        5.2. Bir sayfada yer alan paylaşımlar genelde farklı
                        KULLANICIlara ait olmaktadır. Bu nedenle, başlıklarda
                        yer alan her bir paylaşım 'şikayet' butonu kullanılarak
                        ayrı ayrı şikayet edilebilmektedir.
                    </p>
                    <br />
                    <h6 className="info-title">
                        6. Sorumluluğun Sınırlandırılması
                    </h6>
                    <p>
                        6.1. ŞALLI TURNA, WEB SİTESİ’ne erişilmesi, WEB
                        SİTESİ’nin ya da WEB SİTESİ’ndeki bilgilerin ve diğer
                        verilerin programların vs. kullanılması sebebiyle,
                        sözleşmenin ihlali, haksız fiil, ya da başkaca sebeplere
                        binaen, doğabilecek doğrudan ya da dolaylı hiçbir
                        zarardan sorumlu değildir. ŞALLI TURNA, sözleşmenin
                        ihlali, haksız fiil, ihmal veya diğer sebepler
                        neticesinde; işlemin kesintiye uğraması, hata, ihmal,
                        kesinti hususunda herhangi bir sorumluluk kabul etmez.
                        Bu WEB SİTESİ’nde ya da link verilen diğer web
                        sitelerine erişilmesi ya da WEB SİTESİ’nin kullanılması
                        ile ŞALLI TURNA’nın, kullanım/ziyaret sonucunda,
                        doğabilecek her tür sorumluluktan, mahkeme ve diğer
                        masraflar da dahil olmak üzere her tür zarar ve talep
                        hakkından ayrı kılındığı kabul edilmektedir.
                    </p>
                    <p>
                        6.2. KULLANICI’nın WEB SİTESİ’ni kullanmasi, herhangi
                        bir kullanici ile hizmet veya eşya paylaşımı yapması ile
                        ilgili her türlü risk münhasırsan KULLANICI üzerinde
                        olacaktir. KULLANICI, WEB SİTESİ’ne ve WEB SİTESİ’nin
                        kullanımı ile gerçekleştirilen değiş tokuşlara ilişkin
                        olarak WEB SİTESİ sahiplerinden hangi ham altında olursa
                        olsun herhangi bir şekilde talepte bulunmayacağını,
                        herhangi bir KULLANICI’nın WEB SİTESİ üzerinde hesap
                        açmış olmasının, KULLANICI’ya ilişkin yorumlar İle sahip
                        olduğu puanların WEB SİTESİ sahiplerinin KULLANICI’yı
                        onayladığı, önerdiği̇, garanti verdiği ve desteklediği
                        şeklinde yorumlanamayacağını kabul, beyan ve taahhüt
                        eder. ŞALLI TURNA, uygulanacak hukukun izin verdiği
                        ölçüde, kar kaybı, şerefiye ve itibar kaybı, dahil ancak
                        bunlarla sınırlı olmaksızın WEB SİTESİ’nin kullanımı
                        neticesinde meydana gelen hiçbir doğrudan, dolaylı,
                        özel, arızi, cezai zarardan sorumlu olmayacaktir. WEB
                        SİTESİ ve WEB SİTESİ kapsamindaki özellikler ve sair
                        içerikler “olduğu gibi” sunulmakta olup, bu kapsamda WEB
                        SİTESİ sahiplerinin bunlarin doğruluğu, tamlığı ve
                        güvenilirliği ile ilgili herhangi bir sorumluluk ya da
                        taahhüdü bulunmamaktadır. ŞALLI TURNA, işbu SÖZLEŞME
                        kapsamında ticari elverişlilik, belli bir amaca veya
                        kullanıma uygunluk veya ihlalin söz konusu olmamasına
                        ilişkin olarak açik veya zimni herhangi bir taahhütte
                        bulunmamaktadır.
                    </p>
                    <br />
                    <h6 className="info-title"> 7. Mücbir Sebepler </h6>
                    <p>
                        7.1. Mücbir sebep sayılan tüm durumlarda, ŞALLI TURNA
                        işbu SÖZLEŞME ile belirlenen edimlerinden herhangi
                        birini geç veya eksik ifa etme veya ifa etmeme nedeniyle
                        sorumlu tutulamaz. Mücbir sebep; doğal afet, isyan,
                        savaş, grev, lokavt, telekomünikasyon altyapısından
                        kaynaklanan arızalar, elektrik kesintisi ve kötü hava
                        koşulları da dahil ve fakat bunlarla sınırlı olmamak
                        kaydıyla ilgili tarafın makul kontrolü haricinde
                        gerçekleşen olaylar olarak yorumlanacaktır. Mücbir sebep
                        süresince tarafların edimleri askıya alınır. Mücbir
                        sebebin 1 (bir) aydan uzun sürmesi halinde işbu SÖZLEŞME
                        hakları ifa edilemeyen tarafça feshedilebilecektir.
                    </p>
                    <br />
                    <h6 className="info-title"> 8. Yürürlük ve Kabul </h6>
                    <p>
                        8.1. İşbu kullanıcı sözleşmesi, ŞALLI TURNA tarafından
                        WEB SİTESİ içeriğinde ilan edildiği tarihte yürürlülüğe
                        girer. KULLANICI’lar, işbu SÖZLEŞME hükümlerini WEB
                        SİTE’sini kullanmakla kabul etmiş olmaktadırlar. ŞALLI
                        TURNA, dilediği zaman işbu SÖZLEŞME hükümlerinde
                        değişikliğe gidebilir, değişiklikler, sürüm numarası ve
                        değişiklik tarihi belirtilerek SİTE üzerinden yayınlanır
                        ve aynı tarihte yürürlüğe girer. Bu sözleşmeden önceki
                        sözleşmeler bu sözleşmenin yürürlüğe girmesi ile
                        uygulamadan kalkar. Bu sözleşmeden eski sözleşmelerle
                        herhangi bir hak kazanmış üyelerin haklarının durumları
                        bu sözleşmeye göre tayin edilir.
                    </p>
                </div>
                <div className={privacyClasses.textClass}>
                    <p>
                        İşbu GİZLİLİK POLİTİKASI'nın amacı, KULLANICI'lara ait
                        bilgi ve verilerin kullanımına ilişkin koşul ve şartları
                        tespit etmektir. GİZLİLİK POLİTİKASI, KULLANICI'lar ile
                        akdedilen KULLANICI SÖZLEŞMESİ’nin eki ve ayrılmaz bir
                        parçası niteliğindedir.
                    </p>

                    <p>
                        ŞALLI TURNA, WEB SİTESİ üzerinden kendisine elektronik
                        ortamdan iletilen bilgileri KULLANICI ile yaptığı
                        KULLANICI SÖZLEŞMESİ ve işbu GİZLİLİK POLİTİKASI ile
                        belirlenen amaçlar ve kapsam doğrultusunda bilmesi
                        gereken çalışanları, alt yüklenicileri ve bağlı
                        kuruluşlara ifşa edebilecek, bunlar dışında üçüncü
                        kişilere açıklamayacaktır. Bu kapsamda ŞALLI TURNA,
                        gizli bilgileri kesinlikle özel ve gizli tutmayı, bunu
                        bir sır saklama yükümü olarak addetmeyi ve gizliliğin
                        sağlanması ve sürdürülmesi, gizli bilginin tamamının
                        veya herhangi bir kısmının kamu alanına girmesini veya
                        yetkisiz kullanımını veya üçüncü bir kişiye ifşasını
                        önlemek için gerekli tüm tedbirleri almayı ve gerekli
                        özeni göstermeyi taahhüt etmektedir.
                    </p>

                    <p>
                        ŞALLI TURNA WEB SİTESİ ve KULLANICI SÖZLEŞMESİ’nde
                        belirlenen amaçlar doğrultusunda barındırma, bakım, veri
                        depolama ve yönetimi veya pazarlama gibi hizmetler
                        aldığı ve işbu GİZLİLİK POLİTİKASI hükümlerine uymasını
                        sağlayacağı hizmet sağlayıcılara hizmetin gerektirdiği
                        ölçüde yukarıda sözü edilen kişisel bilgileri
                        açıklayabilecektir.
                    </p>

                    <p>
                        Söz konusu kişisel bilgiler, KULLANICI SÖZLEŞMESİ’nde
                        belirtilen hallerin dışında, KULLANICI ile temas kurmak
                        veya KULLANICI’nın WEB SİTESİ’ndeki tecrübesini
                        iyileştirmek (mevcut hizmetlerin geliştirilmesi, yeni
                        hizmetler oluşturulması ve kişiye özel hizmetler
                        sunulması gibi) amacıyla kullanılabileceği gibi,
                        kullanıcının kimliği ifşa edilmeden çeşitli
                        istatistiksel değerlendirmeler yapma, veri tabanı
                        oluşturma ve pazar araştırmalarında bulunma amacıyla da
                        kullanılabilecektir. KULLANICI’nın ayrıca onay vermesi
                        halinde onay kapsamında söz konusu bilgiler ŞALLI TURNA
                        ve işbirliğinde olduğu kişiler tarafından doğrudan
                        pazarlama yapmak amacıyla işlenebilecek, saklanabilecek,
                        üçüncü kişilere iletilebilecek ayrıca söz konusu
                        bilgiler üzerinden sistem ve hizmetlerin tanıtımı vb.
                        faaliyetlere ilişkin bildirimlerde bulunma amacıyla
                        KULLANICI’nın WEB SİTESİ'ne kayıtlı olduğu e-posta
                        adresi veya sağladığı diğer iletişim bilgileri üzerinden
                        iletişime geçilebilecektir.
                    </p>

                    <p>
                        ŞALLI TURNA, KULLANICI’nın WEB SİTESİ üzerinde
                        gerçekleştirdiği işlemlere ilişki bilgileri anonim hale
                        getirerek istatistiki değerlendirmelerde, performans
                        değerlendirmelerinde, ŞALLI TURNA ve iş ortaklarının
                        pazarlama kampanyalarında, yıllık rapor ve benzeri
                        raporlarda kullanmak üzere bu amaçların
                        gerçekleştirilmesi için gereken sürede saklayabilir,
                        işleyebilir ve iş ortaklarına iletebilir.
                    </p>

                    <p>
                        ŞALLI TURNA ayrıca, aşağıdaki koşulların varlığı halinde
                        KULLANICI’ya ait bilgileri üçüncü kişilerle
                        paylaşabilecektir:
                    </p>

                    <li>
                        KULLANICI SÖZLEŞMESİ kapsamındaki yükümlülüklerin yerine
                        getirilmesi için ilgili ifşanın zorunlu olması,
                    </li>
                    <li>
                        Yetkili idari ve adli bir kurum tarafından ilgili
                        mevzuat doğrultusunda usulüne göre yürütülen bir
                        araştırma veya soruşturmanın yürütümü amacıyla
                        kullanıcılarla ilgili bilgi talep edilmesi,
                    </li>
                    <li>
                        KULLANICI’nın haklarını korumak veya güvenliklerini
                        sağlamak için bilgi vermenin gerekli olması.
                    </li>
                    <br />
                    <p>
                        WEB SİTESİ ile ilgili sorunların tanımlanması ve WEB
                        SİTESİ’nde çıkabilecek sorunların ivedilikle
                        giderilebilmesi için, ŞALLI TURNA gereken hallerde
                        kullanıcıların IP adresini tespit etmekte ve
                        kullanmaktadır. IP adresleri, ayrıca kullanıcıları genel
                        bir şekilde tanımlamak ve kapsamlı demografik bilgi
                        toplamak amacıyla da kullanılabilir.
                    </p>

                    <p>
                        ŞALLI TURNA, yukarıda anılan amaçlarla ilgili verileri
                        KULLANICI’nın bulunduğu ülke dışında dünyanın herhangi
                        bir yerinde bulunan sunucularına (sunucular kendisine,
                        bağlı şirketlerine veya alt yüklenicilerine ait
                        olabilir) aktarma hakkına sahiptir.
                    </p>

                    <p>
                        WEB SİTESİ üzerinden başka site ve uygulamalara link
                        verilmesi mümkün olup, ŞALLI TURNA’nın bu site ve
                        uygulamaların gizlilik uygulamaları ve içeriklerine
                        yönelik herhangi bir sorumluluk taşımamaktadır.
                    </p>

                    <p>
                        ŞALLI TURNA, işbu GİZLİLİK POLİTİKASI’nı dilediği zaman
                        WEB SİTESİ’de yayımlamak suretiyle değiştirebilir. ŞALLI
                        TURNA’nın değişiklik yaptığı GİZLİLİK POLİTİKASI
                        hükümleri WEB SİTESİ’nde yayınlandığı tarihte yürürlük
                        kazanır.
                    </p>
                </div>
            </div>
        )
    }
}

export default Info
