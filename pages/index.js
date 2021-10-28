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

    // const filteredRes = await fetch(`http://localhost:1337/products?_product_filters.choice.id_in=1`)
    // const filteredProds = await filteredRes.json()
  
    return {
      props: {
        categories,
        products,
      }, // will be passed to the page component as props
      revalidate: 20
    }
  }

SwiperCore.use([Navigation, Pagination, Autoplay]);

function index({categories, products}) {

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
                <Nav categories={categories}/>
                <div className="swiper-container">
                    <div className="buttons">
                        <div className="prev"><img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634715077/chevron_left_white_24dp_nop2kd.svg" /></div>
                        <div className="next"><img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634715077/chevron_right_white_24dp_qw1cli.svg" /></div>
                    </div>
                    <Swiper
                        // spaceBetween={50}
                        // modules={[Navigation, Pagination]}
                        slidesPerView={1}
                        onSwiper={(swiper) => console.log(swiper)}
                        autoplay={{delay: 5000}}
                        navigation={{nextEl: '.next', prevEl: '.prev'}}
                        pagination
                        speed={1500}
                    >
                        <SwiperSlide>
                        <div className="slide-item" style={{ backgroundImage: `url('https://res.cloudinary.com/dhkph6uck/image/upload/v1634713691/klinkerines_trinkeles_Feldhaus_Klinker_P609KF-1200x1000_yk6blz.jpg')`}}>
                            <div className="slide-text">
                                <h2>LOREM IPSUM</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam semper eros eu est placerat convallis. Mauris sed ex orci. Nam dignissim, nulla sit amet consectetur dapibus</p>
                            </div>
                        </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        <div className="slide-item" style={{ backgroundImage: `url('https://res.cloudinary.com/dhkph6uck/image/upload/v1634713691/klinkerines_trinkeles_Feldhaus_Klinker_P609KF-1200x1000_yk6blz.jpg')`}}>
                            <div className="slide-text">
                                <h2>LOREM IPSUM</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam semper eros eu est placerat convallis. Mauris sed ex orci. Nam dignissim, nulla sit amet consectetur dapibus</p>
                            </div>
                        </div>
                        </SwiperSlide>
                    </Swiper>
                    </div>
                    <div className="products">
                    <Link href={'/trinkeles'} passHref>
                        <a>
                        <h1>TRINKELĖS<div className="button">Žiūrėti visas</div></h1>
                        </a>
                    </Link>
                        <div className="swiper-products-container">
                        <div className="products-prev" id="first-prev"><img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634715077/chevron_left_white_24dp_nop2kd.svg" /></div>
                        <div className="products-next" id="first-next" ><img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634715077/chevron_right_white_24dp_qw1cli.svg" /></div>
                        <Swiper
                        // spaceBetween={50}
                        // modules={[Navigation, Pagination]}
                        slidesPerView={slidesNum}
                        slidesPerGroup={slidesNum}
                        onSwiper={(swiper) => console.log(swiper)}
                        autoplay={{delay: 5000, enabled: false}}
                        navigation={{nextEl: '#first-next', prevEl: '#first-prev'}}
                        pagination
                        speed={1500}
                        >
                            {
                                trinkeles.map(product => 
                                    <SwiperSlide>
                                    <Link key={product._id} href={`${product.category.slug}/${product.subcategory.slug}/${product.slug}`} passHref>
                                        <a>
                                        <div className="card">
                                            <div className="image-container">
                                                <img src={product.images[0].url} />
                                            </div>
                                            <p>{product.title}</p>
                                            <div className="buttons">
                                                <div className="button">
                                                    DETALIAU
                                                </div>
                                                <div className="price">
                                                    {product.price} €
                                                </div>
                                            </div>
                                        </div>
                                        </a>
                                    </Link>
                                </SwiperSlide>
                                    
                                    )
                            }
                        </Swiper>
                        </div>
                    </div>
                    <div className="products">
                    <Link href={'/plyteles'} passHref>
                        <a>
                        <h1>PLYTELĖS<div className="button">Žiūrėti visas</div></h1>
                        </a>
                    </Link>
                        <div className="swiper-products-container">
                        <div className="products-prev" id="second-prev"><img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634715077/chevron_left_white_24dp_nop2kd.svg" /></div>
                        <div className="products-next" id="second-next"><img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634715077/chevron_right_white_24dp_qw1cli.svg" /></div>
                        <Swiper
                        // spaceBetween={50}
                        // modules={[Navigation, Pagination]}
                        slidesPerView={slidesNum}
                        slidesPerGroup={slidesNum}
                        onSwiper={(swiper) => console.log(swiper)}
                        autoplay={{delay: 5000, enabled: false}}
                        navigation={{nextEl: '#second-next', prevEl: '#second-prev'}}
                        pagination
                        speed={1500}
                        >
                                                        {
                                plyteles.map(product => 
                                    <SwiperSlide>
                                    <Link key={product._id} href={`${product.category.slug}/${product.subcategory.slug}/${product.slug}`} passHref>
                                        <a>
                                        <div className="card">
                                            <div className="image-container">
                                                <img src={product.images[0].url} />
                                            </div>
                                            <p>{product.title}</p>
                                            <div className="buttons">
                                                <div className="button">
                                                    DETALIAU
                                                </div>
                                                <div className="price">
                                                    {product.price} €
                                                </div>
                                            </div>
                                        </div>
                                        </a>
                                    </Link>
                                </SwiperSlide>
                                    
                                    )
                            }
                        </Swiper>
                        </div>
                    </div>
            </div>
            <Footer />
        </div>
    )
}

export default index
