import Header from "../components/Header";
import Footer from "../components/Footer";
import '../css/PrivacyPolicy.css';


export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <div class="container">
                <h1 className='sub-tit'></h1>
                <form id="privacy-policy-form">

                    <h1>Privacypolicy:</h1>
                    <h3>Vi är engagerade i att skydda din integritet.</h3>

                    <h2>Information Vi Samlar In</h2>
                    <p>Vi samlar in information som du tillhandahåller direkt till oss, såsom ditt köks namn och e-postadress, när du registrerar dig för våra tjänster eller kontaktar oss. </p>

                    <h2>Hur Vi Använder Din Information
                    </h2>
                    <p>Vi använder den information vi samlar in för att tillhandahålla, underhålla och förbättra våra tjänster, samt för att kommunicera med dig om uppdateringar och kampanjer.
                    </p>

                    <h2>
                        Specifikt för vårt projekt använder vi denna information för att:
                    </h2>
                    <p>
                        <p>Datainmatning och redigering, tillgänglig för kökspersonal i sjukhus och skolor inom Kalmar Kommun.   </p>
                        <p>Möjliggöra direkt datainmatning för att minska manuella beräkningar och förbättra noggrannheten.   </p>
                        <p> Tillhandahålla realtidsberäkningar för omedelbara insikter i matavfallsmått, vilket hjälper till med proaktiva avfallsminskningsstrategier som portionskontroll och lagerhantering.   </p>
                        <p> Autonomt generera visualiseringar, inklusive diagram och grafer, för att illustrera trender inom matavfall och lyfta fram kök med minst avfall.   </p>
                        <p> Främja transparens och uppmuntra samarbete i avfallsminskningsinsatser genom att göra dessa visualiseringar tillgängliga för alla intressenter.   </p>
                        <p> Erkänna prestationer och ge positiv förstärkning, såsom att lyfta fram skolor som utmärker sig i avfallsminskning, för att motivera kontinuerliga förbättringsinsatser.</p>
                    </p>
                    <h2>Dela Information</h2>
                    <p>Vi säljer, byter eller hyr inte ut din personliga information till tredje part.
                    </p>

                    <h2>Säkerhet</h2>
                    <p>Vi vidtar rimliga åtgärder för att skydda säkerheten för din personliga information. </p>

                    <h2>Ändringar i Denna Integritetspolicy</h2>
                    <p>Vi kan uppdatera vår Integritetspolicy från tid till annan. Vi kommer att meddela dig om eventuella ändringar genom att publicera den nya Integritetspolicyn på denna sida.</p>

                    <button type="submit">Accept and Continue</button>
                </form>
            </div>
            <Footer />
        </>
    )
}