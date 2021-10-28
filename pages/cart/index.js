import React, { useContext } from 'react'
import Header from '../../components/Header'
import { GlobalContext } from '../../components/contexts/GlobalContext'
import Head from 'next/head'
import Nav from '../../components/Nav';
import Footer from '../../components/Footer'
import Link from 'next/link';
import { getUrl } from '../../services/getUrl';

export async function getStaticProps(context) {

    const categoriesRes = await fetch(`${getUrl()}/categories`)
    const categories = await categoriesRes.json();
  
    // const subcategoriesRes = await fetch(`http://localhost:1337/subcategories?_category=${category[0]._id}`)
    // const subcategories = await subcategoriesRes.json()
  
    return {
      props: {
        categories
        // category
      }, // will be passed to the page component as props
    }
  }

function index({ categories }) {

    const cartContext = useContext(GlobalContext);

    return (
        <div>
            <Head>
                <title>Ukrainos granitas</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <div className="wrapper">
                <Header getItemsCount={cartContext.getItemsCount} />
                <Nav categories={categories} />
                <div className="cart-content">
                    <div className="cart">
                        {
                            cartContext.items.length < 1 ?
                            <p className="cart-title">Kol kas neturite pridėję prekių.</p>
                            :
                            <p className="cart-title">Tavo prekių krepšelis</p>
                        }
                        <div className="items-list">
                            {
                                cartContext.items.map(product =>
                                <Link href={`/${product.categorySlug}/${product.subcategorySlug}/${product.slug}`} passHref>
                                <a>
                                <div className="item">
                                        <div className="close-button" onClick={(e) => {e.preventDefault(); cartContext.deleteItem(product.id)}}>
                                            <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1635344667/close_black_24dp_nvdk3m.svg" />
                                        </div>
                                    <div className="image">
                                        <img src={product.images[0].url} />
                                    </div>
                                    <div className="content">
                                        <h2>{product.title}</h2>
                                        <div className="quantity">
                                            Kiekis: {product.quantity}
                                        </div>
                                        <div className="attributes">
                                            {
                                                product.Filter.map(filter => 
                                                    <div className="attribute-item">
                                                        <strong>{filter.title}</strong><br/> 
                                                        {filter.choices.map(choice => 
                                                            <p>{choice.value}<br /></p>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="price">
                                        {product.price} €
                                    </div>
                                </div>
                                </a>
                                </Link>
                                )
                            }
                        </div>
                    </div>
                    <div className="sum-container">
                        <h2>Visa suma</h2>
                        <div className="text-flex">
                            <p>Sutaupai:</p>
                            <p>-15,00 EUR</p>
                        </div>
                        <div className="text-flex">
                            <p>Nemokamas pristatymas</p>
                            <p>0,00 EUR</p>
                        </div>
                        <div className="text-flex">
                            <p>Visa suma</p>
                            <p>{cartContext.getTotalSum().toFixed(2)} EUR</p>
                        </div>
                        <div className="finish-button">
                            Baik užsakymą
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default index
