import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './Uniswap.module.scss'
import DarkMode from '@material-design-icons/svg/outlined/dark_mode.svg'
import LightMode from '@material-design-icons/svg/outlined/light_mode.svg'
import { useEffect, useState } from 'react'


const Uniswap: React.FC = () => {
  
  return (
    <div className={styles['out__container']}>
      <div className={styles['integration__setup']}>
        <div className={styles['integration__title']}>
          Uniswap
        </div>
        <div className={styles['integration__description']}>
        Buy any ERC 20 tokens through Uniswap's swap with just a credit card
        </div>
        
      </div>
      <div className={styles['wallet__widget']}>

      </div>

    </div>
  )
}

export default Uniswap
