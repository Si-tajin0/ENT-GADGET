import React from 'react'
import Hero from './Header/Hero'
import Categories from './Categories/Categories'
import Banners from './Banners/Banners'
import Deals from './Deals/Deals'
import OfferBanner from './Offers-Banner/OfferBanner'
import TopSelling from './Top-Selling/TopSelling'
import HotDeals from './Hot-Deals/HotDeals'
import BestSales from './BestSales/BestSales'
import Banner from './Banner/Banner'
import ShortProducts from './Short-Products/ShortProducts'
import Brands from './Brands/Brands'
import NewArrivals from './New-Arrivals/NewArrivals'
import Benefits from './Benefits/Benefits'


const Index = () => {
  return (
    <>
        <Hero/>
        <Categories/>
        <Banners/>
        <Deals/>
        <OfferBanner/>
        <TopSelling/>
        <HotDeals/>
        <BestSales/>
        <Banner/>
        <ShortProducts/>
        <Brands/>
        <NewArrivals/>
        <Benefits/>
    </>
  )
}

export default Index