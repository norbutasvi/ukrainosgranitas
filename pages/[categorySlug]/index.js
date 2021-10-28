import Head from 'next/head'
import Image from 'next/image'
import react, { useEffect, useState, useRef, createContext, useContext } from 'react';
import qs from 'qs';
import axios from 'axios';
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReactSlider from 'react-slider';
import Filter from '../../components/filter';
import Header from '../../components/header';
import { GlobalContext } from '../../components/contexts/GlobalContext';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { getUrl } from '../../services/getUrl';

export async function getStaticProps(context) {

  const categoriesRes = await fetch(`${getUrl()}/categories`)
  const categories = await categoriesRes.json();

  const category = categories.filter(category => category.slug == context.params.categorySlug);


  const subcategoriesRes = await fetch(`${getUrl()}/subcategories?_category=${category[0]._id}`)
  const subcategories = await subcategoriesRes.json()

  if (subcategories.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      subcategories,
      category,
      categories
      // category
    }, // will be passed to the page component as props
    revalidate: 20
  }
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch(`${getUrl()}/categories`)
  const posts = await res.json()

  const paths = posts.map((post) => ({
    params: { categorySlug: post.slug },
  }))

  return {
      fallback: false,
      paths,
   };
}

export default function Home({ subcategories, category, categories }) {
  // PAGINATION
  // https://stackoverflow.com/questions/60098130/how-do-i-sync-my-url-with-application-state-using-nextjs

  // spaudziame ant filtro. Paspaudus ant to filtro prides i masyva viena is filtru ir pagal ji pushins i tam tikra routa.
  // tada route.query sureaguos, ir atvaizduos produktus pagal URL paramsus.

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

      <main>
        <div className="wrapper">
          <Header getItemsCount={cartContext.getItemsCount}/>
          <Nav categories={categories} />
          {/* <div className="navigation">
              <ul>
                {
                  subcategories.map(subcategory =>
                    
                    <Link href={`/${category[0].slug}/${subcategory.slug}`} passHref shallow>
                      <a>
                        <li>
                          {subcategory.title}
                        </li>
                      </a>
                    </Link>
                    )
                  }
              </ul>
          </div> */}
          <div className="subcategories">
          {
              subcategories.map(subcategory =>
                
                <Link key={subcategory._id} href={`/${category[0].slug}/${subcategory.slug}`} passHref shallow>
                  <a>
                    <div className="item">
                      <div className="left">
                        <h1>{subcategory.title}</h1>
                      </div>
                      <div className="right" style={{ backgroundImage: `url('${subcategory.image.url}')`}}>
                      </div>
                    </div>
                  </a>
                </Link>
                )
            }
          </div>
        </div>
        <Footer />
        </main>
    </div>
  )
}
