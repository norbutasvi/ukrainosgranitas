import React from 'react'
import Link from 'next/link'

function Footer() {
    return (
        <div className="footer">
        <div className="wrapper">
            <div className="col">
                <h3>ĮMONĖS INFORMACIJA</h3>
                <div className="item">
                    <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634710811/call_black_24dp_lslbim.svg" />
                    <p>+37063631839</p>
                </div>
                <div className="item">
                    <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634711132/email_black_24dp_laakqp.svg" />
                    <p>info@ukrainosgranitas.lt</p>
                </div>
                <div className="block">
                    <p>UAB "Ukrainos granitas"</p>
                    <p><strong>Įmonės kodas:</strong> 123456789</p>
                    <p><strong>Banko sąskaita:</strong> 5625453445215455</p>
                </div>
            </div>
            <div className="col">
                <h3>PAGRINDINĖS NUORODOS</h3>
                <Link href="/" passHref>
                    <a>Atsiskaitymas</a>
                </Link>
                <Link href="/" passHref>
                    <a>Prekių pristatymas ir atsiėmimas</a>
                </Link>
                <Link href="/" passHref>
                    <a>Privatumo politika</a>
                </Link>
            </div>
            <div className="col">
                <h3>LOREM IPSUM</h3>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in condimentum urna. Proin tincidunt lectus quis tortor interdum, eget efficitur ante vehicula.
                </p>
            </div>
        </div>
    </div>
    )
}

export default Footer
