import React from 'react'
import Link from 'next/link';

function Nav({categories}) {
    return (
        <div className="navigation">
            <ul>
                {
                    categories.map(category =>
                        <Link href={`/${category.slug}`} passHref>
                            <a>
                                <li>
                                    {category.title}
                                </li>
                            </a>
                        </Link>
                    )
                }
            </ul>
        </div>
    )
}

export default Nav
