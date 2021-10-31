import React, { useEffect, useState, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {Navigation, Pagination, Autoplay} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Header from '../components/Header';
import { GlobalContext } from '../components/contexts/GlobalContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getUrl } from '../services/getUrl';

export async function getStaticProps() {

    const res = await fetch(`${getUrl()}/categories`)
    const categories = await res.json()

    const productsRes = await fetch(`${getUrl()}/products?category=6177f445afee3b4b58893440&category=6177f35b8ba75b29acb703cd`)
    const products = await productsRes.json();

    const typesRes = await fetch(`${getUrl()}/filters?_id=6177f61365299245f8d9c3d1`)
    const types = await typesRes.json();

    // const filteredRes = await fetch(`http://localhost:1337/products?_product_filters.choice.id_in=1`)
    // const filteredProds = await filteredRes.json()

    if (products.length === 0) {
        return {
          notFound: true,
        }
    }
  
    return {
      props: {
        categories,
        products,
        types: types[0].choices
      }, // will be passed to the page component as props
      revalidate: 20
    }
  }

SwiperCore.use([Navigation, Pagination, Autoplay]);

function index({categories, products, types}) {

    const cartContext = useContext(GlobalContext)

    const [slidesNum, setSlidesNum] = useState(4);

    useEffect(() => {
        if (window.innerWidth < 650) {
            setSlidesNum(1);
        } else if (window.innerWidth < 800) {
            setSlidesNum(2);
        } else if (window.innerWidth < 1279) {
            setSlidesNum(3);
        }
    }, [])

    const trinkeles = products.filter(product => product.category.id == '6177f445afee3b4b58893440');
    const plyteles = products.filter(product => product.category.id == '6177f35b8ba75b29acb703cd');

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
                <Header getItemsCount={cartContext.getItemsCount}/>
                <div className="main-content">
                    <div className="filters">
                        <h2>Ukrainietiško granito tipai</h2>
                        {
                            types.map(type =>
                                <Link href={`/granito-tipas/search?choice=${type._id}`} passHref>
                                    <a>
                                    <div className="filter-item">
                                        <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1635665243/chevron_right_white_24dp_1_cpibz2.svg" /> {type.value}
                                    </div>
                                    </a>
                                </Link>
                                )
                        }
                    </div>
                    <div className="categories-list">

                    <div className="categories">
                        {
                        categories.map(category =>
                            
                            <Link key={category._id} href={`/${category.slug}`} passHref shallow>
                            <a>
                                <div className="item">
                                <div className="left">
                                    <h1>{category.title}</h1>
                                </div>
                                <div className="right" style={{ backgroundImage: `url('${category.image.url}')`}}>
                                </div>
                                </div>
                            </a>
                            </Link>
                            )
                        }
                    </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default index
