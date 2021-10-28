import React from 'react'
import Link from 'next/link'

function Header({getItemsCount}) {
    return (
        <div className="header">
        <div className="col logo">
            <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634724410/Logo_GRANITAS_1_-modified_snlcgi.png" />
        </div>
        <div className="col contacts">
            <div className="item">
                <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634710811/call_black_24dp_lslbim.svg" />
                <p>+37063631839</p>
            </div>
            <div className="item">
                <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634711132/email_black_24dp_laakqp.svg" />
                <p>info@ukrainosgranitas.lt</p>
            </div>
        </div>
        <div className="col right">
            <Link href="/shipping" passHref>
                <a>
                    <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634712074/local_shipping_black_24dp_2_bnrfew.svg" />
                    <p>PRISTATYMAS</p>
                </a>
            </Link>
            <Link href="/payment" passHref>
                <a>
                    <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634711400/euro_black_24dp_1_a5ltbl.svg" />
                    <p>APMOKĖJIMAS</p>
                </a>
            </Link>
        </div>
        <div className="col right">
            <Link href={`/cart`}>
                <div className="item item-basket">
                <p>{getItemsCount()}</p>
                <img className="basket" src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634711517/shopping_cart_black_24dp_j5mbky.svg" />
                </div>
            </Link>
        </div>
    </div>
    )
}

export default Header
