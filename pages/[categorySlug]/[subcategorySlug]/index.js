import Head from 'next/head'
import react, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReactSlider from 'react-slider';
import Filter from '../../../components/filter';
import Header from '../../../components/Header';
import { GlobalContext } from '../../../components/contexts/GlobalContext';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import { getUrl } from '../../../services/getUrl';

export async function getStaticProps(context) {

  const categoryRes = await fetch(`${getUrl()}/subcategories?_slug=${context.params.subcategorySlug}`)
  const category = await categoryRes.json()

  const res = await fetch(`${getUrl()}/products/filter?categoryId=${category[0]._id}`)
  const products = await res.json()

  const filtersRes = await fetch(`${getUrl()}/filters`)
  const filters = await filtersRes.json()

  const categoriesRes = await fetch(`${getUrl()}/categories`)
  const categories = await categoriesRes.json()

  if (products.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      products,
      filtersArray: filters,
      categorySlug: context.params.subcategorySlug,
      categoryId: category[0]._id,
      category: category[0],
      categories
      // category
    }, // will be passed to the page component as props
    revalidate: 20
  }
}

  // This function gets called at build time
  export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${getUrl()}/subcategories`)
    const posts = await res.json()

    const paths = posts.map((post) => ({
      params: { 
        categorySlug: post.category.slug, 
        subcategorySlug: post.slug
        },
    }))
  
    return {
        fallback: false,
        paths,
     };
  }

export default function Home({ products, filtersArray, categorySlug, categoryId, category, categories }) {
  // PAGINATION
  // https://stackoverflow.com/questions/60098130/how-do-i-sync-my-url-with-application-state-using-nextjs
  const cartContext = useContext(GlobalContext);
  // spaudziame ant filtro. Paspaudus ant to filtro prides i masyva viena is filtru ir pagal ji pushins i tam tikra routa.
  // tada route.query sureaguos, ir atvaizduos produktus pagal URL paramsus.
  const getFilters = () => {
      let array = [];
      filtersArray.forEach(filter => {
          category.filters.forEach(categoryFilter => {
              if (filter._id == categoryFilter._id) {
                  array.push(filter);
              }
          })
      })

      return array;
  }


  const filters = getFilters();

  const router = useRouter()
  const didMount = useRef(false);

  const [isLoading, setIsLoading] = useState(false);

  const [showSorting, setShowSorting] = useState(false)

  const [selectedChoices, setSelectedChoices] = useState([
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const [priceFilter, setPriceFilter] = useState(() => {
    const pricesArray = filteredProducts.map(product => product.price)
    return {
      priceBigger: Math.min(...pricesArray),
      priceLower: Math.max(...pricesArray)
    }
  })
  
  const [sortBy, setSortBy] = useState('asc');
  const [urlForPagination, setUrlForPagination] = useState('http://localhost:3000/?');
  const [pricesRange, setPricesRange] = useState(() => {
    const pricesArray = products.map(product => product.price)
    return {
      lowest: Math.min(...pricesArray),
      highest: Math.max(...pricesArray)
    }
  })


  useEffect(() => {
    if (didMount.current) {
      let string = `/${category.category.slug}/${categorySlug}?categoryId=${categoryId}&`;
      selectedChoices.forEach(filter => {
          const filterToString = filter.choices.toString()
          string += `choice=${filterToString}&`
      })

      if (priceFilter.priceBigger && priceFilter.priceLower) {
        string += `priceBigger=${priceFilter.priceBigger}&priceLower=${priceFilter.priceLower}&`
      }

      if (sortBy) {
        string += `sort=${sortBy}&`
      }

      setUrlForPagination(`http://localhost:3000${string}`)
      router.push(string, undefined, { shallow: true });
    } else {
      didMount.current = true;
    }
  }, [selectedChoices, priceFilter, sortBy])

  const [myState, setState] = useState({ 
    page: 1,
    filters: []
  });

  useEffect(() => {
    if (didMount.current) {
      let string = `${getUrl()}/products/filter?categoryId=${categoryId}&`;
      if (router.query.priceBigger && router.query.priceLower) {
        string += `priceBigger=${router.query.priceBigger}&priceLower=${router.query.priceLower}&`
      }
  
      if (router.query.choice) {
        // check if array
        if (Array.isArray(router.query.choice)) {
          router.query.choice.forEach(choiceId => {
            if (choiceId.includes(',')) {
              const splitted = choiceId.split(',');
              string += `choice=`
              splitted.forEach(item => {
                if (splitted[splitted.length-1] === item){
                  string += `${item}&`
                 } else {
                  string += `${item},`
                 }
              })
            } else {
              string += `choice=${choiceId}&`
            }
          })
        } else {
          if (router.query.choice.includes(',')) {
            const splitted = router.query.choice.split(',');
            string += `choice=`
            splitted.forEach(item => {
              if (splitted[splitted.length-1] === item){
                string += `${item}&`
               } else {
                string += `${item},`
               }
            })
          } else {
            string += `choice=${router.query.choice}&`
          }
        }
      }
  
      if (router.query.page) {
        string += `page=${router.query.page}&`
      }

      if (router.query.sort) {
        string += `sort=${router.query.sort}&`
      }
  

      if (string == `${getUrl()}/products/filter?categoryId=${categoryId}&`) {
        return;
      } else {
        setIsLoading(true);
        axios.get(string)
        .then(res => {
          setFilteredProducts(res.data);
          setIsLoading(false);
        })
        .catch(e => console.log(e))
      }
  
    } else {
      didMount.current = true;
    }

  
  }, [router.query]);

  const addFilter = (filterWithChoice) => {
    const newFilter = filterWithChoice.filter;
    const newChoice = filterWithChoice.choice;

    if (filterWithChoice.filter == 'price') {
      if (selectedChoices.length > 0) {
        selectedChoices.forEach(filter => {
          if (filter.filter == newFilter) {
             const array = selectedChoices.map(item => {
               item.filter == newFilter ? {...item, choice: [newChoice[0], newChoice[1]]} : item
             })

             setSelectedChoices(array);
          } else {
            setSelectedChoices([...selectedChoices, { selectedFilter: 'price', choice:[newChoice[0], newChoice[1]] }])
          }
        })
      } else {
        setSelectedChoices([...selectedChoices, { selectedFilter: 'price', choice:[newChoice[0], newChoice[1]] }])
      }
    }

    // JEI PRIDETAS BENT VIENAS FILTRAS
    if (selectedChoices.length > 0) {
      // SUKAM PER PRIDETUS FILTRUS
      const hasFilter = selectedChoices.some(item => item.selectedFilter === newFilter);

      selectedChoices.forEach(filter => {
        // TIKRINAM AR TARP PRIDETU FILTRU NERA NAUJO PASIRINKTO FILTRO

        if (filter.selectedFilter === newFilter) {
          // tikrinam ar musu pasirinktam filtre toks choice egzistuoja
            if (filter.choices.includes(newChoice)) {
              // jei musu pasirinktam filtre toks choice egzistuoja - istriname choice.
              const newChoices = filter.choices.filter(choice => choice !== newChoice)
              const updatedChoices = selectedChoices.map(choice => 
                choice.selectedFilter == newFilter ? {...choice, choices: newChoices} : choice
              )
              setSelectedChoices(updatedChoices);

              if (filter.choices.length < 2) {
                const newArray = selectedChoices.filter(choice => choice.selectedFilter !== newFilter);
                setSelectedChoices(newArray);
              }
            } else {
              // jei musu pasirinktam filtre toks choice neegzistuoja - pridedame choice.
              const updatedChoices = selectedChoices.map(choice => 
                choice.selectedFilter == newFilter ? {...choice, choices: [...choice.choices, newChoice]} : choice
                )
                setSelectedChoices(updatedChoices);
            }
          // const newArray = selectedChoices.filter(choice => choice.selectedFilter !== newFilter);
          //   setSelectedChoices(newArray);
        } else {
          if (!hasFilter) {
            setSelectedChoices([...selectedChoices,
              {
              selectedFilter: newFilter,
              choices: [newChoice]
              }
          ])
          }
        }
      })
    } else {
      
      setSelectedChoices([...selectedChoices,
        {
        selectedFilter: newFilter,
        choices: [newChoice]
        }
    ])
    }
  }

  const handleEvent = (e, props) => {
    e.target.addEvenListener('onmouseup', () => {
      setPriceFilter({priceLower: props[1], priceBigger: props[0]});
    })
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
        <div className="wrapper">
        <Header getItemsCount={cartContext.getItemsCount}/>
        <Nav categories={categories} />
        </div>
        <div className="content">
          <div className="wrapper">
            <div className="filters">
              <p className="title">
                FILTRAI
              </p>
              <div className="filters-list">
                
                {
                  filters.map(filter => 
                    <Filter key={filter._id} filter={filter} addFilter={addFilter} selectedChoices={selectedChoices}/>
                    )
                }
                    <div className="filter">
                    <p className="filter-title">Kaina</p>
                    <input type="text" value={priceFilter.priceBigger} onChange={(e) => setPriceFilter({...priceFilter, priceBigger: e.target.value})}/>
                    <input type="text" value={priceFilter.priceLower} onChange={(e) => setPriceFilter({...priceFilter, priceLower: e.target.value})} />
                    <ReactSlider
                        className="horizontal-slider"
                        thumbClassName="example-thumb"
                        trackClassName="example-track"
                        defaultValue={[pricesRange.lowest, pricesRange.highest]}
                        ariaLabel={['Lower thumb', 'Upper thumb']}
                        min={Math.round(pricesRange.lowest) - 1}
                        max={Math.round(pricesRange.highest) + 1}
                        ariaValuetext={state => `Thumb value ${state.valueNow}`}
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                        pearling
                        minDistance={1}
                        onAfterChange={(props) => setPriceFilter({priceLower: props[1], priceBigger: props[0] })}
                        // onChange={(e, props) => handleEvent(e, props)}
                    />
                    </div>
              </div>
            </div>
            <div className="products">
              <h1>{category.title}</h1>
              <div className="sorting">
                <div className="container">
                  <div className="button" onClick={() => setShowSorting(!showSorting)}>
                    <img src='https://res.cloudinary.com/dhkph6uck/image/upload/v1635267333/expand_more_black_24dp_1_mvtigl.svg' /> Rikiuoti pagal
                  </div>
                {
                  showSorting && 

                  <ul>
                    <li onClick={() => {setSortBy('asc'); setShowSorting(false)}}>Kain?? (nuo pigiausi??)</li>
                    <li onClick={() => {setSortBy('desc'); setShowSorting(false)}}>Kain?? (nuo brangiausi??)</li>
                  </ul>
                }
                </div>
              </div>
              <div className="products-grid">
                {/* <img src="https://res.cloudinary.com/dhkph6uck/image/upload/v1635172657/1497_j98hiv.gif" /> */}
                {
                  isLoading ?
                  <div className="loader">
                    <img className="loader" src="https://res.cloudinary.com/dhkph6uck/image/upload/v1635172657/1497_j98hiv.gif" />
                  </div>
                  :
                  filteredProducts.map(product =>
                    <Link key={product._id} href={`/${category.category.slug}/${categorySlug}/${product.slug}`} passHref>
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
                                  {product.price} ???
                              </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                    )
                }
                {/* <Link href="/" passHref>
                  <a>
                <div className="card">
                  <div className="image-container">
                      <img src="https://mokivezi.lt/media/cache/sylius_shop_product_original/img/7020327.jpg" />
                  </div>
                  <p>Trinkel?? grindinio BRIKERS DOMINO-5 Pilka, Matmenys 280 x 140 x 50 mm, be nuo??ul??</p>
                  <div className="buttons">
                      <div className="button">
                          DETALIAU
                      </div>
                      <div className="price">
                          18.00 ???
                      </div>
                  </div>
                </div>
                </a>
                </Link>
                <Link href="/" passHref>
                  <a>
                <div className="card">
                  <div className="image-container">
                      <img src="https://mokivezi.lt/media/cache/sylius_shop_product_original/img/7020327.jpg" />
                  </div>
                  <p>Trinkel?? grindinio BRIKERS DOMINO-5 Pilka, Matmenys 280 x 140 x 50 mm, be nuo??ul??</p>
                  <div className="buttons">
                      <div className="button">
                          DETALIAU
                      </div>
                      <div className="price">
                          18.00 ???
                      </div>
                  </div>
                </div>
                </a>
                </Link>
                <Link href="/" passHref>
                  <a>
                <div className="card">
                  <div className="image-container">
                      <img src="https://mokivezi.lt/media/cache/sylius_shop_product_original/img/7020327.jpg" />
                  </div>
                  <p>Trinkel?? grindinio BRIKERS DOMINO-5 Pilka, Matmenys 280 x 140 x 50 mm, be nuo??ul??</p>
                  <div className="buttons">
                      <div className="button">
                          DETALIAU
                      </div>
                      <div className="price">
                          18.00 ???
                      </div>
                  </div>
                </div>
                </a>
                </Link>
                <Link href="/" passHref>
                  <a>
                <div className="card">
                  <div className="image-container">
                      <img src="https://mokivezi.lt/media/cache/sylius_shop_product_original/img/7020327.jpg" />
                  </div>
                  <p>Trinkel?? grindinio BRIKERS DOMINO-5 Pilka, Matmenys 280 x 140 x 50 mm, be nuo??ul??</p>
                  <div className="buttons">
                      <div className="button">
                          DETALIAU
                      </div>
                      <div className="price">
                          18.00 ???
                      </div>
                  </div>
                </div>
                </a>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        </main>

        {/* {
            <div>
              {JSON.stringify(myState)}
              {[1, 2, 3, 4, 5].map(page => (
                <Link href={`${urlForPagination}page=${page}`} key={page}>
                  <a>page {page}</a>
                </Link>
              ))}
            </div>
        } */}
    </div>
  )
}
