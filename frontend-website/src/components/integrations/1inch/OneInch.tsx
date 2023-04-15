import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './OneInch.module.scss'
import DarkMode from '@material-design-icons/svg/outlined/dark_mode.svg'
import LightMode from '@material-design-icons/svg/outlined/light_mode.svg'
import { useEffect, useState } from 'react'
import Selector from '@/components/Selector/Selector'


const OneInch: React.FC = () => {
  
  return (
    <div className={styles['out__container']}>
      <div className={styles['integration__setup']}>
        <div className={styles['integration__title']}>
          1inch
        </div>
        <div className={styles['integration__description']}>
          Buy any ERC 20 tokens through 1inch's swap with just a credit card
        </div>
        <Selector options={[ {label:'test1', value: "1"}, {label:'test2', value: "1"}, {label:'test3', value: "1"}]} defaultOption = "test1" onChange={()=>{}}/>
        
      </div>
      <div className={styles['wallet__widget']}>

      </div>

    </div>
  )
}

export default OneInch
