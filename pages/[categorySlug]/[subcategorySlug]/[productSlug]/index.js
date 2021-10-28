import React, { useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { SRLWrapper } from "simple-react-lightbox";
import { GlobalContext } from '../../../../components/contexts/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Header from '../../../../components/Header';
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import { getUrl } from '../../../../services/getUrl';

export async function getStaticProps(context) {

    const productsRes = await fetch(`${getUrl()}/products?_slug=${context.params.productSlug}`)
    const product = await productsRes.json()

    const categoriesRes = await fetch(`${getUrl()}/categories`)
    const categories = await categoriesRes.json()

    if (product.length === 0) {
        return {
          notFound: true,
        }
      }
  
    return {
      props: {
        product: product[0],
        categories
        // category
      }, // will be passed to the page component as props
      revalidate: 20
    }
  }

    // This function gets called at build time
    export async function getStaticPaths() {
        // Call an external API endpoint to get posts
        const res = await fetch(`${getUrl()}/products`)
        const posts = await res.json()
    
        const paths = posts.map((post) => ({
          params: { 
            productSlug: post.slug,
            categorySlug: post.category.slug, 
            subcategorySlug: post.subcategory.slug
            },
        }))
      
        return {
            fallback: false,
            paths,
         };
      }

function index({product, categories}) {


    const [quantity, setQuantity] = useState(1);
    const [showCartModal, setShowCartModal] = useState(false);

    const cartContext = useContext(GlobalContext)

    const otherProductImages = [];
    for (let i = 1; i < product.images.length; i++) {
        otherProductImages.push(product.images[i]);
    }

    const handleAddToCart = (product) => {
        // ADD TO CART LOGIC
        const { id, slug, title, images, price, Filter} = product;
        let cartItem = {
            id,
            slug, 
            title, 
            images,
            price,
            Filter,
            categorySlug: product.category.slug,
            subcategorySlug: product.subcategory.slug,
            quantity: quantity
        };

        if (cartContext.items.find(item => item.id == product._id)) {
            cartContext.items.forEach(item => {
                if (item.id == product._id) {
                    const newArray = cartContext.items.map(cartProduct => {
                        if (cartProduct.id == product._id) {
                            return {...cartProduct, quantity: cartProduct.quantity + quantity}
                        } else {
                            return cartProduct
                        }
                    })
                    cartContext.setItems(newArray);
                    setShowCartModal(true);
                    setTimeout(() => {
                        setShowCartModal(false)
                    }, 10000)
                }
            })
        } else {
            cartContext.addToCart(cartItem);
            setShowCartModal(true);
            setTimeout(() => {
                setShowCartModal(false)
            }, 10000)
        }
    }

    return (
    <div>
        <Head>
            <title>Ukrainos granitas</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
            <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>

        <main>
            <AnimatePresence>
            {
                showCartModal &&

                <motion.div 
                    className="cart-modal"
                    initial={{ x: 500}}
                    animate={{ x: 0 }}
                    exit={{ x: 500 }}
                    transition={{ type: 'tween'}}
                >
                    <div className="flex">
                        <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1635334994/done_white_24dp_qxlwmp.svg" />Prekė pridėta į krepšelį
                    </div>
                    <Link href={`/cart`} passHref>
                        <div className="cart-button">
                        <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1634711517/shopping_cart_black_24dp_j5mbky.svg" /> Eiti į krepšelį
                        </div>
                    </Link>
                </motion.div>
            }
            </AnimatePresence>
            <div className="wrapper">
                <Header getItemsCount={cartContext.getItemsCount} />
                <Nav categories={categories}/>
            </div>
            <div className="product">
                <div className="wrapper">
                        <div className="flex">
                            <div className="left">
                            <SRLWrapper>
                                <div className="image">
                                
                                    <a href={product.images[0].url}>
                                        <img src={product.images[0].url} />
                                        {/* <img src='https://unsplash.it/500/300' /> */}
                                    </a>
                                </div>
                                <div className="images-list">
                                    {
                                        otherProductImages.map(image =>
                                            <a href={image.url} key={image.url}>
                                                <img src={image.url} />
                                            </a>
                                        )
                                    }
                                </div>
                                </SRLWrapper>
                            </div>
                            <div className="right">
                                <h1>{product.title}</h1>
                                <div className="code">
                                    Prekės kodas: 12345678
                                </div>
                                <div className="price">
                                    Kaina: {product.price} €
                                </div>
                                <p className="quantity-label">Kiekis:</p>
                                <div className="quantity">
                                    <div className="quantity-down" onClick={() => { if (quantity >= 2) setQuantity(quantity-1) }}>
                                        -
                                    </div>
                                    <div className="score">
                                    {quantity}
                                    </div>
                                    <div className="quantity-up" onClick={() => setQuantity(quantity+1)}>
                                        +
                                    </div>
                                </div>
                                <div className="add-to-basket" onClick={() => handleAddToCart(product)}>
                                    Į KREPŠELĮ
                                </div>
                                <div className="quantity-left">
                                    Prekių kiekis sandėlyje: {product.quantity}
                                </div>
                            </div>
                    </div>
                    <div className="table">
                        <div className="left">
                            <div className="top">
                                <p>Ypatybės</p>
                            </div>
                            <div className="components">
                                <ul>
                                    {
                                        product.Filter.map(filter => 
                                            <li key={filter._id}>
                                                {filter.title} {filter.choices.map(choice => choice.value)}
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="right">
                            <div className="top">
                                <p>Aprašymas</p>
                            </div>
                            <div className="components">
                                <ReactMarkdown>
                                 {product.description}
                                 </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    </div>
    )
}

export default index
