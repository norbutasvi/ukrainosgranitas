import React from 'react'
import Link from 'next/link'

function Header({getItemsCount}) {
    return (
    <div className="header">
        <Link href={'/'}>
        <div className="col logo">
            <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634724410/Logo_GRANITAS_1_-modified_snlcgi.png" />
        </div>
        </Link>
        <div className="middle">
            <Link href={'/'} passHref>
            <a>
            <div className="col">
                PAGRINDINIS
            </div>
            </a>
            </Link>
            <Link href={'/'} passHref>
            <a>
            <div className="col">
                APIE MUS
            </div>
            </a>
            </Link>
            <Link href={'/'} passHref>
            <a>
            <div className="col">
                PRISTATYMAS
            </div>
            </a>
            </Link>
            <Link href={'/'} passHref>
            <a>
            <div className="col">
                APMOKĖJIMAS
            </div>
            </a>
            </Link>
            <Link href={'/'} passHref>
            <a>
            <div className="col">
                NUOTRAUKOS
            </div>
            </a>
            </Link>
            <Link href={'/'} passHref>
            <a>
            <div className="col">
                KONTAKTAI
            </div>
            </a>
            </Link>
        </div>
        <div className="col">
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
