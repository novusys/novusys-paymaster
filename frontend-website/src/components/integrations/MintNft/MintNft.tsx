import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './MintNft.module.scss'
import DarkMode from '@material-design-icons/svg/outlined/dark_mode.svg'
import LightMode from '@material-design-icons/svg/outlined/light_mode.svg'
import { useEffect, useState } from 'react'


const MintNft: React.FC = () => {
  
  return (
    <div className={styles['out__container']}>
      <div className={styles['integration__setup']}>
        <div className={styles['integration__title']}>
          Mint Nft
        </div>
        <div className={styles['integration__description']}>
          Mint your unique blob art designed at ETHGlobal San francisco!
        </div>
        <div className={styles['integration__price']}>
          Price: 0.01 ETH
        </div>

        <div className={styles['integration__image']}>
          <img src='/logos/exchanges/mint.png' />
        </div>
      </div>
      <div className={styles['wallet__widget']}>

      </div>

    </div>
  )
}

export default MintNft
