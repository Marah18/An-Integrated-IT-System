import Header from "../components/Header";
import Footer from "../components/Footer";
import emailImg from "../img/email (1).png"
import phoneImg from "../img/telephone-call.png"
import '../css/Contact.css';



export default function Contact() {
    return (
        <>
            <Header />
            <div class="main">
                <h1>Kontakta Oss:</h1>
                <div class="colm">
                    <   h3>Via phone</h3>
                    <   div class="info">
                        <img className="cont-img" src={phoneImg} alt="phone img" />
                        <p> 010-352 00 00</p>
                    </div>
                </div>
                <div class="colm">
                    <h3>Via email</h3>
                    <div class="info">
                        <img className="cont-img" src={emailImg} alt="email img" />
                        <p>kommun@kalmar.se</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}